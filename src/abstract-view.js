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
