describe('renderTemplate:', function() {
  beforeEach(function() {
    this.template = function(data) {
      var str = data ? data.name : '';
      return '<div>' + str + '</div>';
    };
    this.sinon.spy(this, 'template');
    this.sinon.spy(Puppets, 'renderTemplate');
  });

  describe('when calling renderTemplate, and passing a template function', function() {
    beforeEach(function() {
      Puppets.renderTemplate(this.template);
    });

    it('should execute the template function', function() {
      expect(this.template).to.have.been.calledOnce;
    });

    it('should return the value from the template function', function() {
      expect(Puppets.renderTemplate).to.have.always.returned('<div></div>');
    });
  });

  describe('when calling renderTemplate, and passing a template function and data', function() {
    beforeEach(function() {
      Puppets.renderTemplate(this.template, {name: 'james'});
    });

    it('should execute the template function, passing in the data as the first argument', function() {
      expect(this.template)
        .to.have.been.calledOnce
        .and.to.always.have.been.calledWith({name: 'james'});
    });

    it('should return the value from the template function', function() {
      expect(Puppets.renderTemplate).to.have.always.returned('<div>james</div>');
    });
  });
});
