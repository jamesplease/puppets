var count = 0;

var MainView = Puppets.View.extend({
  template: _.template('<li>My contents</li><li>hi</li><span>meow</span>'),
  initialize: function() {
    this.on('render', this.onRender, this);
    this.on('attach', function() {
      console.log('attached main!');
    });
  },

  onRender: function() {
    this.trigger('stuff');
  }
});

var NewMainView = Puppets.View.extend({
  initialize: function() {
    this.on('render', this.onRender, this);
    this.on('attach', function() {
      console.log('attached new main!');
    });
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
    this.on('attach', function() {
      console.log('attached modal!');
    });
  },

  template: _.template('modal view<p>still modal</p>'),

  childViews: {
    p: NewMainView
  }
});

var RootView = Puppets.View.extend({
  initialize: function() {
    this.on('attach', function() {
      console.log('attached root!');
    });
  },

  ui: {
    main: 'main',
    modal: '.modal',
    span: 'span'
  },

  el: '.primary',

  template: _.template('<main></main><div class="modal"></div><span><%= name %></span>'),

  // These will be created on instantiation
  childViews: {
    main: {
      view: MainView,
      options: {color: 'blue'}
    },
    '.modal': ModalView
  },

  // Change the main view
  changeMain: function(show) {
    this.showChildView('main', NewMainView, {force: show});
  }
});

var rootView = new RootView({
  model: new Backbone.Model({name: 'james'})
});
