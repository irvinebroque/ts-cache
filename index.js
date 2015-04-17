'use strict';

var Stats = require('fast-stats').Stats
  , moment = require('moment-range')
  , Datum = require('./datum');

/**
 * EMERGED STETS.
 *
 * Options:
 *
 * - format: Format of the date that we store.
 * - stats: Configuration for the fast-stats instance.
 * - fill: Fill the potential gaps of data before generating a stat object.
 *
 * @constructor
 * @param {Object} options Configuration.
 * @api public
 */
function Stets(options) {
  if (!this) return new Stets(options);

  options = options || {};

  this.stets = [];
  this.format = options.format;
  this.faststats = options.stats || {};
  this.fillgaps = 'fill' in options ? options.fill : true;
  this.datum = new Datum(this.stets, 'moment', options.format);
}

require('fusing')(Stets);

/**
 * The amount data points that we've stored so far.
 *
 * @type {Number}
 * @public
 */
Stets.get('length', function length() {
  return this.stets.length;
});

/**
 * Get the current set as Stats instance.
 *
 * @type {Stats}
 * @public
 */
Stets.get('stats', function () {
  if (this.fillgaps) this.fill(0);

  return new Stats(this.faststats).push(this.stets.map(function map(row) {
    return row.data;
  }));
});

/**
 * Add a new data at the end of the set.
 *
 * @param {String|Date} date The date of the data point.
 * @param {Number} data Data for the date.
 * @returns {Stets}
 * @api public
 */
Stets.readable('push', function push(date, data) {
  this.stets.push({
    moment: Datum.parse.call(this, date),
    data: data,
    date: date
  });

  return this;
});

/**
 * Add a new data at the beginning of the set.
 *
 * @param {String|Date} date The date of the data point.
 * @param {Number} data Data for the date.
 * @returns {Stets}
 * @api public
 */
Stets.readable('unshift', function unshift(date, data) {
  this.stets.unshift({
    moment: Datum.parse.call(this, date),
    data: data,
    date: date
  });

  return this;
});

/**
 * Remove the data point at the end of the set.
 *
 * @returns {Object} The stored stat.
 * @api public
 */
Stets.readable('pop', function pop() {
  return this.stets.pop();
});

/**
 * Remove the data point at the beginning of the set.
 *
 * @returns {Object} The stored stat.
 * @api public
 */
Stets.readable('shift', function shift() {
  return this.stets.shift();
});

/**
 * Remove all the gathered stats and start over again.
 *
 * @returns {Stets}
 * @api public
 */
Stets.readable('reset', function reset() {
  this.stets.length = 0;
  return this;
});

/**
 * Generate a range of the added data points so we can iterate over them.
 *
 * @returns {Moment.range}
 * @api public
 */
Stets.readable('range', function range() {
  var start = Infinity
    , end = 0;

  this.stets.forEach(function each(row) {
    var unix = row.moment.unix();

    if (unix < start) start = unix;
    if (unix > end) end = unix;
  });

  return moment().range(new Date(start), new Date(end));
});

/**
 * Generate a JSON representation of the data.
 *
 * @returns {Array}
 * @api public
 */
Stets.readable('toJSON', function toJSON() {
  return this.stets.map(function map(row) {
    return {
      date: row.date,
      data: row.data
    };
  });
});

/**
 * Fill the potential gaps between min and max range.
 *
 * @param {Mixed} value Default value we should fill the set with.
 * @returns {Stets}
 * @api public
 */
Stets.readable('fill', function fill(value) {
  var format = 'YYYY-MM-DD'
    , start = moment([9999])
    , end = moment(0)
    , stets = this
    , dates = [];

  //
  // Default to 0 as value.
  //
  if (value === undefined) value = 0;

  this.stets.forEach(function forEach(row) {
    if (row.moment.isBefore(start)) start = row.moment;
    if (row.moment.isAfter(end)) end = row.moment;

    dates.push(row.moment.format(format));
  });

  moment().range(start, end).by('days', function range(date) {
    if (~dates.indexOf(date.format(format))) return;

    stets.push(date, value);
  });

  return this;
});

/**
 * Sort the allocated stets based on dates.
 *
 * @param {Function} compare Optional custom sort/compare function
 * @returns {Stets}
 * @api public
 */
Stets.readable('sort', function sort(compare) {
  this.stets.sort(function sort(a, b) {
    if (compare) return compare(a.moment, b.moment);

    return b - a;
  });
});

//
// This is one of the magical features, automatic filtering and range selection
// for the stats.
//
['filter', 'before', 'after', 'within'].forEach(function proxy(method) {
  Stets.readable(method, function generated() {
    if (this.fillgaps) this.fill(0);

    var stets = this.datum[method].apply(this.datum, arguments);

    return new Stats(this.faststats).push(stets.map(function map(row) {
      return row.data;
    }));
  });
});

//
// EMERGED EXPESE TEH STETS.
//
module.exports = Stets;
