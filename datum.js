'use strict';

var moment = require('moment-range');

/**
 * Representation of Date filterable collection.
 *
 * @constructor
 * @param {Array} collection Array of objects.
 * @param {String} key Name of the key that holds the date.
 * @param {String} format Date format for when date is a string.
 * @api public
 */
function Datum(collection, key, format) {
  this.collection = collection;
  this.key = key || 'date';
  this.format = format;
}

/**
 * Additional date parsing.
 *
 * @param {String|Date} date Date to parse to moment.
 * @returns {Moment|undefined}
 * @api public
 */
Datum.parse = Datum.prototype.parse = function parse(date) {
  var datum = moment(date)
    , exec;

  //
  // The parsing was done by the moment library it self. Ignore our own human
  // date parser.
  //
  if (datum.isValid()) return datum.startOf('day');

  if ((exec = /(\d+)\s?(\w)+/g.exec(date))) {
    datum = moment().subtract(
      +exec[1],
      exec[2].charAt(exec[2].length) !== 's'
      ? exec[2] +'s'
      : exec[2]
    );

    if (datum.isValid()) return datum.startOf('day');
  }

  switch (date) {
    case 'now':
    case 'today':
      datum = moment();
    break;

    case 'last-day':
    case 'last day':
    case 'yesterday':
      datum = moment().subtract(1, 'days');
    break;

    case 'last-week':
    case 'last week':
      datum = moment().subtract(1, 'days');
    break;

    case 'last-month':
    case 'last month':
      datum = moment().subtract(1, 'months');
    break;

    case 'last-year':
    case 'last year':
      datum = moment().subtract(1, 'years');
    break;

    //
    // Not format matches, our last resort is that the data was given to us the
    // supplied format.
    //
    default:
      if (this.format) {
        datum = moment(date, this.format);
      }
  }

  return datum && datum.isValid()
  ? datum.startOf('day')
  : undefined;
};

/**
 * Filter the collection. This filter function will receive the date from the
 * collection and should return true or false as indication if the row should be
 * returned.
 *
 * @param {Function} fn Filter function
 * @returns {Array}
 * @api private
 */
Datum.prototype.filter = function filter(fn) {
  return this.collection.filter(function filterArray(row) {
    var date = this.parse(row[this.key]);

    //
    // Always exclude fields that doesn't have a proper date set.
    //
    if (!date) return false;
    return fn(date);
  }, this);
};

/**
 * Return all items after the given date query.
 *
 * @param {String} query Date query.
 * @returns {Array}
 * @api public
 */
Datum.prototype.after = function after(query) {
  query = this.parse(query);

  return this.filter(function filter(date) {
    return date.isAfter(query);
  });
};

/**
 * Return all items before the given date query.
 *
 * @param {String} query Date query.
 * @returns {Array}
 * @api public
 */
Datum.prototype.before = function before(query) {
  query = this.parse(query);

  return this.filter(function filter(date) {
    return date.isBefore(query);
  });
};

/**
 * Return all items within the given date range.
 *
 * @param {String} start Start date.
 * @param {String} end End date.
 * @api public
 */
Datum.prototype.within = function within(start, end) {
  start = this.parse(start);
  end = this.parse(end);

  var range = moment.range(start, end);
  console.log(range);

  return this.filter(function filter(date) {
    return date.within(range);
  });
};

//
// Expose the Datum collection.
//
module.exports = Datum;
