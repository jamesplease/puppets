describe('listenToObject:', function() {
  beforeEach(function() {
    this.sinon.spy(Puppets, 'listenToObject');
    this.obj = _.extend({
      fnOne: function() {},
      fnTwo: function() {}
    }, Backbone.Events);
    this.target = _.clone(Backbone.Events);
  });
  
  describe('When calling listenToObject without any arguments', function() {
    beforeEach(function() {
      Puppets.listenToObject();
    });

    it('should not throw an error, returning undefined instead', function() {
      expect(Puppets.listenToObject).to.have.always.returned.undefined;
    });
  });

  describe('When calling listenToObject with only the first argument', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj);
    });

    it('should not throw an error, returning undefined instead', function() {
      expect(Puppets.listenToObject).to.have.always.returned.undefined;
    });

    it('should not attach any handlers to either object', function() {
      expect(this.obj._listeningTo).to.be.undefined;
      expect(this.target._events).to.be.undefined;
    });
  });

  describe('When calling listenToObject without any events', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj, this.target);
    });

    it('should not throw an error, returning undefined instead', function() {
      expect(Puppets.listenToObject).to.have.always.returned.undefined;
    });

    it('should not attach any handlers to either object', function() {
      expect(this.obj._listeningTo).to.be.undefined;
      expect(this.target._events).to.be.undefined;
    });
  });

  // Note: the following assertions rely on the internals of Backbone.Events to function
  describe('When calling listenToObject with an events hash', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj, this.target, {
        change: this.obj.fnOne
      });
    });

    it('should register the event on the listening object', function() {
      expect(this.obj._listeningTo).to.have.keys([this.target._listenId]);
    });

    it('should register the callback on the target object', function() {
      expect(this.target._events).to.have.keys(['change']);
      expect(this.target._events.change[0].callback).to.deep.equal(this.obj.fnOne);
    });
  });

  describe('When calling listenToObject with an events hash containing strings', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj, this.target, {
        change: 'fnOne'
      });
    });

    it('should register the event on the listening object', function() {
      expect(this.obj._listeningTo).to.have.keys([this.target._listenId]);
    });

    it('should convert the string to the callback when registering it on the target object', function() {
      expect(this.target._events).to.have.keys(['change']);
      expect(this.target._events.change[0].callback).to.deep.equal(this.obj.fnOne);
    });
  });

  describe('When calling listenToObject with an events hash containing some strings, some functions', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj, this.target, {
        change: this.obj.fnOne,
        render: 'fnTwo'
      });
    });

    it('should register the event on the listening object', function() {
      expect(this.obj._listeningTo).to.have.keys([this.target._listenId]);
    });

    it('should register the correct callbacks on the target object', function() {
      expect(this.target._events).to.have.keys(['change', 'render']);
      expect(this.target._events.change[0].callback).to.deep.equal(this.obj.fnOne);
      expect(this.target._events.render[0].callback).to.deep.equal(this.obj.fnTwo);
    });
  });
});
