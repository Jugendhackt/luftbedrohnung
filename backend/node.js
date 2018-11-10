var http = require('http');
var url = require('url');
var fs = require('fs');
var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var mongourl = "mongodb://localhost:27017/";

var dbo = null


var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var q = url.parse(req.url, true).query;
  console.log(q)
    if(q.tmp == null && q.hum == null) return
    var tmp=parseFloat(q.tmp)
    var hum=parseFloat(q.hum)

    var entry = {temperature: tmp, humidity: hum}
    dbo.collection("data").insertOne(entry, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
    });

  var txt = q.tmp + ";" + q.hum;
  fs.appendFile('log.txt', txt+"\n", function (err) {
    if (err) console.log(err);
  });
  res.end(txt);
});


MongoClient.connect(mongourl, function(err, db) {
  if (err) throw err;
  dbo = db.db("mydb");
  server.listen(8080)
});
