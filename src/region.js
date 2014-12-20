//
// Region
// An object that controls
// an area of a View where
// we want to display children
//

var Region = function(options) {
  Puppets.mergeOptions(this, options, this.regionOptions);
  this.cid = _.uniqueId('r');
  this.selector = options.selector;
  this._setView(options);
};

_.extend(Region.prototype, {
  regionOptions: ['view', 'viewOptions', 'el', 'selector'],

  currentView: function() {
    return this._view;
  },

  // Show a new view in this region
  // To do: destroy the old view and remove references
  show: function(view, options) {
    this._removeView();
    var view = this._createView(view, options);
    this._view = view;
    this._view._parent = this;
    this._view.render();
  },

  // Set the view, if it was passed in
  _setView: function(options) {
    if (!options.view) { return; }
    this._view = this._createView(options.view, options.viewOptions);
    this._view._parent = this;
    this._view.render();
  },

  // Creates a view with the el set to be this region's el
  _createView: function(View, viewOptions) {
    return new View(_.extend({}, viewOptions, {el: this.el}));
  },

  // Remove the view without actually calling .remove
  // If we *did* call remove, then it would remove its
  // element from the page. We don't do that because
  // we need to reuse its element!
  _removeView: function() {
    var view = this.currentView();
    if (!view) { return; }
    view.stopListening();
    delete view.el;
    delete view.$el;
  }
}, Backbone.Events);

Region.extend = Puppets.extend;

Puppets.Region = Region;
