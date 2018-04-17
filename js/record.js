/*jshint esversion: 6*/
var image = document.getElementById('record-image');
var title = document.getElementById('record-title');
var artist = document.getElementById('record-artist');
var description = document.getElementById('record-description');

function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

var loadFresh = function() {

    var albumTitle = window.location.hash.split('--').pop().split('-').join(' ');
    var albumArtist = window.location.hash.split('--')[0].split('-').join(' ').slice(1);
    console.log('artist: ' + albumArtist);
    console.log('title: ' + albumTitle);

    $.getJSON( "records.json", function( data ) {
      $.each( data, function( key, val ) {
        // console.log(val.artist + ' - ' + val.name);
        // if (val.name == capitalizeEachWord(albumTitle) && val.artist == capitalizeEachWord(albumArtist)) {
        //   console.log(val);
        //   console.log(val.artist + ' - ' + val.name);
        //   image.src = val.photo;
        //   title.innerHTML = val.name;
        //   artist.innerHTML = val.artist;
        //   description.innerHTML = val.description;
        // }

        if (capitalizeEachWord(albumTitle).includes(val.name) || capitalizeEachWord(albumArtist).includes(val.artist)) {
  
          console.log(val);
          console.log(val.artist + ' - ' + val.name);
          image.src = val.photo;
          title.innerHTML = val.name;
          artist.innerHTML = val.artist;
          description.innerHTML = val.description;
        }
      });
    });
};

var viaListings = function() {
    image.src = localStorage.photo;
    title.innerHTML = localStorage.name;
    artist.innerHTML = localStorage.artist;
    description.innerHTML = localStorage.description;

    var album = artist.innerHTML + '--' + title.innerHTML;
    var urlHash = album.replace(/\s+/g, '-').toLowerCase();

    if(urlHash.indexOf('(') > -1){
      urlHash = urlHash.replace('(', '').replace(')', '');
}

    window.location.hash = '#' + urlHash;

};

$(document).ready(function(){
  console.log('ready');

  if (window.location.hash) {
    console.log('load fresh');
    loadFresh();
  } else {
    console.log('via listings');
    viaListings();
  }

});