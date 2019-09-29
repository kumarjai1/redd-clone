let dummyMain = document.createElement('main');
document.body.append(dummyMain);

let dummyAllPosts = document.createElement('div');
dummyAllPosts.setAttribute('id', 'allPosts');
dummyMain.append(dummyAllPosts);

let dummyNavButtons = document.createElement('div');
dummyNavButtons.setAttribute('id', 'navButtons');
dummyMain.append(dummyNavButtons);

let dummyModalClose = document.createElement('button');
dummyModalClose.setAttribute('class', 'modal-close');
dummyMain.append(dummyModalClose);

let dummyPostBtn = document.createElement('button');
dummyPostBtn.setAttribute('id', 'createPostBtn');
dummyMain.append(dummyPostBtn); 