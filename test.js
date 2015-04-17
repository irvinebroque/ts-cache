describe('stets', function () {
  'use strict';

  var Stets = require('./')
    , stet = new Stets()
    , moment = require('moment-range')
    , assume = require('assume');

  beforeEach(function each() {
    stet.reset();
  });

  it('is exported as function', function () {
    assume(Stets).is.a('function');
  });

  describe('#length', function () {
    it('returns a number', function () {
      assume(stet.length).is.a('number');
    });

    it('increments when new data is added', function () {
      assume(stet.length).to.equal(0);
      stet.push(new Date(), 1);
      assume(stet.length).to.equal(1);
    });

    it('decrements when a value is removed', function () {
      assume(stet.length).to.equal(0);
      stet.push(new Date(), 1);
      assume(stet.length).to.equal(1);
      stet.pop();
      assume(stet.length).to.equal(0);
    });
  });

  describe('#push', function () {
    it('adds a new object in the internal stet', function () {
      var date = new Date();
      assume(stet.stets.length).to.equal(0);
      stet.push(date, 1);
      assume(stet.stets[0].data).to.equal(1);
      assume(stet.stets[0].date).to.equal(date);
    });
  });

  describe('#unshift', function () {
    it('adds a new object in the internal stet', function () {
      var date = new Date();
      assume(stet.stets.length).to.equal(0);
      stet.unshift(date, 1);
      assume(stet.stets[0].data).to.equal(1);
      assume(stet.stets[0].date).to.equal(date);
    });
  });

  describe('#pop', function () {
    it('removes object from the internal stet', function () {
      var date = new Date();
      assume(stet.stets.length).to.equal(0);
      stet.unshift(date, 1);
      stet.pop();
      assume(stet.stets.length).to.equal(0);
    });

    it('returns the removed item', function () {
      var date = new Date()
        , foo;

      assume(stet.stets.length).to.equal(0);
      stet.unshift(date, 1);
      foo = stet.pop();
      assume(stet.stets.length).to.equal(0);
      assume(foo.data).to.equal(1);
      assume(foo.date).to.equal(date);
    });
  });

  describe('#shift', function () {
    it('removes object from the internal stet', function () {
      var date = new Date();
      assume(stet.stets.length).to.equal(0);
      stet.unshift(date, 1);
      stet.shift();
      assume(stet.stets.length).to.equal(0);
    });

    it('returns the removed item', function () {
      var date = new Date()
        , foo;

      assume(stet.stets.length).to.equal(0);
      stet.unshift(date, 1);
      foo = stet.shift();
      assume(stet.stets.length).to.equal(0);
      assume(foo.data).to.equal(1);
      assume(foo.date).to.equal(date);
    });
  });

  describe('#fill', function () {
    it('fills the gaps within the dataset', function () {
      stet.push(moment(), 100);
      stet.push(moment().add(15, 'days'), 100);

      assume(stet.stets.length).to.equal(2);
      stet.fill();
      assume(stet.stets.length).to.equal(16);
    });
  });

  describe('.stats', function () {
    it('returns a stats instance', function () {
      var stats = stet.stats;

      assume(stats).is.instanceOf(require('fast-stats').Stats);
    });

    it('comes pre-configurd with all stats', function () {
      stet.push(new Date(), 1);
      stet.push(new Date(), 3);

      var stats = stet.stats;

      assume(stats.amean()).to.equal(2);
      assume(stats.percentile(0)).to.equal(1);
      assume(stats.percentile(100)).to.equal(3);
    });
  });

  describe('stats', function () {
    beforeEach(function () {
      var i = 0;

      moment().range(
        moment().subtract(30, 'days'),
        moment()
      ).by('days', function (moment) {
        stet.push(moment, ++i);
      });
    });

    describe('before', function () {
      it('gets an average of all items before a given stamp', function () {
        var stat = stet.before(moment().subtract(15, 'days'));

        assume(stat).is.instanceOf(require('fast-stats').Stats);
        assume(stat.length).to.equal(15);
      });
    });
  });
});
