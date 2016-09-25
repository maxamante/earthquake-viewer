// - [ ] Make a request to USGS
const requestEarthquakeData = function*(){
  const quakeEndpoint = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  while(true){
    yield fetch(quakeEndpoint, {method: 'get'}).then(function(d){
      return d.json();
    });
  }
};
const refreshQuakeData = function() {
  return requestEarthquakeData().next().value.then(data => parseQuakeData(data));
};

// - [ ] Parse request
const parseQuakeData = function(data) {
  let pageLinks = buildPageLinks(data['features'].length);
  let quakes = '<div class="title">Earthquakes from the past 30 days:</div>';
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
  return quakes;
};

const buildAppNav = function() {
  let nav = '<a href="#refresh" class="button refresh">Refresh</a> ';
  nav += '<a href="#share" class="button share">Share</a> ';
  nav += '<a href="#change" class="button change">Change Days</a>';
  return nav;
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
  const startNum = computePageLinkStartNum(currPage, maxPageLinks);
  const lastLinkNum = startNum + maxPageLinks;

  for (let i = startNum; i < lastLinkNum; i++) {
    const linkNum = i + 1;
    links[i] = `<a href="#${linkNum}" class="pageLink">${linkNum}</a> | `;
  }
  links[currPage - 1] = `<span class="currPage">${currPage}</span> | `;
  links[lastLinkNum - 1] = links[lastLinkNum - 1].split('|')[0];
  return links.join('');
};

const computePageLinkStartNum = function(currPage, maxPageLinks) {
  if (currPage >= Math.round(maxPageLinks / 2)) {
    return currPage - 5;
  }
  return 0;
};

const computeDate = function(timestamp) {
  return new Date(timestamp).toLocaleDateString();
};

const computeTime = function(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
};

//main()
const main = function() {
  // Let user know something is loading
  $('#main').html('<div class="loading">Loading quake data from the last 30 days...</div>');

  // Build app
  let appNav = buildAppNav();
  let app = `<div class="nav">${appNav}</div>`;
  let quakeData = refreshQuakeData();
  quakeData.then(function(data) {
    // Show parsed quake data
    $('#main').html(app + data);

    // Set app UX
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
};
main();
