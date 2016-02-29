# url-generator

## Node.js, Express, RethinkDB based URL shortener ##
Along with a vanilla JS bookmarklet, this software will create hashed URLs and add them to a rethinkDB database. The database stores a map of URL=>hashedURL and keeps a count of each time the link is clicked on.

### Bookmarklet ###
The index file in the public directory is a simple page that contains the bookmarklet code. The bookmarklet link can be dragged into the bookmarks bar of your browser to shorten whatever url you are on.
The bookmarklet.js file is also required. The bookmarklet link injects that javascript into the page.

### Future Releases ###
* Create a secure web interface to view the links and analytics.
* An easier way to set everything up.
* Complete react.js implementation
* Build out jasmine tests
