describe('Application:', function() {
  describe('the prototype', function() {
    it('should extend from Backbone.Events', function() {
      expect(Puppets.Application.prototype).to.contain.keys('on', 'off', 'listenTo', 'stopListening');
    });
  });

  describe('when creating a new Application', function() {
    beforeEach(function() {
      this.sinon.spy(Puppets.Application.prototype, 'initialize');
      this.app = new Puppets.Application('pasta', false);
    });

    it('should be assigned an appId', function() {
      expect(this.app).to.contain.keys('cid');
    })

    it('should call initialize, passing along the arguments', function() {
      expect(this.app.initialize)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith('pasta', false);
    });
  });

  describe('the start method', function() {
    beforeEach(function() {
      this.app = new Puppets.Application();
      this.sinon.stub(this.app, 'trigger');
      this.app.start({name: 'james'});
    });

    it('should trigger the start event, passing along the options', function() {
      expect(this.app.trigger)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith('start', {name: 'james'});
    });
  });

  describe('the stop method', function() {
    beforeEach(function() {
      this.app = new Puppets.Application();
      this.sinon.stub(this.app, 'trigger');
      this.app.stop({name: 'james'});
    });

    it('should trigger the stop event, passing along the options', function() {
      expect(this.app.trigger)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith('stop', {name: 'james'});
    });
  });
});
