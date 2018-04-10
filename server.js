// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
// Axios (like AJAX from jquery) and cheerio
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");


var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// mongoose to connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongo_mongoose-scraping", {
  useMongoClient: true
});

// Routes

app.get("/scrape", function(req, res) {
  // get html body
  axios.get("http://books.toscrape.com/").then(function(response) {
    // load into cheerio and save into $
    var $ = cheerio.load(response.data);
    // grab every h3 within an article tag
    $("article h3 ").each(function(i, element) {
      // save result object
      var result = {};

      // add text and href of every link and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
     
      // create new article using the empty result object
      db.Article.create(result)
        .then(function(dbArticle) {
          // complete message
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          // error message
          res.json(err);
        });
    });
  });
});

// route to get articles from db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}, function(err, foundArt) {
    if (err) throw err;
    res.json(foundArt);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(article) {
      res.json(article);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body).then(function(dbNote) {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { note: _id },
      { new: true }
    ).then(function(dbArticle){
      res.json(dbArticle).catch(function(err){
        res.json(err);
      })
    })
  });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
