describe('AbstractView:', function() {
  describe('when creating an abstract view', function() {
    beforeEach(function() {
      this.sinon.stub(Backbone.View.prototype, 'constructor');
      this.sinon.stub(Puppets.AbstractView.prototype, 'listenToModel');
      this.sinon.stub(Puppets.AbstractView.prototype, 'listenToCollection');
      this.abstractView = new Puppets.AbstractView({name: 'james', modelEvents: undefined}, false);
    });

    it('should call the Backbone.View constructor, passing the arguments along', function() {
      expect(Backbone.View.prototype.constructor)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith({name: 'james', modelEvents:undefined}, false);
    });

    it('should only merge options from abstractViewOptions', function() {
      expect(this.abstractView).to.contain.keys('modelEvents');
      expect(this.abstractView).to.not.contain.keys('name');
    });

    it('should call listenToModel and listenToCollection', function() {
      expect(this.abstractView.listenToModel).to.have.been.calledOnce;
      expect(this.abstractView.listenToCollection).to.have.been.calledOnce;
    });
  });

  describe('listenToModel:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView({
        model: new Backbone.Model()
      });
      this.sinon.spy(this.abstractView, 'listenToModel');
      this.sinon.stub(Puppets, 'listenToObject');
      this.abstractView.modelEvents = { change: function() {} };
      this.abstractView.listenToModel();
    });
  });
});
