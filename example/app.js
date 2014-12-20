var count = 0;

var MainView = Puppets.View.extend({
  template: _.template('<li>My contents</li><li>hi</li>'),
  initialize: function() {
    this.on('render', this.onRender, this);
  },

  onRender: function() {
    this.trigger('stuff');
  }
});

var NewMainView = Puppets.View.extend({
  initialize: function() {
    this.on('render', this.onRender, this);
  },

  onRender: function() {
    this.listenTo(this.getChildView('div'), 'stuff', function() {
      console.log('ok cool');
    });
  },

  template: _.template('<div>thing</div>'),

  childViews: {
    div: MainView
  }
});

var ModalView = Puppets.View.extend({
  initialize: function() {
    window.modal = this;
  },

  template: _.template('modal view<p>still modal</p>'),

  childViews: {
    p: NewMainView
  }
});

var RootView = Puppets.View.extend({
  el: '.primary',

  template: _.template('<main></main><div class="modal"></div>'),

  // These will be created on instantiation
  childViews: {
    // main: {
    //   view: MainView,
    //   options: {color: 'blue'}
    // },
    '.modal': ModalView
  },

  // Change the main view
  changeMain: function(show) {
    this.showChildView('main', NewMainView, {force: show});
  }
});

var rootView = new RootView();
