var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.setMaxListeners(50);

channel.on('join', function(id, client) {
    console.log(id + ' joined.');
    
    var welcome = 'Welcome!\n' + 'Guests online: ' +
                    this.listeners('broadcast').length;
    client.write(welcome + '\n');
    this.clients[id] = client;
    this.subscriptions[id] = function(senderId, message) {
        if (id !== senderId) {
            this.clients[id].write(message);   
        }
    };
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id) {
    channel.removeListener('broadcast', 
                           this.subscriptions[id]);
    channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
    channel.emit('broadcast', '', 'Chat has shut down.\n');
    channel.removeAllListeners('broadcast');
});



var server = net.createServer(function(client) {
    var id = client.remoteAddress + ':' + client.remotePort;
    console.log(id + ' connected.');
    channel.emit('join', id, client); 
    
    client.on('data', function(data) {
        data = data.toString();
        console.log(id + ' says: ' + data);
        
        if (data === 'shutdown\r\n') {
            channel.emit('shutdown');   
        }
        
        if (data === 'fire error\r\n') {
            channel.emit('error',
                         new Error('Something is wrong.'));
        }
        /*
        if (data === 'fire error without 2nd arg\r\n') {
            channel.emit('error');
        }
        */
        if (data === 'fire unregistered event\r\n') {
            channel.emit('unregistered event');
            console.log('Nothing happended\n');
        }
        
        channel.emit('broadcast', id, data);
    });
    
    client.on('close', function() {
        channel.emit('leave', id); 
    });
});

server.listen(8888);