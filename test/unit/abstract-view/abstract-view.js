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
      this.modelEvents = { change: function() {} };
    });

    describe('when modelEvents are specified as a hash', function() {
      beforeEach(function() {
        this.abstractView.modelEvents = this.modelEvents;
        this.abstractView.listenToModel();
      });

      it('should call Puppets.listenToObject with the appropriate arguments', function() {
        expect(Puppets.listenToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.model, this.modelEvents);
      });
    });

    describe('when modelEvents are specified as a function', function() {
      beforeEach(function() {
        var suite = this;
        this.abstractView.modelEvents = function() {
          return suite.modelEvents;
        };
        this.abstractView.listenToModel();
      });

      it('should call Puppets.listenToObject with the appropriate arguments', function() {
        expect(Puppets.listenToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.model, this.modelEvents);
      });
    });
  });

  describe('stopListeningToModel:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView({
        model: new Backbone.Model()
      });
      this.sinon.spy(this.abstractView, 'stopListeningToModel');
      this.sinon.stub(Puppets, 'stopListeningToObject');
      this.modelEvents = { change: function() {} };
    });

    describe('when modelEvents are specified as a hash', function() {
      beforeEach(function() {
        this.abstractView.modelEvents = this.modelEvents;
        this.abstractView.stopListeningToModel();
      });

      it('should call Puppets.stopListeningToObject with the appropriate arguments', function() {
        expect(Puppets.stopListeningToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.model, this.modelEvents);
      });
    });

    describe('when modelEvents are specified as a function', function() {
      beforeEach(function() {
        var suite = this;
        this.abstractView.modelEvents = function() {
          return suite.modelEvents;
        };
        this.abstractView.stopListeningToModel();
      });

      it('should call Puppets.stopListeningToObject with the appropriate arguments', function() {
        expect(Puppets.stopListeningToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.model, this.modelEvents);
      });
    });
  });

  describe('listenToCollection:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView({
        collection: new Backbone.Collection()
      });
      this.sinon.spy(this.abstractView, 'listenToCollection');
      this.sinon.stub(Puppets, 'listenToObject');
      this.collectionEvents = { change: function() {} };
    });

    describe('when collectionEvents are specified as a hash', function() {
      beforeEach(function() {
        this.abstractView.collectionEvents = this.collectionEvents;
        this.abstractView.listenToCollection();
      });

      it('should call Puppets.listenToObject with the appropriate arguments', function() {
        expect(Puppets.listenToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.collection, this.collectionEvents);
      });
    });

    describe('when collectionEvents are specified as a function', function() {
      beforeEach(function() {
        var suite = this;
        this.abstractView.collectionEvents = function() {
          return suite.collectionEvents;
        };
        this.abstractView.listenToCollection();
      });

      it('should call Puppets.listenToObject with the appropriate arguments', function() {
        expect(Puppets.listenToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.collection, this.collectionEvents);
      });
    });
  });

  describe('stopListeningToCollection:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView({
        model: new Backbone.Collection()
      });
      this.sinon.spy(this.abstractView, 'stopListeningToCollection');
      this.sinon.stub(Puppets, 'stopListeningToObject');
      this.collectionEvents = { change: function() {} };
    });

    describe('when collectionEvents are specified as a hash', function() {
      beforeEach(function() {
        this.abstractView.collectionEvents = this.collectionEvents;
        this.abstractView.stopListeningToCollection();
      });

      it('should call Puppets.stopListeningToObject with the appropriate arguments', function() {
        expect(Puppets.stopListeningToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.collection, this.collectionEvents);
      });
    });

    describe('when collectionEvents are specified as a function', function() {
      beforeEach(function() {
        var suite = this;
        this.abstractView.collectionEvents = function() {
          return suite.collectionEvents;
        };
        this.abstractView.stopListeningToCollection();
      });

      it('should call Puppets.stopListeningToObject with the appropriate arguments', function() {
        expect(Puppets.stopListeningToObject)
          .to.have.been.calledOnce
          .and.to.have.always.been.calledWith(this.abstractView, this.abstractView.collection, this.collectionEvents);
      });
    });
  });

  describe('remove:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView();
      this.sinon.spy(this.abstractView, 'remove');
      this.sinon.stub(Backbone.View.prototype, 'remove');
      this.sinon.stub(this.abstractView, 'trigger');
      this.abstractView.remove({name: 'james'}, false);
    });

    it('should trigger the before:remove and remove events', function() {
      expect(this.abstractView.trigger)
        .to.have.been.calledTwice
        .and.to.have.been.calledWith('before:remove', this.abstractView)
        .and.to.have.been.calledWith('remove', this.abstractView);
    });

    it('should call Backbone.View.prototype.remove, passing along the arguments, with the right context', function() {
      expect(Backbone.View.prototype.remove)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith({name: 'james'}, false)
        .and.to.have.always.been.calledOn(this.abstractView)
    });

    it('should return the view', function() {
      expect(this.abstractView.remove).to.have.always.returned(this.abstractView);
    });
  });

  describe('dispose:', function() {
    beforeEach(function() {
      this.abstractView = new Puppets.AbstractView();
      this.sinon.spy(this.abstractView, 'dispose');
      this.sinon.stub(Backbone.View.prototype, 'remove');
      this.sinon.stub(this.abstractView, 'trigger');
      this.abstractView.dispose();
    });

    it('should trigger the before:dispose and dispose events', function() {
      expect(this.abstractView.trigger)
        .to.have.been.calledTwice
        .and.to.have.been.calledWith('before:dispose', this.abstractView)
        .and.to.have.been.calledWith('dispose', this.abstractView);
    });

    it('should not call Backbone.View.prototype.remove', function() {
      expect(Backbone.View.prototype.remove).to.have.not.been.called;
    });

    it('should return the view', function() {
      expect(this.abstractView.dispose).to.have.always.returned(this.abstractView);
    });
  });
});
