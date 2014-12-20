//
// View
// A basic view that supports manually-managed
// nested children
//

var View = AbstractView.extend({

  // Options to be merged onto each instance
  viewOptions: ['childViews'],

  constructor: function(options) {
    Puppets.mergeOptions(this, options, this.viewOptions);
    this._regions = {};
    AbstractView.prototype.constructor.apply(this, arguments);

    // If there's no template, then this view is unlikely to be re-rendered,
    // and we can attach the childViews immediately. Otherwise, they'll be
    // attached each time the view is rendered
    if (!this.template) {
      this._addRegions(this.childViews);
    }
  },

  render: function(options) {
    this.trigger('before:render', this, options);

    // Generate the new DOM tree
    var htmlString = Puppets.renderTemplate(this.template);
    var domTree = $.parseHTML(htmlString);

    // Create the regions and copy
    // over the HTML from the current tree

    // Empty the contents of our element,
    // then append the new tree
    this.$el.empty().append(domTree);

    this.trigger('render', this, options);
    return this;
  },

  showChildView: function(selector, view, options) {
    var region = this._getRegion(selector);
    if (!region) { this._throwRegionError(); }
    region.show(view, options);
    return this;
  },

  getChildView: function(selector) {
    return this._getRegion(selector).currentView();
  },

  // Return the region, if it exists. If not,
  // create the region and return it
  _getRegion: function(selector) {
    var region = this._regions[selector];
    return region ? region : this._addRegion(selector);
  },

  // Create a new region. Optionally pass it a view
  // to display on creation
  _addRegion: function(selector, definition) {
    // Don't override existing regions
    if (this._regions[selector]) { return; }
    var el = this.$(selector)[0];
    if (!el) { this._throwRegionError(selector); }
    var fnDefinition = _.isFunction(definition);
    var options = {
      selector: selector,
      el: el,
      view: fnDefinition ? definition : definition.view,
      viewOptions: fnDefinition ? {} : definition.options
    };
    var region = this._createRegion(options);
    region._parent = this;
    this._regions[selector] = region;
    return this;
  },

  _addRegions: function(regionDefinitions) {
    _.each(regionDefinitions, function(view, selector) {
      this._addRegion(selector, view);
    }, this);
    return this;
  },

  _createRegion: function(options) {
    return new this.Region(options);
  },

  _throwRegionError: function(selector) {
    throw new Error('The selector "' + selector + '" must exist to create a region.');
  }
});

Puppets.View = View;
