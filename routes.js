module.exports = function(app, Url, express){
  app.use(express.static(__dirname + '/public'));

  app.set('views', __dirname+'/views');
  app.set('view engine', 'jade');
  
  app.get('/admin', function(req, res) {
    var links = Url.orderBy({index: 'createdAt'}).run().then(function(result){
      res.render('admin.jade', {title: '*****URL shortener*****', links: result});
    });
  });

  app.get('/', function(request, response){
    response.sendFile('./index.html');
  });

  app.get('/add/:uri', function(request, response){
    //first, see if this url exists - if so, dont generate a new guid
    var existing_uri = Url.filter({"url": request.params.uri}).run().then(function(result){
      if(result.length > 0){
        response.json(result[0]);
      }else{
        var guid = shortid.generate();
        var expires = null;
        var uri = new Url({"guid": guid, "url": request.params.uri, "expires_at": expires })
        uri.save().then(function(result){
          response.json(result);
        });
      }
    });
  });

  app.get('/add/:expire_days/:uri', function(request, response){
    //first, see if this url exists - if so, dont generate a new guid
    var existing_uri = Url.filter({"url": request.params.uri}).run().then(function(result){
      if(result.length > 0){
        response.json(result[0]);
      }else{
        var guid = shortid.generate();
        var expires = new Date(); expires.setDate(expires.getDate()+parseInt(request.params.expire_days));
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
      if(result.length > 0){
        response.writeHead(301, {
          'Location': result[0].url
        });
        response.end();
      }else{
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write(JSON.stringify({"error": "That link does not exist"}));
        response.end();
      }
    }).error(handleError(response));
  });

  app.get('/lookup/:guid', function(request, response){
    var guid = request.params.guid;  
    var uri = Url.filter({"guid": guid}).run().then(function(result){
      if(result.length > 0){
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(JSON.stringify({"url": result[0].url}));
        response.end();
      }else{
        response.writeHead(404, {"Content-Type": "application/json"});
        response.write(JSON.stringify({"error": "That link does not exist"}));
        response.end();
      }
    }).error(handleError(response));
  });
  
}