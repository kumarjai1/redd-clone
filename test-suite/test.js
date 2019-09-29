// test scripts
mocha.setup('bdd');
const assert = chai.assert;
const expect = chai.expect;

describe('attrSetter', function() {
  let el = document.createElement('div');

  el = attrSetter(el, [ [ 'id', 'test-id' ], [ 'class', 'test-class test-class-2' ]]);

  it('should return a DOM node with the attributes set to it', function() {
    expect(el).to.have.id('test-id');
  });

  it('should accept multiple attributes to set to the DOM node', function() {
    expect(el).to.have.id('test-id');
    expect(el).to.have.class('test-class');
  });

  it('should be able to assign multiple classes to the DOM node', function() {
    expect(el).to.have.id('test-id');
    expect(el).to.have.class('test-class');
    expect(el).to.have.class('test-class-2');
  });
});

describe('multiAppender', function() {
  let parent = document.createElement('div');
  let child1 = document.createElement('div');
  let child2 = document.createElement('div');
  let child3 = document.createElement('div');

  parent.setAttribute('class', 'ma-parent');

  parent = multiAppender(parent, [ child1, child2, child3 ]);

  it('should accept a DOM node and append a child element to it', function() {
    expect(parent).to.contain('div');
  });

  it('should accept a DOM node and append multiple child elements to it', function() {
    expect(parent).to.have.descendants('div').and.have.length(3);
  });
});

mocha.run();