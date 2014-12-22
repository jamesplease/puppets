//
// CollectionView
// A view that provides one-way data-binding
// between a Collection and a View class
//

Puppets.CollectionView = Puppets.AbstractView.extend({
  // constructor: function() {
  //   this.once('render', this._listenToCollection);
  //   this._reset();
  //   Puppets.AbstractView.prototype.constructor.apply(this, arguments);
  // },

  // render: function() {
  //   this.trigger('before:render', this, this.collection);
  //   this._renderChildViews();
  //   this.trigger('render', this, this.collection);
  //   return this;
  // },

  // childViewEventPrefix: 'childView',

  // _renderChildViews: function() {

  // },

  // // Creates a child view for a newly-added model,
  // // sets up references, forwards events, then returns
  // // the view
  // _addChild: function(model) {
  //   var view = this._createChildView(model);
  //   view._parent = this;
  //   this.listenTo(view, 'all', this._onViewEvent);
  // },

  // // These methods provide 1-way data-binding
  // _listenToCollection: function() {
  //   this.listenTo(this.collection, {
  //     add: this._onCollectionAdd,
  //     remove: this._onCollectionRemove,
  //     reset: this.render,
  //     sort: this._sortViews
  //   });
  // },

  // _onCollectionAdd: function(model, collection) {
  //   var index = collection.indexOf(model);
  //   var childView = this._createChildView(model);
  //   this._insertAt(childView, index);
  // },

  // _onCollectionRemove: function(model, collection) {

  // },

  // // Return a new view instance
  // _createChildView: function(model) {
  //   return new this.childView(_.extend({model: model}, _.result(this.childViewOptions)));
  // },

  // // Create a document fragment for efficient rendering
  // _createFragment: function() {
  //   return document.createDocumentFragment();
  // },

  // // Update the views based on the collection's indices
  // _reorder: function() {
  //   _.sortBy(this._views, function(view){
  //     return _.indexOf(view.model, this.collection);
  //   });
  // },

  // _attachChildView: function(view, index) {
  //   view.render();
  //   // this.$el.appendAt(view.$el, index);
  // }

  // // Determine if we need to sort by comparing each view's index in the
  // // document against the model's index in the collection
  // _sortViews: function() {
  //   if (_.every(this.childViews, function(childView) {
  //     return childView.$el.index() !== this.collection.indexOf(childView.model);
  //   }, this)) {
  //     this.render();
  //   }
  // },

  // // Insert the view at the specified index
  // _insertAt: function(view, index) {
  //   if (index === this.childViews.length - 1) {
  //     this.$el.append(view.$el);
  //   } else {
  //     this.$el.children().eq(index).before(view.$el);
  //   }
  // },

  // _reset: function() {
  //   this.length = 0;
  //   this.childViews = [];
  //   this._byId  = {};
  // },

  // _addReference: function(view, options) {
  //   this._byId[view.model.cid] = this. view;
  //   this._byId[view.cid] = view;

  // },

  // _removeChildView: function(view, removed) {
  //   if (!removed) { view.remove(); }
  //   this._removeReference();
  // },

  // // Internal method to sever a view's ties to a collectionView.
  // _removeReference: function(view, options) {
  //   if (this === view._parent) { delete view._parent; }
  //   this.stopListening(view, 'all', this._onViewEvent);
  // },

  // // Listen to events from the child view. If the child
  // // is removed or disposed, then we remove it from the collection
  // // We also forward along the child's events
  // _onViewEvent: function(event) {
  //   if (event === 'remove' || event === 'dipose') {
  //     this._removeChildView(view, event === 'remove')
  //   };
  //   var args = _.toArray(arguments);
  //   args[0] = this.childViewEventPrefix + ':' + event;
  //   this.trigger.apply(this, args);
  // }
});

// Mixin Underscore methods to the CollectionView
var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
  'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
  'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
  'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
  'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
  'lastIndexOf', 'isEmpty', 'chain', 'sample'];

// Mix in each Underscore method as a proxy to `CollectionView#childViews`.
_.each(methods, function(method) {
  Puppets.CollectionView.prototype[method] = function() {
    var args = _.toArray(arguments);
    args.unshift(this.childViews);
    return _[method].apply(_, args);
  };
});
