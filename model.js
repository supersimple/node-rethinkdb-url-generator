module.exports = function(config){
  // Import rethinkdbdash
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
  
  return Url
}