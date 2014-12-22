// Puppets v0.0.1
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  }
  else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  }
  else {
    factory(root.Backbone, root._);
  }
}(this, function(Backbone, _) {
  'use strict';

  var previousPuppets = Backbone.Puppets;
  
  var Puppets = Backbone.Puppets = {};
  
  Puppets.VERSION = '0.0.1';
  
  Puppets.noConflict = function () {
    Backbone.Puppets = previousPuppets;
    return this;
  };
  
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
  
  //
  // Animate
  // The API for the animation layer of Puppets
  // used internally by Regions
  //
  
  Puppets.Animate = function() {
  
  };
  
  _.extend(Puppets.Animate, {
  
    // Add a new Javascript-based animation
    addAnimation: function(className, definition) {}
  });
  
  //
  // Region
  // An object that controls an area of a
  // View where we want to display children.
  // Regions are an implementation detail and
  // should rarely, if ever, be handled directly
  //
  
  var Region = function(options) {
    Puppets.mergeOptions(this, options, this.regionOptions);
    this.cid = _.uniqueId('r');
    this.selector = options.selector;
    this._setView(options.view, options.viewOptions);
  };
  
  _.extend(Region.prototype, {
    regionOptions: ['view', 'viewOptions', 'el', 'selector', '_hostView'],
  
    // Retrieve the region's view
    currentView: function() {
      return this._view;
    },
  
    // If this region has a view, then this
    // will deep clone that view's DOM tree,
    // including all event handlers. It will also
    // update the region's element to be the new
    // element
    cloneTree: function() {
      if (!this._view) { return; }
      var $clone = this._view.$el.clone(true, true);
      this._updateEl($clone);
      return $clone;
    },
  
    // When the tree is cloned, the element
    // that this region references will no
    // longer be accurate. To make things right,
    // we recursively update this region's
    // element, and then recursively update
    // the view's region's elements, as well
    _updateEl: function($el) {
      this.el = $el;
      if (!this._view) { return; }
      this._view.setElement($el);
      this._view._updateRegions();
    },
  
    // Show a new view in this region. The old
    // view will be disposed of
    show: function(view, options) {
      options = options || {};
  
      // Only create a new view of the same Class
      // if force is passed as true
      if (this._view instanceof view && !options.force) { return; }
      this._disposeView();
      this._setView(view, options);
    },
  
    // Set the view on the region, set this as
    // its _hostView, then render it
    _setView: function(view, viewOptions) {
      if (!view) { return; }
      this._view = this._createView(view, viewOptions);
      this._storeChildViewReference();
      this._view._region = this;
      this._view.render();
    },
  
    // Store references to this region's view all the way up the view tree
    _storeChildViewReference: function(view) {
      view = view || this._view;
      this._hostView._childViews.push(view);
      if (this._hostView._region) {
        this._hostView._region._storeChildViewReference(view);
      }
    },
  
    // Removes references to this region's views from the entire view tree
    _removeChildViewReference: function(view) {
      view = view || this._view;
      _.without(this._hostView._childViews, view);
      if (this._hostView._region) {
        this._hostView._region._removeChildViewReference(view);
      }
    },
  
    // Creates a view with the el set to be this region's el
    _createView: function(View, viewOptions) {
      return new View(_.extend({}, viewOptions, {el: this.el}));
    },
  
    // Dispose the current view
    _disposeView: function() {
      var view = this.currentView();
      if (!view) { return; }
      this._removeChildViewReference();
      view.dispose();
    }
  }, Backbone.Events);
  
  Region.extend = Puppets.extend;
  
  Puppets.Region = Region;
  
  //
  // AbstractView
  // A view that adds basic functionality to
  // Backbone's view. It is not intended to be
  // used standalone; rather, it is the foundation
  // for Puppets' two views.
  //
  
  var AbstractView = Backbone.View.extend({
  
    // Options to be merged onto each instance
    abstractViewOptions: ['model', 'collection', 'modelEvents', 'collectionEvents', 'template'],
  
    constructor: function(options) {
      Puppets.mergeOptions(this, options, this.abstractViewOptions);
      this._childViews = [];
      this.listenToModel();
      this.listenToCollection();
      Backbone.View.prototype.constructor.apply(this, arguments);
    },
  
    // Update the view's model
    setModel: function(model) {
      this.stopListeningToModel();
      this.model = model;
      this.listenToModel();
    },
  
    // Update the view's collection
    setCollection: function(collection) {
      this.stopListeningToCollection();
      this.collection = collection;
      this.listenToModel(collection);
    },
  
  
    // These four methods manage events specified via
    // modelEvents and collectionEvents
    listenToModel: function() {
      Puppets.listenToObject(this.model, _.result(this, 'modelEvents'));
    },
    stopListeningToModel: function() {
      Puppets.stopListeningToObject(this.model, _.result(this, 'modelEvents'));
    },
    listenToCollection: function() {
      Puppets.listenToObject(this.model, _.result(this, 'modelEvents'));
    },
    stopListeningToCollection: function() {
      Puppets.stopListeningToObject(this.collection, _.result(this, 'collectionEvents'));
    },
  
    // Remove this view from the DOM, and remove its event handlers
    remove: function() {
      this.trigger('before:remove', this);
      Backbone.View.prototype.remove.apply(this, arguments);
      this.trigger('remove', this);
      return this;
    },
  
    // Remove the view's event handlers without removing its
    // element from the DOM. This is the method that is used
    // when closing down nested views
    dispose: function() {
      this.trigger('before:dispose', this);
      this.stopListening();
      delete this._parent;
      this.trigger('dispose', this);
      return this;
    }
  });
  
  Puppets.AbstractView = AbstractView;
  
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
      this.$ui = {};
      AbstractView.prototype.constructor.apply(this, arguments);
  
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
          child.trigger('attach', child, this);
        });
        this.trigger('attach', this, undefined);
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
  
  //
  // CollectionView
  // A view that provides one-way data-binding
  // between a Collection and a View class
  //
  
  var CollectionView = AbstractView.extend({
  
  });
  
  Puppets.CollectionView = CollectionView;
  

  return Puppets;
}));
