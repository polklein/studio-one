/*jshint esversion: 6*/
var container = document.querySelector('#record-listing');
var search = document.querySelector('#record-search');
var alpha = document.getElementById('alpha-sort');
var chron = document.getElementById('chron-sort');
var loader = document.getElementById('loader');
var noResults = document.getElementById('no-results');

var reader = new XMLHttpRequest();
reader.onload = function() {
  if (this.readyState == 4 && this.status == 200) {

    var recordList = JSON.parse(this.responseText);

    if (localStorage.sort == 'alpha' || !localStorage.sort) {
      alpha.style.background = 'url(img/sort.png)';
      alpha.style.backgroundSize = 'cover';
      recordList = sortAlpha(recordList);
      setRecords(recordList);
    } else if (localStorage.sort == 'chron') {
      chron.style.background = 'url(img/sort.png)';
      chron.style.backgroundSize = 'cover';
      recordList = sortChron(recordList);
      setRecords(recordList);
    }

    search.onkeyup = function() {
      searchRecords(recordList);
    };
    search.onsubmit = function() {
      searchRecords(recordList);
    };

    alpha.onclick = function () {
      search.value = '';
      localStorage.clear();
      localStorage.sort = 'alpha';
      alpha.style.background = 'url(img/sort.png)';
      alpha.style.backgroundSize = 'cover';
      chron.style.background = 'white';
      resetGrid();
      recordList = sortAlpha(recordList);
      setRecords(recordList);
    };
    chron.onclick = function () {
      search.value = '';
      localStorage.clear();
      localStorage.sort = 'chron';
      chron.style.background = 'url(img/sort.png)';
      chron.style.backgroundSize = 'cover';
      alpha.style.background = 'white';
      resetGrid();
      recordList = sortChron(recordList);
      setRecords(recordList);
    };
  }
};
reader.open("GET", "records.json", true);
reader.send();

function resetGrid() {
  container.style.visibility = 'hidden';
  loader.style.visibility = 'visible';
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function searchRecords (recordList) {

  var hidden = 0;
  var searchList = document.querySelectorAll('.record-item');

    for (var i = 0; i < recordList.length; i++) {

      var currArtist = recordList[i].artist.toString().toUpperCase();
      var currName = recordList[i].name.toString().toUpperCase();
      var value = search.value.toString().toUpperCase();

      if (!currArtist.includes(value) && !currName.includes(value)) {
        document.getElementById('record-' + (i + 1)).style.display = 'none';
      } else if (currArtist.includes(value) || currName.includes(value)) {
        document.getElementById('record-' + (i + 1)).style.display = 'inline-block';
      }

      console.log(hi);
    }
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
}

function setRecords (recordList) {
  for (var i = 0; i < recordList.length; i++) {
    //switched record to 'a' tag and name to 'p' tag
    var record = document.createElement('a');
    var overlay = document.createElement('div');
    var name = document.createElement('p');
    record.href = 'record.html';
    name.innerHTML = recordList[i].artist + '<br>' + '<span class="song-title">' + recordList[i].name + '<span>';
    overlay.className = 'record-overlay';
    record.className = 'record-item';
    name.className = 'record-name';
    //added overlay id and changed the id of record so clicking works on mobile and desktop
    overlay.id = i;
    record.id = i;
    name.id = i;
    record.style.backgroundImage = 'url(' + recordList[i].photo + ')';
    record.onclick = function(event) {
      var currentRecord = recordList[event.target.id];
      localStorage.artist = currentRecord.artist;
      localStorage.description = currentRecord.description;
      localStorage.name = currentRecord.name;
      localStorage.photo = currentRecord.photo;
      localStorage.year = currentRecord.year;
      localStorage.id = event.target.id;
    };
    overlay.appendChild(name);
    record.appendChild(overlay);
    container.appendChild(record);
  }
  container.style.visibility = 'visible';
  loader.style.visibility = 'hidden';
}

function nameTrim (name) {
  nameArr = name.split(' ');
  if (nameArr[0].toUpperCase() == 'THE') {
    name = nameArr.splice(1).join(' ');
  }
  return name.toUpperCase();
}

function sortAlpha (array) {
  array.sort(function(a, b) {
    var nameA = nameTrim(a.artist);
    var nameB = nameTrim(b.artist);
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return array;
}

function sortChron (array) {
  if (Array.isArray(array) !== true) {
    return false;
  }
  if (array.length < 2) {
    return array;
  }
    var less = [];
    var greater = [];
    var pivot = array[0];
    for (var y = 1; y < array.length; y++) {
      if (array[y].year < pivot.year) {
        less.push(array[y]);
      } else {
        greater.push(array[y]);
      }
    }
  array = sortChron(less).concat(pivot, sortChron(greater));
  return array;
}