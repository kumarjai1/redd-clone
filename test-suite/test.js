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

  it('should append a child element to a given DOM node and return it', function() {
    expect(parent).to.contain('div');
  });

  it('should append multiple child elements to a DOM node and return it', function() {
    expect(parent).to.have.descendants('div').and.have.length(3);
  });
});

describe('displayPosts', function() {
  const posts = dummyPosts;
  const allPosts = document.querySelector('#allPosts');

  displayPosts(posts);
  
  it('should append posts to #allPosts', function() {
    expect(allPosts).to.have.descendants('div');  
  });

  it('should only append 25 posts to #allPosts', function() {
    expect(allPosts).to.have.descendants('div').to.have.length(25);  
  });

  it('should display a Load More button if there are more posts to display', function() {
    if (posts.length > 25) {
      expect(main).to.have.descendant('#paginationBtn');
    }
  });

  it('should not display a Load More button if there are less than 25 posts', function() {
    if (posts.length < 25) {
      expect(main).not.to.have.descendant('#paginationBtn');
    }
  });
});

// Temporary fix to combat elements being generated and pended to the body of tests.html after #mocha from scrips.js scripts
const body = document.querySelector('body');
while (body.firstChild) body.removeChild(body.firstChild);
const mochaDiv = document.createElement('div');
mochaDiv.setAttribute('id', 'mocha');
document.body.append(mochaDiv);

mocha.run();
