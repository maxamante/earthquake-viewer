'use strict';

window.fetch = jest.fn(() => new Promise(resolve => resolve()));
const app = require('./app.js');

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
