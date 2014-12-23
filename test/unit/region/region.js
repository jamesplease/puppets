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
});
