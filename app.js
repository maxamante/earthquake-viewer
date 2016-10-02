'use strict';
// To allow
let ns = {};

// simple jquery port
// setup aliases
const $ = ns.$ = window.$ = function(selector) {
  const entries = (() => {
    if (typeof selector === 'string') {
      return document.querySelectorAll(selector);
    }
    return selector;
  })();

  entries.html = function(newHtml) {
    if (newHtml === undefined) {
      return entries.innerHTML;
    }
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      entry.innerHTML = newHtml;
    }
  };

  entries.hide = function() {
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      entry.style.display = 'none';
    }
  };

  entries.show = function() {
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      entry.style.display = '';
    }
  };

  entries.each = function(fn) {
    Array.prototype.forEach.call(entries, fn);
  };

  entries.click = function(fn) {
    selector.addEventListener("click", fn, false);
  };

  entries.is = function(otherSelector) {
    let el = entries[0];
    console.log(otherSelector);
    if (otherSelector === ':visible') {
      return el.offsetWidth > 0 || el.offsetHeight > 0;
    }
    return (el.matches ||
            el.matchesSelector ||
            el.msMatchesSelector ||
            el.mozMatchesSelector ||
            el.webkitMatchesSelector ||
            el.oMatchesSelector)
            .call(el, otherSelector);
  }

  return entries;
}

// - [ ] Make a request to USGS
const requestEarthquakeData = ns.requestEarthquakeData = function*(){
  const quakeEndpoint = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';
  while(true){
    yield fetch(quakeEndpoint, {method: 'get'}).then(function(d){
      return d.json();
    });
  }
};
const refreshQuakeData = ns.refreshQuakeData = function() {
  return requestEarthquakeData().next().value.then(data => data);
};

// - [ ] Parse request
const parseQuakeData = ns.parseQuakeData = function(data) {
  const entriesPerPage = 20;
  const quakeEntries = data['features'];
  const totalEntries = quakeEntries.length;
  const currPage = window.location.hash.split('#')[1] || 1;
  const startEntryIndex = currPage * entriesPerPage;
  const endEntryIndex = startEntryIndex + entriesPerPage;

  let quakes = '';
  for (let i = startEntryIndex; i < endEntryIndex; i++) {
    let quake = quakeEntries[i];

    if (quake === undefined) {
      break;
    }

    let props = quake['properties'];
    let geo = quake['geometry'];
    let date = computeDate(props['time']);
    let time = computeTime(props['time']);
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

const buildAppNav = ns.buildAppNav = function() {
  let nav = '<a href="#refresh" class="button refresh">Refresh</a> ';
  nav += '<a href="#share" class="button share">Share</a> ';
  // nav += '<a href="#change" class="button change">Change Days</a>';
  return nav;
};

const buildPageLinks = ns.buildPageLinks = function(totalEntries, currPage) {
  totalEntries = totalEntries || quakeData['features'].length;
  currPage = currPage || (window.location.hash !== undefined && parseInt(window.location.hash.split('#')[1])) || 1;

  const entriesPerPage = 20;
  const totalPages = Math.round(totalEntries / entriesPerPage);

  let links = `<a href="#1" class="firstPage"><<</a> `;
  links += `<a href="#${computeBackPage(currPage, totalPages)}" class="backPage"><</a> `;
  links += buildPageLinksWithContext(currPage, totalPages);
  links += ` <a href="#${computeNextPage(currPage, totalPages)}" class="nextPage">></a>`;
  links += ` <a href="#${totalPages}" class="lastPage">>></a>`;

  return links;
};

const buildPageLinksWithContext = ns.buildPageLinksWithContext = function(currPage, totalPages) {
  // Validate params
  currPage = currPage != '' && parseInt(currPage) || 1;

  const maxPageLinks = 9;
  const links = new Array(maxPageLinks);
  const startNum = computePageLinkStartNum(currPage, totalPages, maxPageLinks);
  const lastLinkNum = startNum + maxPageLinks;

  for (let i = startNum; i < lastLinkNum; i++) {
    const linkNum = i + 1;
    links[i] = `<a href="#${linkNum}" class="pageLink">${linkNum}</a> | `;
  }
  links[currPage - 1] = `<span class="currPage">${currPage}</span> | `;
  links[lastLinkNum - 1] = links[lastLinkNum - 1].split('|')[0].trim();
  return links.join('');
};

const computePageLinkStartNum = ns.computePageLinkStartNum = function(currPage, totalPages, maxPageLinks) {
  const middleLinkIndex = Math.round(maxPageLinks / 2);
  let startNum = 0;
  if (currPage >= totalPages - middleLinkIndex + 1) {
    startNum = totalPages - maxPageLinks;
  }
  else if (currPage >= middleLinkIndex) {
    startNum = currPage - middleLinkIndex;
  }
  return startNum;
};

const computeDate = ns.computeDate = function(timestamp) {
  return new Date(timestamp).toLocaleDateString();
};

const computeTime = ns.computeTime = function(timestamp) {
  return new Date(timestamp).toLocaleTimeString();
};

const computeNextPage = ns.computeNextPage = function(currPage, totalPages) {
  let nextPage = totalPages;
  if (currPage < 2) {
    nextPage = 2;
  }
  else if (currPage + 1 < totalPages) {
    nextPage = currPage + 1;
  }
  return nextPage;
};

const computeBackPage = ns.computeBackPage = function(currPage, totalPages) {
  let backPage = 1;
  if (currPage > totalPages) {
    backPage = totalPages - 1;
  }
  else if (currPage - 1 > 0) {
    backPage = currPage - 1;
  }
  return backPage;
};

const initApp = ns.initApp = function(data) {
  // let appNav = buildAppNav();
  // let app = `<div class="nav">${appNav}</div>`;

  let pageLinks = buildPageLinks();
  let app = '<div class="title">Earthquakes from the past 30 days:</div>';
  app += `<div class="pageLinks">${pageLinks}</div>`;
  app += '<div class="quakes">';
  app += parseQuakeData(data);
  app += '</div>';
  app += `<div class="pageLinks">${pageLinks}</div>`;

  // Show parsed quake data
  $('#main').html(app);
  // user interation ops
  setInteractions();
};

const setInteractions = ns.setInteractions = function() {
  // Set app UX
  // - [ ] Make earthquakes clickable
  // - [ ] Show detail on click
  // First hide all details
  $('.quakeDetails').hide();

  // Then on click show details
  $('.quakeEntry').each(function(entry, i) {
    $(entry).click(function(event) {
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
};

let quakeData;
const handleHashChange = ns.handleHashChange = function(event) {
  $('.pageLinks').html(buildPageLinks());
  $('.quakes').html(parseQuakeData(quakeData));
  setInteractions();
}

//main()
const main = ns.main = function() {
  // preload ops
  // Let user know something is loading
  $('#main').html('<div class="loading">Loading quake data from the last 30 days...</div>');

  // load ops
  // Build app
  refreshQuakeData()
  .then(data => {
    quakeData = data;
    initApp(data);
  });

  window.addEventListener('hashchange', handleHashChange, false);
};
main();

// try-catch hack to allow testing, but avoid console error
try {exports = module.exports = ns;}
catch(err) {/* Expected; No action*/}
