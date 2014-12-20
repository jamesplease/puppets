//
// Region
// An object that controls an area of a
// View where we want to display children.
// Regions are implementation details and
// should rarely, if ever, be modified directly
//

var Region = function(options) {
  Puppets.mergeOptions(this, options, this.regionOptions);
  this.cid = _.uniqueId('r');
  this.selector = options.selector;
  this._setView(options.view, options.viewOptions);
};

_.extend(Region.prototype, {
  regionOptions: ['view', 'viewOptions', 'el', 'selector'],

  currentView: function() {
    return this._view;
  },

  cloneTree: function() {
    return this._view.$el.clone(true, true);
  },

  // Show a new view in this region
  show: function(view, options) {
    options = options || {};

    // Only create a new view of the same Class
    // if force is passed as true
    if (this._view instanceof view && !options.force) { return; }
    this._disposeView();
    this._setView(view, options);
  },

  // Set the view on the region, set this as its parent,
  // then render it
  _setView: function(view, viewOptions) {
    if (!view) { return; }
    this._view = this._createView(view, viewOptions);
    this._view._parent = this;
    this._view.render();
  },

  // Creates a view with the el set to be this region's el
  _createView: function(View, viewOptions) {
    return new View(_.extend({}, viewOptions, {el: this.el}));
  },

  // Dispose the current view
  _disposeView: function() {
    var view = this.currentView();
    if (!view) { return; }
    view.dispose();
  }
}, Backbone.Events);

Region.extend = Puppets.extend;

Puppets.Region = Region;
