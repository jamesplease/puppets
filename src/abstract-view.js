//
// AbstractView
// A view that adds basic functionality to
// Backbone's view. It is not intended to be
// used standalone: it is the foundation
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

  // The default Region class. In most instances
  // you should not need to override this
  Region: Puppets.Region,

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

  remove: function() {
    this.trigger('before:remove', this);
    Backbone.View.prototype.remove.apply(this, arguments);
    this.trigger('remove', this);
    return this;
  }
});

Puppets.AbstractView = AbstractView;
