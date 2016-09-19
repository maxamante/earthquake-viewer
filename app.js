// Flow

// Let user know something is loading
$('#main').html('<div class="loading">Loading quake data from the last 30 days...</div>');

// - [ ] Make a request to USGS
function* requestEarthquakeData(){
  let quakeEndpoint = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  while(true){
    yield fetch(quakeEndpoint, {method: 'get'}).then(function(d){
      return d.json();
    });
  }
}

// - [ ] Parse request
const quakeData = requestEarthquakeData();
quakeData.next().value.then(function(data) {
  let quakes = '<div class="title">Earthquakes from the past 30 days:</div>';
  for (let quake of data['features']) {
    // - [ ] Make earthquakes clickable
    quakes += `<a class="quakeEntry" href="#">
      ${quake['id']}, ${quake['properties']['place']}
      <div id="${quake['id']}" class="quakeDetails">
        ${JSON.stringify(quake, null, 2)}
      </div>
    </a><br/>`;
  }
  // Show parsed quake data
  $('#main').html(quakes);

  return new Promise((resolve) => {
    // - [ ] Show detail on click
    // First hide all details
    $('.quakeDetails').hide();
    // Then on click show details
    $('.quakeEntry').each(() => {
      $(this).click((event) => {
        event.preventDefault();
        $('#' + event.target.children[0].id).show();
      })
    });
  });
});
