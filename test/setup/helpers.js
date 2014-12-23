function setupTestHelpers() {
  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    this.setFixtures = setFixtures;
    this.clearFixtures = clearFixtures;
    global.stub = _.bind(this.sinon.stub, this.sinon);
    global.spy  = _.bind(this.sinon.spy, this.sinon);
  });

  afterEach(function() {
    clearFixtures();
    this.sinon.restore();
    delete global.stub;
    delete global.spy;
  });
}

var helpers = {};

var node = typeof exports !== 'undefined';
var $ = node ? require('jquery') : $;

// Adds elements to the document
var setFixtures = function () {
  _.each(arguments, function (content) {
    helpers.$fixtures.append(content);
  });
};

// Empties our body
var clearFixtures = function () {
  helpers.$fixtures.empty();
};

if (node) {
  helpers.$fixtures = $('body');
  setupTestHelpers();
}

// when running in browser
else {
  this.global = window;
  mocha.setup('bdd');

  window.expect = chai.expect;
  window.sinon = sinon;

  onload = function() {
    mocha.checkLeaks();
    mocha.globals(['stub', 'spy', 'Puppets']);
    mocha.run();
    helpers.$fixtures = $('#fixtures');
    setupTestHelpers();
  };
}
