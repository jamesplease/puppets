describe('mergeOptions:', function() {
  beforeEach(function() {
    this.sinon.spy(Puppets, 'mergeOptions');
    this.options = {
      color: 'blue',
      size: 'M',
      type: 'tee'
    };
  });

  describe('when passing in an undefined options array', function() {
    beforeEach(function() {
      this.obj = {};
      Puppets.mergeOptions(this.obj);
    });

    it('should not throw an error; undefined should be returned', function() {
      expect(Puppets.mergeOptions).to.have.always.returned(undefined);
    });
  });

  describe('when passing in options, and an undefined keys array', function() {
    beforeEach(function() {
      this.obj = {name: 'james'};
      Puppets.mergeOptions(this.obj, this.options);
    });

    it('should not merge any of the options', function() {
      expect(this.obj).to.have.keys(['name']);
    });
  });

  describe('when passing in options and a list of keys, none of which are in the options', function() {
    beforeEach(function() {
      this.obj = {name: 'james'};
      Puppets.mergeOptions(this.obj, this.options, ['material']);
    });

    it('should not merge any of the options', function() {
      expect(this.obj).to.have.keys(['name']);
    });
  });

  describe('when passing in options and a list of keys, some of which are in the options', function() {
    beforeEach(function() {
      this.obj = {name: 'james'};
      Puppets.mergeOptions(this.obj, this.options, ['size', 'type']);
    });

    it('should merge just those options', function() {
      expect(this.obj).to.have.keys(['name', 'size', 'type']);
    });
  });

  describe('when passing in options and a list of keys, all of which are in the options', function() {
    beforeEach(function() {
      this.obj = {name: 'james'};
      Puppets.mergeOptions(this.obj, this.options, ['color', 'size', 'type']);
    });

    it('should merge all of the options', function() {
      expect(this.obj).to.have.keys(['name', 'color', 'size', 'type']);
    });
  });
});
