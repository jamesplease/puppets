describe('Region:', function() {
  describe('instance and static props', function() {
    it('should extend from Backbone.Events', function() {
      expect(Puppets.Region.prototype).to.contain.keys(_.keys(Backbone.Events));
    });

    it('should have Puppets.extend', function() {
      expect(Puppets.Region.extend).to.equal(Puppets.extend);
    });
  });

  describe('when passing in options to a Region', function() {
    beforeEach(function() {
      this.sinon.stub(Puppets.Region.prototype, '_setView');
      this.region = new Puppets.Region({
        view: true,
        viewOptions: true,
        el: true,
        selector: true,
        _hostView: true,
        color: 'blue',
        name: 'james'
      });
    });

    it('should merge in the options from regionOptions', function() {
      expect(this.region).to.contain.keys(this.region.regionOptions);
    });

    it('should ignore everything else', function() {
      expect(this.region).to.not.contain.keys('color', 'name');
    });
  });

  describe('when creating a Region', function() {
    beforeEach(function() {
      this.sinon.stub(Puppets.Region.prototype, '_setView');
      this.view = {};
      this.viewOptions = {};
      this.region = new Puppets.Region({
        view: this.view,
        viewOptions: this.viewOptions
      });
    });

    it('should have a cid', function() {
      expect(this.region).to.contain.keys('cid');
    });

    it('should call _setView, passing the view and viewOptions along', function() {
      expect(this.region._setView)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith(this.view, this.viewOptions);
    });
  });

  describe('currentView()', function() {
    beforeEach(function() {
      this.region = new Puppets.Region();
      this.sinon.spy(this.region, 'currentView');
    });

    describe('with no view', function() {
      beforeEach(function() {
        this.region.currentView();
      });

      it('should return undefined', function() {
        expect(this.region.currentView).to.have.always.returned(undefined);
      });
    });

    describe('with a view set', function() {
      beforeEach(function() {
        this.view = {name: 'james'};
        this.region._view = this.view;
        this.region.currentView();
      });

      it('should return undefined', function() {
        expect(this.region.currentView).to.have.always.returned(this.view);
      });
    });
  });

  describe('_createView', function() {
    beforeEach(function() {
      this.region = new Puppets.Region();
      this.region.el = 'element';
      this.sinon.spy(this.region, '_createView');
      this.sinon.spy(Puppets, 'AbstractView');
      this.options = {};
      this.view = this.region._createView(Puppets.AbstractView, this.options);
    });

    it('should return a new view', function() {
      expect(this.view).to.be.instanceof(Puppets.AbstractView);
    });

    it('should pass the options into the view constructor, along with the region el', function() {
      expect(Puppets.AbstractView)
        .to.have.been.calledOnce
        .and.to.have.always.been.calledWith(_.extend(this.options, {el: this.region.el}));
    });
  });
});
