Puppets.extend = Backbone.Model.extend;

Puppets.$ = Backbone.$;

// Merge `keys` from `options` onto `target`
Puppets.mergeOptions = function(target, options, keys) {
  if (!options) { return; }
  _.extend(target, _.pick(options, keys));
};

// Determine if `el` is a child of the document
Puppets.isNodeAttached = function(el) {
  return Puppets.$.contains(document.documentElement, el);
};

// Configure global template options to be
// used during compilation. Works for both
// Underscore and Handlebars templates
Puppets.templateOptions = {};

// Takes a template string and returns a template function
// This should not be necessary in most situations, as
// you should be precompiling your templates in a build step
// Override this if you're not precompiling and you want to use,
// say, Handlebars
Puppets.compileTemplate = function(templateString, options) {
  return _.template(templateString, _.extend(Puppets.templateOptions, options));
};

// Convert a template function into HTML
// Used by views. This API supports
// Underscore/Lodash/Handlebars templates.
Puppets.renderTemplate = function(compiledTemplate, data) {
  return compiledTemplate(data);
};

// Accepts a hash of events to use for `listenTo`.
Puppets.listenToObject = function(obj, target, events) {
  Puppets._listenToApi(obj, target, events, 'listenTo');
};

// Stop listening to an object's events, specified as a hash
Puppets.stopListeningToObject = function(obj, target, events) {
  Puppets._listenToApi(obj, target, events, 'stopListening');
};

// The internal method to power listenToObject and stopListeningToObject
Puppets._listenToApi = function(obj, target, events, methodName) {
  if (!obj || !target || !events) { return; }
  _.each(events, function(method, event) {
      if (!_.isFunction(method)) { method = obj[method]; }
      obj[methodName](target, event, method);
  });
};
