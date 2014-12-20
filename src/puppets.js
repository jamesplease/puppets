var previousPuppets = Backbone.Puppets();

var Puppets = Backbone.Puppets = {};

Puppets.VERSION = '<%= version %>';

Puppets.noConflict = function () {
  Backbone.Puppets = previousPuppets;
  return this;
};
