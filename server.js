// Require the Dependencies
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

// Express Setup
var app = express();

// Public Folder
app.use(express.static(__dirname + '/public'));

// Connect Handlebars
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({
    extended: false
}));


// MongoDB directory
var db = 'mongodb://localhost/mongoHeadlines';

// Connect to Mongoose
mongoose.connect(db, function(err){
	// log any errors connecting with mongoose
  if(err){
    console.log(err);
  } 
  // or log a success message
  else {
    console.log('mongoose connection is sucessful');
  }
});

// Routes file 
var routes = require('./config/routes.js');

    app.use('/', routes);
    app.use('/test', routes);
    app.use('/fetch', routes);
    app.use('/gather', routes);
    app.use('/check', routes);
    app.use('/save', routes);
    app.use('/delete', routes);


// Set up Port
var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("The power level is over " + port + " plus another 6000 lol ;P");
});






