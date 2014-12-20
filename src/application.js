//
// Application
// The starting point of any Puppets application.
//

Puppets.Application = function() {
  this.cid = _.uniqueId('c');
  this.initialize.apply(this, arguments);
};

_.extend(Puppets.Application.prototype, {

  // A hook that might be useful during the start-up phase
  // of your application.
  start: function() {
    this.trigger.apply(this, 'start', arguments);
  },

  // If you choose to have multiple applications, then you
  // may also choose to stop the application
  stop: function() {
    this.trigger.apply(this, 'stop', arguments);
  }
}, Backbone.Events);

Puppets.Application.extend = Puppets.extend;
