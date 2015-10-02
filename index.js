var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var https = require("https");
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var getMetaValues = function(input) {
  var $ = cheerio.load(input)
  var meta = $('meta');
  var metaValues = new Object();
  for (var i = 0; i < meta.length; i++) {
    var attributes = meta[i].attribs;
    if (attributes.property == "og:image") metaValues.ogImage = attributes.content;
    if (attributes.property == "og:video") metaValues.ogVideo = attributes.content;
  }
  return metaValues;
}

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res){
  var photoPageURL = req.body.photoPageURL;

  if (photoPageURL.indexOf("https://instagram.com/p/") == -1) {
    res.render('index', {
      errorMessage: 'that\'s not an instagram page link :|',
      userValue: photoPageURL
    });
  }

  request(photoPageURL, function(error, response, html){
    if(!error){
      var metaValues = getMetaValues(html);
      if (metaValues.ogVideo) {
        res.redirect(metaValues.ogVideo);
      } else if (metaValues.ogImage) {
        res.redirect(metaValues.ogImage);
      } else {
        res.render('index', {
          errorMessage: 'sorry. something went wonky. :(',
          userValue: photoPageURL
        });
      }
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});