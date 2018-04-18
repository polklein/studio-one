$(document).ready(function() {
  console.log('ready');

  var recordList;

  var recordItem = $('.record-item');
  var recordDetails = $('#record-detail-overlay');
  var recordListing = $('#record-listing');

  var image = $('#record-image');
  var title = $('#record-title');
  var artist = $('#record-artist');
  var description = $('#record-description');
  var goBack = $('#back-btn, #buffalo-back-btn');
  var openRecord;  		// holds open record id (for next/prev button)


  $.getJSON('./records.json', function(data) {
    recordList = data;

    // Load record (overlay details)
    recordItem.on('click', function(event) {
      event.preventDefault();
	  openRecord = parseInt(this.id);
	  changeToRecord(openRecord);
    });

	// Previous record button handler
	$('.prev-btn').on('click', function(event){
      event.preventDefault();
      // Decrement open record and change overlay details
      if (--openRecord < 0)
        openRecord = recordList.length - 1;
	    changeToRecord(openRecord);
    });

	// Next record button handler
	$('.next-btn').on('click', function(event){
      event.preventDefault();
      // Increment open record and change overlay details
      if (++openRecord >= recordList.length)
        openRecord = 0;
	    changeToRecord(openRecord);
    });

	  function changeToRecord(id) {
		  var currentRecord = $('#'+id).find('.song-title').text();
		  $.each(recordList, function(key, val) {
			if (val.name == currentRecord) {
			  image.attr('src', val.photo);
			  title.text(val.name);
			  artist.text(val.artist);
			  description.text(val.description);
			}
		});
	  $('body').addClass('show-details');
	  recordDetails.show();
	  recordDetails.scrollTop(0);
	  recordListing.css('opacity', '0.01');
	  recordListing.css('opacity', '0.01');
	  // force back button on record detail view to show record list
	  if (window.history && window.history.pushState) {
		window.history.pushState(null, null, 'listing.html');
		$(window).on('popstate', function() {
		  $('body').removeClass('show-details');
		  recordDetails.hide();
		  recordListing.css('opacity', '1');
		});
	  }
    }

    // overlay details close
    goBack.on('click', function(event) {
      event.preventDefault();
      $('body').removeClass('show-details');
      recordDetails.hide();
      recordListing.css('opacity', '1');
      var top = ($("#"+openRecord).offset()).top - 300;  // 300: height of each record thumbnail
      console.log("top: " + top);
      $(document).scrollTop(top);
    });
  });


  // Sorting record list (alphabetical || chronological)
  var chronologicalList = $('.chronological');
  var alphabeticalList = $('.alphabetical');

  $('#alpha-sort').on('click', function(e) {
    e.preventDefault();
    console.log('alpha');
    chronologicalList.hide();
    alphabeticalList.show();
    $('#chron-sort').removeClass('selected-sort');
    $(this).addClass('selected-sort');
  });
  $('#chron-sort').on('click', function(e) {
    e.preventDefault();
    console.log('chron');
    alphabeticalList.hide();
    chronologicalList.show();
    $('#alpha-sort').removeClass('selected-sort');
    $(this).addClass('selected-sort');
  });


  // Searching / filtering record list
  var searchBox = $('#record-search');

  // modified from https://stackoverflow.com/a/23404334
  searchBox.keyup(function () {
    var noResults = document.getElementById('no-results');
    var searchList = document.querySelectorAll('.record-item');
    var hidden = 0;
    var filter_array = new Array();
    var filter = this.value.toLowerCase();  // no need to call jQuery here

    filter_array = filter.split(' '); // split the user input at the spaces

    var arrayLength = filter_array.length; // Get the length of the filter array

    $('.record-item').each(function() {
        /* cache a reference to the current .record-item (you're using it twice) */
        var _this = $(this);
        var title = _this.find('.record-name').text().toLowerCase();

        /*
            title and filter are normalized in lowerCase letters
            for a case insensitive search
         */

        var hid = 0; // Set a flag to see if a div was hidden

        // Loop through all the words in the array and hide the div if found
        for (var i = 0; i < arrayLength; i++) {
             if (title.indexOf(filter_array[i]) < 0) {
                _this.hide();
                hid = 1;
            }
        }
        // If the flag hasn't been tripped show the div
        if (hid === 0)  {
           _this.show();
        }
    });
     // looping through the list to count how many records are hidden (don't fall within search parameters)
    for (var j = 0; j < searchList.length; j++) {

      if (searchList[j].style.display == 'none') {
        hidden++;
      }
    }
    // if none of the records fit the search, then a no results message should show
    if (hidden === searchList.length) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  });

});
