describe('stopListeningToObject:', function() {
  beforeEach(function() {
    this.sinon.spy(Puppets, 'stopListeningToObject');
    this.obj = _.extend({
      fnOne: function() {},
      fnTwo: function() {}
    }, Backbone.Events);
    this.target = _.clone(Backbone.Events);
    this.target.on('change add remove', function() {});
  });

  describe('When calling stopListeningToObject without any arguments', function() {
    beforeEach(function() {
      Puppets.stopListeningToObject();
    });

    it('should not throw an error, returning undefined instead', function() {
      expect(Puppets.stopListeningToObject).to.have.always.returned.undefined;
    });
  });

  describe('When calling stopListeningToObject with only the first argument', function() {
    beforeEach(function() {
      Puppets.stopListeningToObject(this.obj);
    });

    it('should not throw an error, returning undefined instead', function() {
      expect(Puppets.stopListeningToObject).to.have.always.returned.undefined;
    });
  });

  describe('When calling stopListeningToObject without any events', function() {
    beforeEach(function() {
      Puppets.stopListeningToObject(this.obj, this.target);
    });

    it('should not remove any of the events from target', function() {
      expect(this.target._events).to.have.keys(['change', 'add', 'remove']);
    });
  });

  describe('When calling stopListeningToObject and passing events that are not registered', function() {
    beforeEach(function() {
      Puppets.stopListeningToObject(this.obj, this.target, {
        sandwich: 'fnOne'
      });
    });

    it('should not remove any of the existing events from target', function() {
      expect(this.target._events).to.have.keys(['change', 'add', 'remove']);
    });
  });

  describe('When calling stopListeningToObject and passing an event with some other callback', function() {
    beforeEach(function() {
      Puppets.stopListeningToObject(this.obj, this.target, {
        change: 'fnOne'
      });
    });

    it('should not remove that event (or any other event) from the target', function() {
      expect(this.target._events).to.have.keys(['change', 'add', 'remove']);
    });
  });

  describe('When calling stopListeningToObject and passing an event with a callback registered through listenToObject', function() {
    beforeEach(function() {
      Puppets.listenToObject(this.obj, this.target, {
        change: 'fnOne'
      });

      Puppets.stopListeningToObject(this.obj, this.target, {
        change: 'fnOne'
      });
    });

    it('should remove the event from the object, leaving the original event', function() {
      expect(this.target._events.change).to.be.of.length(1);
    });
  });
});
