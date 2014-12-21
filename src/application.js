//
// Application
// The starting point of any Puppets application.
//

Puppets.Application = function() {
  this.cid = _.uniqueId('app');
  this.initialize.apply(this, arguments);
};

_.extend(Puppets.Application.prototype, {
  initialize: function() {},

  // A hook that might be useful during the start-up phase
  // of your application.
  start: function(options) {
    this.trigger('start', options);
  },

  // If you choose to have multiple applications, then you
  // may also choose to stop the application
  stop: function(options) {
    this.trigger('stop', options);
  }
}, Backbone.Events);

Puppets.Application.extend = Puppets.extend;
