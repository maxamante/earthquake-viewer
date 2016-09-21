// Flow

// - [ ] Make a request to USGS
const requestEarthquakeData = function*(){
  let quakeEndpoint = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  while(true){
    yield fetch(quakeEndpoint, {method: 'get'}).then(function(d){
      return d.json();
    });
  }
};

const buildPageLinks = function(total) {
  const entriesPerPage = 20;
  const numPages = Math.ceil(total / entriesPerPage);
  let links = '<a href="#" class="backPage"><</a> ';

  for (let i = 1; i < 10; i++) {
    links += `<a href="#${i}" class="pageLink">${i}</a> | `;
  }
  if (numPages > 11) {
    links += `<a href="#10" class="pageLink">10</a> ... <a href="#${numPages}" class="pageLink">${numPages}</a>`;
  }

  links += ' <a href="#" class="nextPage">></a>';

  return links;
};

const computeDate = function(timestamp) {
  return new Date(timestamp).toLocaleDateString();
};

// - [ ] Parse request
const quakeData = requestEarthquakeData();

//main()
// Let user know something is loading
$('#main').html('<div class="loading">Loading quake data from the last 30 days...</div>');
quakeData.next().value.then(function(data) {
  let pageLinks = buildPageLinks(data['features'].length);
  let quakes = `<div class="title">Earthquakes from the past 30 days:</div>`;

  for (let quake of data['features']) {
    let props = quake['properties'];
    let geo = quake['geometry'];
    let date = computeDate(props['time']);
    // - [ ] Make earthquakes clickable
    quakes += `<div class="quakeEntry">
      ${date} - ${props['title']}
      <div id="${quake['id']}" class="quakeDetails">
        <ul>
          <li>id: <a href="${props['url']}">${quake['id']}</a></li>
          <li>place: ${props['place']}</li>
          <li>time: ${new Date(props['time']).toLocaleTimeString()}</li>
          <li>magnitude: ${props['mag']}</li>
          <li>type: ${props['type']}</li>
          <li>coordinates: ${geo['coordinates']}</li>
        </ul>
      </div>
    </div><br/>`;
  }
  // Show parsed quake data
  $('#main').html(quakes);

  // - [ ] Show detail on click
  // First hide all details
  $('.quakeDetails').hide();
  // Then on click show details
  $('.quakeEntry').each(function() {
    $(this).click(function(event) {
      let detailsId = '#' + event.target.children[0].id;
      let isVisible = $(detailsId).is(':visible');
      if (isVisible) {
        $(detailsId).hide();
      }
      else {
        $(detailsId).show();
      }
    })
  });
});
