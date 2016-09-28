'use strict';

window.fetch = jest.fn(() => new Promise(resolve => resolve()));
const app = require('./app.js');
console.log(app);

describe('computeNextPage', () => {
  it('computes the next page after 3 to be 4 if 10 pages total', () => {
    expect(app.computeNextPage(3, 10)).toBe(4);
  });
});
