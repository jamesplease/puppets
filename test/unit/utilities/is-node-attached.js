describe('isNodeAttached:', function() {
  beforeEach(function() {
    this.sinon.spy(Puppets, 'isNodeAttached');
    this.$attachedDiv = $('<div></div>');
    this.$detachedDiv = $('<div></div>');
    this.setFixtures(this.$attachedDiv);
  });

  describe('when passing an attached node in', function() {
    beforeEach(function() {
      Puppets.isNodeAttached(this.$attachedDiv);
    });

    it('should return true', function() {
      expect(Puppets.isNodeAttached).to.have.always.returned.true;
    });
  });

  describe('when passing a detached node in', function() {
    beforeEach(function() {
      Puppets.isNodeAttached(this.$detachedDiv);
    });

    it('should return false', function() {
      expect(Puppets.isNodeAttached).to.have.always.returned.false;
    });
  });

  describe('when passing undefined in', function() {
    beforeEach(function() {
      Puppets.isNodeAttached();
    });

    it('should return false', function() {
      expect(Puppets.isNodeAttached).to.have.always.returned.false;
    });
  });
});
