'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var dns = require('dns');
var { check, validationResult } = require('express-validator');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;
let urlId = 1;
let shortenedUrls = [];
/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/shorturl/:urlId", function(req, res){
  const { urlId } = req.params;
  const shortUrl = shortenedUrls.find(shortUrl => shortUrl.id == urlId);
  if(shortUrl){
    res.redirect(shortUrl.originalUrl);
  }
})

app.post("/api/shorturl/new", check('url').isURL(),function(req, res){
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ "error":"invalid URL" })
  }
  const { url } = req.body;
  
  
  
  dns.lookup(url, function(err){
    if(!err){
      
      var shortUrl = { id: urlId++, originalUrl: url};
      shortenedUrls.push(shortUrl);
  
      res.json({
        "original_url":url, 
        "short_url":shortUrl.urlId 
      })
    }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});