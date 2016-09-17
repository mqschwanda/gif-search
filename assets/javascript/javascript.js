var search, rating, limit, firstLimit, currentPg, previousSearch, hiddenRating, hiddenLimit, history;
var startCount = 0;
var firstSearch = true;
var historyArray = [];

function printPagination(pgAmount){
  var nav, ul, li, a, span, btnNum, middleCount, middleBtn;
  // make the number of objects odd so that a center can be defined
  if ( (pgAmount & 1) == 0 ) {
    pgAmount = pgAmount + 1;
  }
  //set a variable for the middle of the page amount
  middleCount = (pgAmount + 1)/2;
  // empty current pagination
  $('#print-pagination').empty();
  // append nav and list tags that are the pagination shell
  nav = $('<nav>');
  nav.addClass('text-center');
  nav.attr('aria-label', 'Page navigation');
  ul = $('<ul>');
  ul.addClass('pagination');
  nav.append(ul);
  // create previous button
  li = $('<li>');
  // block the back button action
  if (currentPg == 1) {
    li.addClass("disabled");
  }
  a = $('<a>');
  a.attr({
    'id': 'previous-btn',
    'aria-label': 'Previous',
    'href': '#'
  });
  span = $('<span>');
  span.attr('aria-hidden', 'true');
  span.html('&laquo;');
  ul.append(li.append(a.append(span)));
  for (var i = 1; i < pgAmount + 1; i++) {
    //set starting button based on current page
    if (currentPg <= middleCount) {
      btnNum = i;
    } else {
      btnNum = i + currentPg - middleCount;
    }
    // check if the current page can be displayed as the middle pagination button
    if (currentPg > middleCount) {
      middleBtn = currentPg;
    } else {  // keep the middle pagination button positioned in the middle
      middleBtn = middleCount;
    }
    // build and assign values/attribute to each pg button
    li = $('<li>');
    // adding active class to the button representing the current page
    if (btnNum == currentPg) {
      li.addClass('active');
    }
    a = $('<a>');
    a.attr({
      'id': 'pg'+btnNum+'-btn',
      'data-value': btnNum,
      'href': '#'
    });
    a.text(btnNum);
    a.addClass('pagination-btn');
    ul.append(li.append(a));
  }
  // create next button
  li = $('<li>');
  li.attr('id', 'next-btn-state');
  a = $('<a>');
  a.attr({
    'id': 'next-btn',
    'aria-label': 'Next',
    'href': '#'
  });
  span = $('<span>');
  span.attr('aria-hidden', 'true');
  span.html('&raquo;');
  ul.append(li.append(a.append(span)));
  // print dynamic content
  $('#print-gif').append(nav);
}

function printGifs(results){
  $('#print-gif').empty();
  var panel = $('<div>');
  panel.addClass('panel row-eq-height')
  var col1 = $('<div>');
  col1.addClass('col-xs-4')
  var col2 = $('<div>');
  col2.addClass('col-xs-4')
  var col3 = $('<div>');
  col3.addClass('col-xs-4')
  var col1, col2, col3
  var colCount = 0;
  for (var i = startCount; i < results.length; i++) {
    colCount++;
    var img = $('<img>');
    img.addClass('img-responsive gif');
    img.attr('src', results[i].images.fixed_height_still.url);
    img.data('still', results[i].images.fixed_height_still.url);
    img.data('animate', results[i].images.fixed_height.url);
    if (colCount == 1) {
      col1.append(img);
    }
    if (colCount == 2) {
      col2.append(img);
    }
    if (colCount == 3) {
      col3.append(img);
    }
    if (colCount == 3) {
      colCount = 0;
    }
  }
  panel.append(col1);
  panel.append(col2);
  panel.append(col3);
  $('#print-gif').append(panel);
}

