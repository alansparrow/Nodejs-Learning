function Watcher(watchDir, processedDir) {
    this.watchDir       = watchDir;
    this.processedDir   = processedDir;
}

var events = require('events')
    , util = require('util');

util.inherits(Watcher, events.EventEmitter);

var fs = require('fs')
    , watchDir = './watch'
    , processedDir = './done';

Watcher.prototype.watch = function() {
    console.log('In Watcher.watch');
    var watcher = this;
    fs.readdir(this.watchDir, function(err, files) {
        if (err) throw err;
        for (var index in files) {
            watcher.emit('process', files[index]);   
        }
    });
};

Watcher.prototype.start = function() {
    var watcher = this;
    fs.watchFile(watchDir, function() {
        console.log('In WatchFile');
        watcher.watch(); 
    });
};

var watcher = new Watcher(watchDir, processedDir);
watcher.on('process', function process(file) {
    var watchFile = this.watchDir + '/' + file;
    var processedFile = this.processedDir + '/' +
                        file.toLowerCase();
    
    fs.rename(watchFile, processedFile, function(err) {
        if (err) throw err; 
    });
});

console.log('Dir: ' + watchDir + '   ' + processedDir);
watcher.start();