var date = new Date();
var getYear = date.getFullYear();
$('#year').text(getYear);

$('#scrape').on('click', function(){
  $.get('/scrape', function(e){
    console.log(e);
  }).done(function(){
    dbtree();
  })
});

const root = 'http://books.toscrape.com';

const dbtree = () => {
  $.getJSON("/articles", function(data) {
    // For each one
   console.log(data);
   data.map(article =>{
    var titleDiv = $('<h5 />').text(article.title);
    var del = $('<div />').text('Delete').attr('class', 'btn btn-sm btn-danger btns-fix');
    var makeNte = $('<div />').text('Make Note').attr({'class': 'btn btn-sm btn-success btns-fix del', 'data-toggle': 'modal', 'data-target': 'modalShow'});
    var linkTag = $('<a />').text('Open Link to Book').attr({'class': 'btn btn-sm btn-primary', 'href': root + article.link, 'target': '_blank'});
    var cardBody = $('<div />').attr('class', 'card-body').append(titleDiv, linkTag, makeNte, del);
    var newCard = $('<div />').attr('class', 'card').append(cardBody);
    var cardDiv = $('<div />').attr('class', 'col-md-4').append(newCard)
    $('#display').append(cardDiv);
   })
    }
    
  );
  
}
//if database is !empty load data
if($.get('/articles')){
dbtree();
}

// Whenever someone clicks a delete button
$('.del').on("click", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});