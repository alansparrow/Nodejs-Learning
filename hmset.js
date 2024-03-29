var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.hmset('camping', {
    'shelter' : '2-person ten',
    'cooking' : 'campstove'
}, redis.print);

client.hget('camping', 'cooking', function(err, value) {
    if (err) {
        throw err;   
    }
    console.log('Will be cooking with: ' + value);
});

client.hkeys('camping', function(err, keys) {
    if (err) {
        throw err;   
    }
    keys.forEach(function(key, i) {
        console.log(' ' + key); 
    });
});