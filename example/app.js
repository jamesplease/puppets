var MainView = Puppets.View.extend({
  template: _.template('main view')
});

var NewMainView = Puppets.View.extend({
  initialize: function() {
    window.newMain = this;
  },
  template: _.template('new main view')
});

var ModalView = Puppets.View.extend({
  template: _.template('modal view')
});

var RootView = Puppets.View.extend({
  el: 'body',

  // These will be created on instantiation
  childViews: {
    main: {
      view: MainView,
      options: {color: 'blue'}
    },
    '.modal': ModalView
  },

  // Change the footer view
  changeFooter: function() {
    this.showChildView('main', NewMainView);
  }
});

var rootView = new RootView();
