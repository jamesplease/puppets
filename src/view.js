//
// View
// The primary view in Puppets, it supports
// manually-managed nested children
//

var View = AbstractView.extend({

  // Options to be merged onto each instance
  viewOptions: ['childViews'],

  // The default Region class. In most instances
  // you should not need to override this
  region: Puppets.Region,

  constructor: function(options) {
    Puppets.mergeOptions(this, options, this.viewOptions);
    this._regions = {};
    AbstractView.prototype.constructor.apply(this, arguments);

    // If there's no template, then this view is unlikely to be re-rendered,
    // and we can attach the childViews immediately. Otherwise, they'll be
    // attached each time the view is rendered
    if (!this.template && this.childViews) {
      this._addRegions(this.childViews);
    }
  },

  // An intelligent render function. Renders the template,
  // and does not destroy any nested views
  render: function(options) {
    this.trigger('before:render', this, options);

    // Generate the new DOM tree. We wrap it in a div so that we can
    // easily sort through the children to find selectors. The
    // wrapper is removed at the end
    var htmlString = '<div>' + Puppets.renderTemplate(this.template) + '</div>';
    var $domTree = Puppets.$($.parseHTML(htmlString));

    // If our regions are empty, then we should instantiate
    // them if we have specified children views
    if (_.isEmpty(this._regions) && this.childViews) {
      this._addRegions(this.childViews, $domTree);
    }

    // Otherwise, we need to check each of them to see if they're empty
    // If they are, then we ignore it. If they are, 
    else {
      _.each(this._regions, function(region) {
        $domTree.find(region.selector).replaceWith(region.cloneTree());
      }, this);
    }

    // Empty the contents of our element,
    // then append the new tree. We use .children()
    // to remove the div wrapper from above
    this.$el.empty().append($domTree.contents());

    this.trigger('render', this, options);
    return this;
  },

  // Display `view` in the region specified by `selector`
  showChildView: function(selector, view, options) {
    var region = this._getRegion(selector);
    if (!region) { this._throwRegionError(); }
    region.show(view, options);
    return this;
  },

  // Retrieve the `view` contained in `selector`
  getChildView: function(selector) {
    return this._getRegion(selector).currentView();
  },

  // Return the region, if it exists. If not,
  // create the region and return it
  _getRegion: function(selector) {
    var region = this._regions[selector];
    return region ? region : this._addRegion(selector);
  },

  // Add a new region to this view, if we don't
  // already have one. Optionally pass it a view
  // to display on creation
  _addRegion: function(selector, definition, $tree) {
    $tree = $tree || this.$el;
    // Don't override existing regions
    if (this._regions[selector]) { return; }
    var $el = $tree.find(selector);
    if (!$el) { this._throwRegionError(selector); }
    var fnDefinition = _.isFunction(definition);
    var options = {
      selector: selector,
      el: $el,
      view: fnDefinition ? definition : definition.view,
      viewOptions: fnDefinition ? {} : definition.options
    };
    var region = this._createRegion(options);
    region._parent = this;
    this._regions[selector] = region;
    return this;
  },

  // Add a hash of regions. Used internally to create the `childViews`
  _addRegions: function(regionDefinitions, $tree) {
    _.each(regionDefinitions, function(view, selector) {
      this._addRegion(selector, view, $tree);
    }, this);
    return this;
  },

  // The method that creates a new region
  _createRegion: function(options) {
    return new this.region(options);
  },

  // If this view's element has been cloned, then we need to update
  // its region's references recursively
  _updateRegions: function() {
    _.each(this._regions, function(region) {
      region._updateEl(this.$el.find(region.selector));
    }, this);
  },

  // Regions require that their selectors exist, otherwise this error is thrown
  _throwRegionError: function(selector) {
    throw new Error('The selector "' + selector + '" must exist to create a region.');
  }
});

Puppets.View = View;
