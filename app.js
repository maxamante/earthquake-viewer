// Flow
// - [ ] Make a request to USGS
function* requestEarthquakeData(){
  let quakeEndpoint = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  while(true){
    yield fetch(quakeEndpoint,{
      method: 'get'
    }).then(function(d){
      var json = d.json();
      return json;
    });
  }
}

// - [ ] Parse request
const quakeData = requestEarthquakeData();
quakeData.next().value.then(function(data) {
  let quakes = `Earthquakes from the past 30 days:<br/>`;
  for (let quake of data['features']) {
    // - [ ] Make earthquakes clickable
    quakes += `<a class="quakeEntry" href="#">
      ${quake['id']}, ${quake['properties']['place']}
      <div class="quakeDetails">
        ${JSON.stringify(quake, null, 2)}
      </div>
    </a><br/>`;
  }
  document.querySelector('.main').innerHTML = quakes;

  return new Promise((resolve) => {
    // - [ ] Show detail on click
    for (let entry of document.querySelectorAll('.quakeEntry')) {
      entry.addEventListener('click', function(event) {
        const currState = event.target.children[0].style.visibility;
        event.target.children[0].style.visibility = currState === 'visible' ? 'hidden' : 'visible';
      });
    }
  });
});
