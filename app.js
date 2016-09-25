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
  const currPage = window.location.hash.split('#')[1];

  let links = '<a href="#" class="backPage"><</a> ';
  links += buildPageLinksWithContext(currPage);
  links += ' <a href="#" class="nextPage">></a>';

  return links;
};

const buildPageLinksWithContext = function(currPage) {
  // Validate params
  currPage = currPage != '' && parseInt(currPage) || 1;

  const maxPageLinks = 9;
  const links = new Array(maxPageLinks);

  if (currPage < Math.round(maxPageLinks / 2)) {
    for (let i = 0; i < links.length; i++) {
      const linkNum = i + 1;
      links[i] = `<a href="#${linkNum}" class="pageLink">${linkNum}</a> | `;
    }
    links[currPage - 1] = `<span class="currPage">${currPage}</span> | `;
  }
  // Build links with current page context
  else {
    for (let i = (currPage - 5); i < currPage; i++) {
      const linkNum = i + 1;
      links[i] = `<a href="#${linkNum}" class="pageLink">${linkNum}</a> | `;
    }
    links[currPage - 1] = `<span class="currPage">${currPage}</span> | `;
    for (let i = currPage; i < currPage + 4; i++) {
      const linkNum = i + 1;
      links[i] = `<a href="#${linkNum}" class="pageLink">${linkNum}</a> | `;
    }
  }

  return links.join('');
};

const computeDate = function(timestamp) {
  return new Date(timestamp).toLocaleDateString();
};

const computeTime = function(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
}

//main()
const main = function() {
  // - [ ] Parse request
  const quakeData = requestEarthquakeData();
  // Let user know something is loading
  $('#main').html('<div class="loading">Loading quake data from the last 30 days...</div>');

  quakeData.next().value.then(function(data) {
    let pageLinks = buildPageLinks(data['features'].length);
    console.log(pageLinks);
    let quakes = `<div class="title">Earthquakes from the past 30 days:</div>`;
    quakes += `<div class="pageLinks">${pageLinks}</div>`;

    for (let quake of data['features']) {
      let props = quake['properties'];
      let geo = quake['geometry'];
      let date = computeDate(props['time']);
      let time = computeTime(props['time']);
      // - [ ] Make earthquakes clickable
      quakes += `<div class="quakeEntry">
        ${date} - ${props['title']}
        <div id="${quake['id']}" class="quakeDetails">
          <ul>
            <li>id: <a href="${props['url']}">${quake['id']}</a></li>
            <li>place: ${props['place']}</li>
            <li>time: ${time}</li>
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
}
main();
