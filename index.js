// Import express and co
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Load config for RethinkDB and express
var config = require(__dirname+"/config.js")
var shortid = require('shortid');

// Import rethinkdbdash
//var thinky = require('thinky')(config.rethinkdb);
var thinky = require('thinky')(config.rethinkdb);
var r = thinky.r;
var type = thinky.type;

// Create the model
var Url = thinky.createModel("urls", {
    id: type.string(),
    guid: type.string(),
    url: type.string(),
    clicks: type.number().default(0),
    expires_at: type.date(),
    createdAt: type.date().default(r.now())
});

// Ensure that an index createdAt exists
Url.ensureIndex("createdAt");
Url.ensureIndex("guid");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

app.get('/', function(request, response){
  response.send('received');
});

app.get('/add/:uri', function(request, response){
  //first, see if this url exists - if so, dont generate a new guid
  var existing_uri = Url.filter({"url": request.params.uri}).run().then(function(result){
    if(result.length > 0){
      response.json(result);
    }else{
      var guid = shortid.generate();
      var expires = new Date(); expires.setDate(expires.getDate()+1);
      var uri = new Url({"guid": guid, "url": request.params.uri, "expires_at": expires })
      uri.save().then(function(result){
        response.json(result);
      });
    }
  });
});

app.get('/:guid', function(request, response){
  var guid = request.params.guid;  
  var uri = Url.filter({"guid": guid}).update({clicks: r.row("clicks").add(1)}).run().then(function(result){
    //increment the clicks column
    //redirect user to the returned url
    if(response.length > 0){
      response.writeHead(301, {
        'Location': result[0].url
      });
      response.end();
    }else{
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("That link does not exist\n");
      response.end();
    }
  }).error(handleError(response));
});

function deleteExpiredLinks(){
  Url.filter(function(url) {
       return url("expires_at").date().eq(r.now().date())
             .and(url("expires_at").hours().eq(r.now().hours()))
  }).delete();
}

function handleError(res) {
    return function(error) {
        return res.send(500, {error: error.message});
    }
}


var crontab = require('node-crontab');
var jobId = crontab.scheduleJob("30 * * * *", function(){ //This will call this function every hour//
  deleteExpiredLinks();
});

app.listen(config.express.port, function(){
  console.log('listening on port '+config.express.port);
});
