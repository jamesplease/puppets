Puppets.extend = Backbone.Model.extend;

Puppets.$ = Backbone.$;

// Merge `keys` from `options` onto `target`
Puppets.mergeOptions = function(target, options, keys) {
  if (!options) { return; }
  _.extend(target, _.pick(options, keys));
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
Puppets.listenToObject = function(obj, events) {
  Puppets._listenToApi(obj, events, 'listenTo');
};

// Stop listening to a hash of events
Puppets.stopListeningToObject = function(obj, events) {
  Puppets._listenToApi(obj, events, 'stopListening');
};

Puppets._listenToApi = function(obj, events, methodName) {
  if (!obj || !events) { return; }
  _.each(events, function(method, event) {
      if (!_.isFunction(method)) { method = this[method]; }
      this[methodName](obj, event, method);
  }, this);
};

// A helper function, similar to _.result,
// that will return the property on obj, unless obj
// is undefined or null. Passes the 3rd params
// as arguments to the property, if it is a method
Puppets.attempt = function(obj, property, args, precheck) {
  if (!obj) { return; }
  var fn = obj[prop];
  if (precheck || _.isFunction(fn)) {
    var apply = _.isArray(args);
    return apply ? fn.apply(obj, args) : fn(args);
  }
};
