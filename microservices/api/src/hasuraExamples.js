var express = require('express');
var router = express.Router();
var config = require('./config');
var request = require('request');
var fetchAction =  require('node-fetch');

router.route("/").get(function (req, res) {
  res.send("Hello world from app-Neha")
})

router.route("/put_bill").get(function(req, res){
  var url = "https://filestore.bathtub62.hasura-app.io/v1/file";

  // This is the file we are going to upload, replace this with your file
  var file = '';

  var requestOptions = {
  	method: 'POST',
  	headers: {
        "Authorization": "Bearer af49900a647c6452bd8215f753cdc5f1f15fd6de50c8134a"
  	},
  	body: file
  }

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.json();
  })
  .then(function(result) {
  	console.log(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
  });
});

router.route("/get_bill").get(function(req, res){


  var url = "https://filestore.bathtub62.hasura-app.io/v1/file/11f3e127-f34f-44af-b809-7e49e45089f9";

  var requestOptions = {
      "method": "GET",
      "headers": {}
  };

  fetchAction(url, requestOptions)
  .then(function(response) {
  	return response.blob();
  })
  .then(function(result) {
  	console.log(result);
    res.send(result);
  })
  .catch(function(error) {
  	console.log('Request Failed:' + error);
    console.log('file problem!');
  });
});

router.route("/get_articles").get(function (req, res) {
  //Fetch all rows from table - articles
  var selectOptions = {
    url: config.projectConfig.url.data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hasura-User-Id': 0,
      'X-Hasura-Role': 'anonymous'
    },
    body: JSON.stringify({
      'type': 'select',
      'args': {
        'table': 'article',
        'columns': [
          '*'
        ]
      }
    })
  }
  request(selectOptions, function(error, response, body) {
    if (error) {
        console.log('Error from select request: ');
        console.log(error)
        res.status(500).json({
          'error': error,
          'message': 'Select request failed'
        });
    }
    res.json(JSON.parse(body))
  })
})

module.exports = router;