function noData(){
  $('#print-gif').empty();
  var h1 = $('<h1>');
  h1.addClass('text-center zero-results');
  h1.html("YOU FAILED!");
  var h3 = $('<h1>');
  h3.addClass('text-center zero-results');
  h3.html("Your search returned zero results");
  $('#print-gif').append(h1);
  $('#print-gif').append(h3);
}

function printHistory(){
  

  // remove old history if duplicate search is made
  $('#'+search).remove();
  var ul = $('<ul>');
  ul.attr('id', 'print-history-else');
  ul.addClass('nav nav-tabs')
  var li = $('<li>');
  li.addClass('active');
  li.attr('id', search);
  var a = $('<a>');
  a.addClass('nav-history' );
  a.attr('href', '#');
  a.html(search.toUpperCase());
  a.data('input', search);
  a.data('limit', limit);
  a.data('rating', rating);
  ul.append(li.append(a));
  if (firstSearch == true) {
    $('#print-history').append(ul);
    firstSearch = false;
  } else {
    $('#print-history-else').append(li);
    $('#'+previousSearch).removeClass('active');
  }
  previousSearch = search;
}

function getGifs() {
  var queryURL = "http://api.giphy.com/v1/gifs/search?q="+search+"&rating="+rating+"&limit="+limit+"&api_key=dc6zaTOxFJmzC&limit=10";
  $.ajax({
          url: queryURL,
          method: 'GET'
      })
      .done(function(response) {
        console.log(response);
          var results = response.data;
          if (response.data.length > 0) {
            printHistory();
            printGifs(results);
            printPagination(5);
          } else {
            noData();
          }
      });
};

$('#rating-input').on('click', function(){
  hidenRating = $('<option>');
  hidenRating.attr('id', '#rating-input');
  hidenRating.html($('#hide-rating').html());
  $('#hide-rating').remove();
});

$('#limit-input').on('click', function(){
  hiddenLimit = $('<option>');
  hiddenLimit.attr('id', '#rating-input');
  hiddenLimit.html($('#hide-rating').html());
  $('#hide-limit').remove();
});

$('#search-btn').on('click', function(){
  previousSearch = search;
	search = $('#search-input').val().trim();
  rating = $('#rating-input').val();
  limit = $('#limit-input').val();
  // set variables if no selection was made
  if (rating == 'Rating') {
    rating = 'R';
  }
  if (limit == 'Results per Page') {
    limit = 12;
  }
  var history = {'input': input, 'rating': rating, 'limit': limit};
  historyArray.push(history);
  firstLimit = parseInt(limit);
  console.log("History Array:");
  console.log(historyArray);
  console.log("History:");
  console.log(history);
  currentPg = 1;
  getGifs();
});

$('body').on('click', '.pagination-btn', function(){
  startCount = firstLimit * ($(this).data("value")-1);
  limit = firstLimit * $(this).data("value");
  currentPg = $(this).data("value");
  getGifs();
});

$('body').on('click', '#next-btn', function(){
  startCount = parseInt(limit);
  limit = parseInt(limit) + firstLimit;
  currentPg++;
  getGifs();
});

$('body').on('click', '#previous-btn', function(){
  if (startCount > 0) {
    startCount = startCount - firstLimit;
    limit = parseInt(limit) - firstLimit;
    getGifs();
    currentPg = currentPg - 1;
  }
});

$('body').on('click', '.gif', function(){
    var state = $(this).attr('data-state');
    if ( state != 'animate'){
        $(this).attr('src', $(this).data('animate'));
        $(this).attr('data-state', 'animate');
    }else{
        $(this).attr('src', $(this).data('still'));
        $(this).attr('data-state', 'still');
    }
});

$('body').on('click', '.nav-history', function(){
        previousSearch = search;
        search = $(this).data('input');
        rating = $(this).data('rating');
        limit = $(this).data('limit');
        $('#' + $(this).data('input')).addClass('active');
        $('#' + previousSearch).removeClass('active');
        getGifs();
});