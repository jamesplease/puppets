describe('compileTemplate:', function() {
  beforeEach(function() {
    this.templateString = '<div></div>';
    this.sinon.spy(Puppets, 'compileTemplate');
    this.sinon.spy(_, 'template');
  });

  describe('when calling compileTemplate, and passing a template string', function() {
    beforeEach(function() {
      Puppets.compileTemplate(this.templateString);
    });

    it('should pass the templateString to _.template', function() {
      expect(_.template)
        .to.have.been.calledOnce
        .and.to.have.been.always.calledWith(this.templateString, {});
    });

    it('should return the return value from _.template', function() {
      expect(Puppets.compileTemplate.returnValues[0]).to.equal(_.template.returnValues[0]);
    });
  });

  describe('when calling compileTemplate, and passing a template string and options', function() {
    beforeEach(function() {
      Puppets.compileTemplate(this.templateString, {color:'blue'});
    });

    it('should pass the templateString and options to _.template', function() {
      expect(_.template)
        .to.have.been.calledOnce
        .and.to.have.been.always.calledWith(this.templateString, {color:'blue'});
    });

    it('should return the return value from _.template', function() {
      expect(Puppets.compileTemplate.returnValues[0]).to.equal(_.template.returnValues[0]);
    });
  });

  describe('when specifying Puppets.templateOptions, and not passing any options', function() {
    beforeEach(function() {
      Puppets.templateOptions = {name:'james'};
      Puppets.compileTemplate(this.templateString);
    });

    it('should pass the templateOptions into _.template', function() {
      expect(_.template)
        .to.have.been.calledOnce
        .and.to.have.been.always.calledWith(this.templateString, {name:'james'});
    });

    it('should return the return value from _.template', function() {
      expect(Puppets.compileTemplate.returnValues[0]).to.equal(_.template.returnValues[0]);
    });
  });

  describe('when specifying Puppets.templateOptions and passing in options', function() {
    beforeEach(function() {
      Puppets.templateOptions = {name:'james'};
      Puppets.compileTemplate(this.templateString, {color:'blue'});
    });

    it('should merge the two, passing them into _.template', function() {
      expect(_.template)
        .to.have.been.calledOnce
        .and.to.have.been.always.calledWith(this.templateString, {name:'james', color:'blue'});
    });

    it('should return the return value from _.template', function() {
      expect(Puppets.compileTemplate.returnValues[0]).to.equal(_.template.returnValues[0]);
    });
  });
});
