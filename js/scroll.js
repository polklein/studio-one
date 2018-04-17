/*jshint esversion: 6*/
var scrollHeight = document.body.scrollHeight
var screenHeight = window.innerHeight;

$(document).ready(function() {
	showLoader();
	if(localStorage.id){
		var id = localStorage.id.toString();
		display();
	}


	function display(){
		for(var record = 0; record<=id + 3; record++){
	      if(recordElements[record]){
	        recordElements[record].style.display = 'inline-block';
	      }
      }
	}

	checkStorageId();

	function checkStorageId(){
		if(id){
			showLoader();
			setTimeout(autoScroll, 1200);
  			autoScroll();
  			autoScroll();
  			setTimeout(hideLoader, 1000)
  			//called again to ensure id was binded to set-scroll button before page load
			}
		else{
			showLoader();
			hideLoader();
		}

	}

    function autoScroll(){
		var html = $('#' + id).html();
		if(html){
			$(window).scrollTop($('#' + id).offset().top);
				if(window.pageYOffset == 0){
				//showLoader();
				setTimeout(fallbackAutoScroll(), 1000);	
				fallbackAutoScroll();		
			}
		}
		//used instead of jQuery scrollTop if not loaded in time
		//setTimeout(hideLoader, 1000)
	}

	function showLoader(){
		loader.style.visibility = 'visible';
		container.style.visibility = 'hidden';
	}

	function hideLoader(){
		loader.style.visibility = 'hidden';
		container.style.visibility = 'visible';	
	}

	function fallbackAutoScroll(){
		var record = document.getElementById(id).offsetTop;
		console.log(record)
		var scrollHeight = document.body.scrollHeight
		var screenHeight = window.innerHeight;
		var scrollTop = window.document.body.scrollTop;
		window.scrollBy(0, record);
		console.log('test2', window.pageYOffset)
		if(window.pageYOffset == 0){
			 location.reload();
			//window.scrollBy(0, scrollHeight - scrollTop);
		}
	}

});

$('.home-btn').click(function() {
  localStorage.id = 0;
});

