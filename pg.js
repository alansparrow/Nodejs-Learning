var pg = require('pg');
var conString = 'tcp://alansparrow:baotrung@localhost:5432/timetrack';

var client = new pg.Client(conString);
client.connect();

client.query(
    'INSERT INTO users ' +
    "(name) VALUES ($1) RETURNING name", ['Bao Trung'], 
    function(err, result) {
        if (err) {
            throw err;   
        }
        console.log(result.rows[0].name);
    }
);

console.log("Finished");