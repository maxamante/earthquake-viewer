'use strict';

window.fetch = jest.fn(() => new Promise(resolve => resolve()));
const app = require('./app.js');


describe('buildAppNav', () => {
  it('builds a set of [refresh, share] links', () => {
    const expected = '' +
      '<a href="#refresh" class="button refresh">Refresh</a> '+
      '<a href="#share" class="button share">Share</a> '+
    '';
    expect(app.buildAppNav()).toBe(expected);
  });
});

describe('buildPageLinks', () => {
  it('builds a set of [<<,<,1,2,3,4,6,7,8,9,>,>>] link and "5" label if current page is 5 and total pages is 20', () => {
    const currPage = 5;
    const totalEntries = 20 * 20;
    const expected = '' +
      '<a href="#1" class="firstPage"><<</a> '+
      '<a href="#4" class="backPage"><</a> '+
      '<a href="#1" class="pageLink">1</a> | '+
      '<a href="#2" class="pageLink">2</a> | '+
      '<a href="#3" class="pageLink">3</a> | '+
      '<a href="#4" class="pageLink">4</a> | '+
      '<span class="currPage">5</span> | '+
      '<a href="#6" class="pageLink">6</a> | '+
      '<a href="#7" class="pageLink">7</a> | '+
      '<a href="#8" class="pageLink">8</a> | '+
      '<a href="#9" class="pageLink">9</a> '+
      '<a href="#6" class="nextPage">></a> '+
      '<a href="#20" class="lastPage">>></a>'+
    '';
    expect(app.buildPageLinks(totalEntries, currPage)).toBe(expected);
  });
});

describe('buildPageLinksWithContext', () => {
  it('builds a set of [1,2,3,4,6,7,8,9] links and "5" label if current page is 5 and total pages is 20', () => {
    const currPage = 5;
    const totalPages = 20;
    const expected = '' +
      '<a href="#1" class="pageLink">1</a> | '+
      '<a href="#2" class="pageLink">2</a> | '+
      '<a href="#3" class="pageLink">3</a> | '+
      '<a href="#4" class="pageLink">4</a> | '+
      '<span class="currPage">5</span> | '+
      '<a href="#6" class="pageLink">6</a> | '+
      '<a href="#7" class="pageLink">7</a> | '+
      '<a href="#8" class="pageLink">8</a> | '+
      '<a href="#9" class="pageLink">9</a>'+
    '';
    expect(app.buildPageLinksWithContext(currPage, totalPages)).toBe(expected);
  });

  it('builds a set of [9,10,11,12,14,15,16,17] links and "13" label if current page is 13 and total pages is 20', () => {
    const currPage = 13;
    const totalPages = 20;
    const expected = '' +
      '<a href="#9" class="pageLink">9</a> | '+
      '<a href="#10" class="pageLink">10</a> | '+
      '<a href="#11" class="pageLink">11</a> | '+
      '<a href="#12" class="pageLink">12</a> | '+
      '<span class="currPage">13</span> | '+
      '<a href="#14" class="pageLink">14</a> | '+
      '<a href="#15" class="pageLink">15</a> | '+
      '<a href="#16" class="pageLink">16</a> | '+
      '<a href="#17" class="pageLink">17</a>'+
    '';
    expect(app.buildPageLinksWithContext(currPage, totalPages)).toBe(expected);
  });

  it('builds a set of [1,2,4,5] links and "3" label if current page is 3 and total pages is 5', () => {
    const currPage = 3;
    const totalPages = 5;
    const expected = '' +
      '<a href="#1" class="pageLink">1</a> | '+
      '<a href="#2" class="pageLink">2</a> | '+
      '<span class="currPage">3</span> | '+
      '<a href="#4" class="pageLink">4</a> | '+
      '<a href="#5" class="pageLink">5</a>'+
    '';
    expect(app.buildPageLinksWithContext(currPage, totalPages)).toBe(expected);
  });
});

describe('computePageLinkStartNum', () => {
  it('computes 0 if current page is 1', () => {
    const currPage = 1;
    const totalPages = 20;
    const maxLinks = 9;
    const expected = 0;
    expect(app.computePageLinkStartNum(currPage, totalPages, maxLinks)).toBe(expected);
  });

  it('computes 0 if current page is -9000', () => {
    const currPage = -9000;
    const totalPages = 20;
    const maxLinks = 9;
    const expected = 0;
    expect(app.computePageLinkStartNum(currPage, totalPages, maxLinks)).toBe(expected);
  });

  it('computes 6 (zero-based) if current page is 11 and total pages is 50', () => {
    const currPage = 11;
    const totalPages = 50;
    const maxLinks = 9;
    const expected = 6;
    expect(app.computePageLinkStartNum(currPage, totalPages, maxLinks)).toBe(expected);
  });

  it('computes 41 (zero-based) if current page is 50 and total pages is 50', () => {
    const currPage = 50;
    const totalPages = 50;
    const maxLinks = 9;
    const expected = 41;
    expect(app.computePageLinkStartNum(currPage, totalPages, maxLinks)).toBe(expected);
  });

  it('computes 41 (zero-based) if current page is 9000 and total pages is 50', () => {
    const currPage = 9000;
    const totalPages = 50;
    const maxLinks = 9;
    const expected = 41;
    expect(app.computePageLinkStartNum(currPage, totalPages, maxLinks)).toBe(expected);
  });
});

describe('computeDate', () => {
  it('computes the local date from timestamp', () => {
    const ts = -14159025;
    const expected = new Date(ts).toLocaleDateString();
    expect(app.computeDate(ts)).toBe(expected);
  });
});

describe('computeTime', () => {
  it('computes the local time from timestamp', () => {
    const ts = -14159025;
    const expected = new Date(ts).toLocaleTimeString();
    expect(app.computeTime(ts)).toBe(expected);
  });
});

describe('computeNextPage', () => {
  it('computes page after 1 to be 2 if 5 pages total', () => {
    const currPage = 1;
    const totalPages = 5;
    expect(app.computeNextPage(currPage, totalPages)).toBe(currPage + 1);
  });

  it('computes page after 5 to be 5 if 5 pages total', () => {
    const currPage = 5;
    const totalPages = 5;
    expect(app.computeNextPage(currPage, totalPages)).toBe(totalPages);
  });

  it('computes page after -9000 to be 2 if 5 pages total', () => {
    const currPage = -9000;
    const totalPages = 5;
    const expected = 2;
    expect(app.computeNextPage(currPage, totalPages)).toBe(expected);
  });

  it('computes page after 9000 to be 5 if 5 pages total', () => {
    const currPage = 9000;
    const totalPages = 5;
    expect(app.computeNextPage(currPage, totalPages)).toBe(totalPages);
  });
});

describe('computeBackPage', () => {
  it('computes page before 2 to be 1', () => {
    const currPage = 2;
    const totalPages = 5;
    expect(app.computeBackPage(currPage, totalPages)).toBe(currPage - 1);
  });

  it('computes page before 1 to be 1', () => {
    const currPage = 1;
    const totalPages = 1;
    const expected = 1;
    expect(app.computeBackPage(currPage, totalPages)).toBe(expected);
  });

  it('computes page before -9000 to be 1', () => {
    const currPage = -9000;
    const totalPages = 5;
    const expected = 1;
    expect(app.computeBackPage(currPage, totalPages)).toBe(expected);
  });

  it('computes page before 9000 to be 4 if 5 pages total', () => {
    const currPage = 9000;
    const totalPages = 5;
    expect(app.computeBackPage(currPage, totalPages)).toBe(totalPages - 1);
  });
});
