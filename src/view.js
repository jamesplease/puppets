//
// View
// The primary view in Puppets, it supports
// manually-managed nested children
//

var View = Puppets.AbstractView.extend({

  // Options to be merged onto each instance
  viewOptions: ['childViews'],

  // The default Region class. In most instances
  // you should not need to override this
  region: Puppets.Region,

  constructor: function(options) {
    Puppets.mergeOptions(this, options, this.viewOptions);
    this._regions = {};
    this.$ui = {};
    Puppets.AbstractView.prototype.constructor.apply(this, arguments);

    // If this is a view that is already on the page, then
    // we should attach the 
    if (this._existingEl()) {
      this._createUI();
      this._addRegions(this.childViews);
    }
  },

  // Duck-typing to determine if the view is an existing element
  // We base this off of two facts: whether it has a template,
  // and whether there are children nodes
  _existingEl: function() {
    return !this.template && this.$el.children().length;
  },

  // An intelligent render function. Renders the template,
  // and does not destroy any nested views
  render: function(options) {
    this.trigger('before:render', this, options);

    var data = this._serializeData();

    // Generate the new DOM tree. We wrap it in a div so that we can
    // easily sort through the children to find selectors. The
    // wrapper is removed at the end
    var htmlString = '<div>' + Puppets.renderTemplate(this.template, data) + '</div>';
    var $newEl = Puppets.$(htmlString);

    this._createUI($newEl);

    // If our regions are empty, then we should instantiate
    // them if we have specified children views
    if (_.isEmpty(this._regions) && this.childViews) {
      this._addRegions(this.childViews, $newEl);
    }

    // Otherwise, we need to check each of them to see if they're empty
    // If they are, then we ignore it.
    else {
      _.each(this._regions, function(region) {
        $newEl.find(region.selector).replaceWith(region.cloneTree());
      }, this);
    }

    // Empty the contents of our element,
    // then append the new tree. We use .children()
    // to remove the div wrapper from above
    this.$el.empty().append($newEl.contents());

    if (Puppets.isNodeAttached(this.el)) {
      _.each(this._childViews, function(child) {
        child.trigger('attach', child, this, false);
      });
      this.trigger('attach', this, undefined, true);
    }

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

  // Prepares our model *or* collection for displaying
  // in a template
  _serializeData: function() {
    if (!this.model && !this.collection) { return; }
    return this.model ? this._serializeModel() : { models: this._serializeCollection() };
  },

  // Prepare a model for display in a template
  _serializeModel: function(model) {
    model = model || this.model;
    return _.clone(this.model.attributes);
  },

  // Prepare a collection for display in a template
  _serializeCollection: function(collection) {
    collection = collection || this.collection;
    return collection.map(function(model) { return this._serializeModel(model); }, this);
  },

  // Create cached references to elements within this view
  _createUI: function($el) {
    $el = $el || this.$el;
    _.each(_.result(this, 'ui'), function(selector, name) {
      this.$ui[name] = $el.find(selector);
    }, this);
  },

  // Return the region, if it exists. If not,
  // create the region and return it
  _getRegion: function(selector) {
    var region = this._regions[selector];
    return region ? region : this._addRegion(selector);
  },

  // Add a hash of regions. Used internally to create the `childViews`
  _addRegions: function(regionDefinitions, $el) {
    _.each(regionDefinitions, function(view, selector) {
      this._addRegion(selector, view, $el);
    }, this);
    return this;
  },

  // Add a new region to this view, if we don't
  // already have one. Optionally pass it a view
  // to display on creation
  _addRegion: function(selector, definition, $el) {
    $el = $el || this.$el;
    // Don't override existing regions
    if (this._regions[selector]) { return; }
    var $regionEl = $el.find(selector);
    if (!$regionEl) { this._throwRegionError(selector); }
    var fnDefinition = _.isFunction(definition);
    var options = {
      _hostView: this,
      selector: selector,
      el: $regionEl,
      view: fnDefinition ? definition : definition.view,
      viewOptions: fnDefinition ? {} : definition.options
    };
    var region = this._createRegion(options);
    this._regions[selector] = region;
    return this;
  },

  // The method that creates a new region
  _createRegion: function(options) {
    return new this.region(options);
  },

  // After this view's element has been cloned, we need to update
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
