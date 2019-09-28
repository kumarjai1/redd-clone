let allPosts = document.getElementById('allPosts');
let currentPostID;
let isAuthenticated = !!sessionStorage.getItem('token') || false;
console.log(isAuthenticated);
let postsArr = [];
let currentPost = {};
let postContainer;
let commentBox;
let navButtons = document.getElementById('navButtons');
let modalForm = document.getElementById('modalForm');
// console.log(navButtons);


fetchAPI();

//fetches the post API
function fetchAPI () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        // console.log(response)
        postsArr = response;
        // console.log({ postsArr });
        displayPosts(response);
    })
    .catch(err => console.log(err)); 
}

//displays all latest 50 posts
function displayPosts(arr) {
  while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);

  let limit = 25;

  for (let i = arr.length - 1; i >= arr.length - limit; i--) {
    if (!arr[i]) break;

    let user = arr[i].user.username;

    //creates tags for the post elements in the frontend
    postContainer = document.createElement('div');
    let postOwner = document.createElement('h4');
    let postTitle = document.createElement('a');
    let postContent = document.createElement('p');

    //defines the content to the tags
    postContainer.classList.add('container');
    postOwner.innerText = 'posted by ' + arr[i].user.username;
    postTitle.innerText = arr[i].title;
    postContent.innerText = arr[i].description;

    //console.log(postContent.innerText);

    // Add data-id
    postTitle.setAttribute('data-id', arr[i].id);

    //adds to the post container
    allPosts.append(postContainer);
    postContainer.append(postOwner);
    postContainer.append(postTitle);
    postContainer.append(postContent);

    if (user === sessionStorage.getItem('username')) {
      const deletePostBtn = document.createElement('button');
      deletePostBtn.innerText = 'Delete';
      deletePostBtn.setAttribute('data-id', arr[i].id);
      deletePostBtn.setAttribute('class', 'button is-dark is-small');
      postContainer.append(deletePostBtn);

      // deletePostBtn.addEventListener('click', deletePost);
    }

    postTitle.addEventListener('click', function(e) {
      // console.log(e.target.dataset.id);
      currentPostID = e.target.dataset.id;

      // Empties All Posts View for Single Post View
      allPosts.innerHTML = '';
      postContainer.innerHTML = '';

      postsArr.forEach(post => {
        if (post.id === parseInt(currentPostID)) {

          currentPost.id = post.id;
          currentPost.title = post.title;
          currentPost.description = post.description;
          currentPost.user = post.user;
          // console.log('currentPost', currentPostID);

          // Create Single View Post Elements
          const singlePostTitle = document.createElement('h1');

          postContainer.classList.add('container');
          postOwner.innerText = 'posted by ' + post.user.username;
          singlePostTitle.innerText = post.title;
          postContent.innerText = post.description;

          // Append Single View Post Elements
          postContainer.append(postOwner);
          postContainer.append(singlePostTitle);
          postContainer.append(postContent);
          allPosts.append(postContainer);
          // console.log(postContainer);

          getComments(currentPostID);
          //postComments();
          createComment();
        }
      });

    })

    postStyling (postOwner, postTitle, postContent);
  
    // Closes for loop
  }

  if (arr[arr.length - limit - 1]) {
    // console.log('more to load!');
    let paginationBtn = createButton('paginationBtn', 'Load More', 'button is-primary');
    allPosts.append(paginationBtn);
    paginationBtn.addEventListener('click', pagination);
  }
    
}

/**
 * @name attrSetter
 * @description Takes a variable storing a DOM element and sets multiple attributes to the element
 * @param { variable } elVar The variable storing the element to set attributes to
 * @param { array } attrs An array of arrays of attributes to set to the element where arr[0] is the attribute and arr[1] is the attribute's value
 * @returns Returns the variable storing the DOM element
 */
function attrSetter(elVar, attrs) {
  attrs.forEach(attr => {
    elVar.setAttribute(attr[0], attr[1]);
  });

  return elVar;
}

/**
 * @name multiAppender
 * @description Takes an array of child nodes and appends the child nodes to the parent node
 * @param { variable } parent The parent node to append the child elements to
 * @param { array } children An array of child nodes to append to the parent
 * @returns A variable storing the parent node
 */
function multiAppender(parent, children) {
  children.forEach(child => {
    parent.append(child);
  });

  return parent
}

//login feature
let loginBtn = createButton('loginBtn', 'Login', 'is-primary is-outlined');
navButtons.append(loginBtn);
// console.log(loginBtn);
let loginForm = document.getElementById('loginForm');

let modalBtn = document.querySelector('.modal-button');
let modal = document.querySelector('.modal');
let close = document.querySelector('.modal-close')
// console.log(modalBtn);
close.addEventListener('click', function(e) {
  e.preventDefault();
  modal.classList.remove('is-active');
  modal.classList.toggle('visible');
})

loginBtn.addEventListener('click', function (e) {
  // console.log(loginForm);

  e.preventDefault();

  // Empties the modal to prevent redunt forms being appended
  while (modalForm.firstChild) modalForm.removeChild(modalForm.firstChild);


  modal.classList.toggle('visible');
  modal.classList.add('is-active');

  let emailLabel = document.createElement('label');
  let emailInput = document.createElement('input');
  let passwordLabel = document.createElement('label');
  let passwordInput = document.createElement('input');
  let emailField = document.createElement('div');
  let passwordField = document.createElement('div');
  let loginHeading = document.createElement('h2');
  loginHeading.innerHTML = "Login To Redd Clone </br></br>";
  loginHeading.setAttribute('class', 'is-size-5');

  let submitBtn = createButton('submitBtn', 'Login', 'button');

  emailField.setAttribute('class', 'field');
  passwordField.setAttribute('class', 'field');
  
  emailInput = attrSetter(emailInput, [ [ 'placeholder', 'email@domain.com' ], [ 'for', 'email' ], [ 'class','input' ] ]);
  passwordInput = attrSetter(passwordInput, [ [ 'placeholder', 'password' ], [ 'for', 'password' ], [ 'class', 'input' ] ]);

  emailLabel.setAttribute('class', 'label');
  emailLabel.setAttribute('for', 'email');
  emailLabel.innerText = 'Enter email address';

  passwordLabel.setAttribute('class', 'label')
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.innerText = 'Enter your password';

  submitBtn.innerText = 'Login';
  submitBtn.classList.add('is-dark')

  modalForm.append(loginHeading);
  modalForm.append(emailField);
  modalForm.append(passwordField);
  emailField.append(emailInput);
  emailField.append(emailLabel);
  passwordField.append(passwordInput); 
  passwordField.append(passwordLabel); 

  modalForm.append(submitBtn);

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();

     let emailText = emailInput.value;
     let passwordText = passwordInput.value;

     submitLogin(emailText, passwordText);   
    //  console.log(isAuthenticated);
  })
})

function submitLogin(email, password) {
  fetch(`http://thesi.generalassemb.ly:8080/login`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email,
        password
    })})
    .then(response => response.json())
    .then(response => {
      if (!!response.token) {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', response.username);
        isAuthenticated = !!sessionStorage.getItem('token');
        logout();
        modal.classList.remove('is-active');
        modal.classList.toggle('visible');
      } else {
        alert('Login Info Incorrect');
      }
    })
    .catch(err => console.log(err));
}

// Sign up features
const signUpBtn = createButton('signUpBtn', 'Sign Up', 'is-primary');
navButtons.append(signUpBtn);

const signUpForm = document.querySelector('#signUpForm');

signUpBtn.addEventListener('click', function(e) {
  e.preventDefault();

  while (modalForm.firstChild) modalForm.removeChild(modalForm.firstChild);

  modal.classList.toggle('visible');
  modal.classList.add('is-active');

  let emailInput = document.createElement('input');
  let emailLabel = document.createElement('label');
  let emailField = document.createElement('div');
  
  let passwordInput = document.createElement('input');
  let passwordLabel = document.createElement('label');
  let passwordField = document.createElement('div');
  
  let usernameInput = document.createElement('input');
  let usernameLabel = document.createElement('label');
  let usernameField = document.createElement('div');
  
  let submitBtn = createButton('submitBtn', 'Sign Up', 'is-light');

  usernameInput.setAttribute('placeholder', 'username');

  emailField.setAttribute('class', 'field');
  usernameField.setAttribute('class', 'field');
  passwordField.setAttribute('class', 'field');

  emailInput = attrSetter(emailInput, [ 
    [ 'placeholder', 'email@domain.com' ], 
    [ 'for', 'email' ], 
    [ 'class', 'input' ] 
  ]);

  usernameInput = attrSetter(usernameInput, [ 
    [ 'placeholder', 'username' ], 
    [ 'for', 'username' ], 
    [ 'class', 'input' ] 
  ]);

  passwordInput = attrSetter(passwordInput, [ 
    [ 'placeholder', 'password' ], 
    [ 'for', 'password' ], 
    [ 'class', 'input' ] 
  ]);


  emailLabel = attrSetter(emailLabel, [
    [ 'class', 'label' ],
    [ 'for', 'email' ]
  ]);

  usernameLabel = attrSetter(usernameLabel, [
    [ 'class', 'label' ],
    [ 'for', 'username' ]
  ]);  
  
  passwordLabel = attrSetter(passwordLabel, [
    [ 'class', 'label' ],
    [ 'for', 'password' ]
  ]);  

  emailLabel.innerText = 'Enter your email address';
  usernameLabel.innerText = 'Enter your username';
  passwordLabel.innerText = 'Enter your password';

  emailField = multiAppender(emailField, [ emailInput, emailLabel ]);
  usernameField = multiAppender(usernameField, [ usernameInput, usernameLabel ]);
  passwordField = multiAppender(passwordField, [ passwordInput, passwordLabel ]);
  modalForm = multiAppender(modalForm, [ emailField, usernameField, passwordField, submitBtn ]);

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();

    submitSignUp(emailInput.value, usernameInput.value, passwordInput.value)
  });
});

// Sign Up Fetch Method: POST
function submitSignUp(emailInput, usernameInput, passwordInput) {
  // console.log(emailInput, usernameInput, passwordInput);

  fetch(`http://thesi.generalassemb.ly:8080/signup`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: emailInput,
        password: passwordInput,
        username: usernameInput,
    })})
    .then(response => response.json())
    .then(response => {
      if (!!response.token) {
        // console.log(response);

        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('username', response.username);
        isAuthenticated = !!sessionStorage.getItem('token');
        logout();
        
        modal.classList.remove('is-active');
        modal.classList.toggle('visible');
      } else {
        alert('Email incorrect or username already exists');
      }
    })
    .catch(err => console.log(err));
}

let createPostBtn = document.querySelector('#createPostBtn');

createPostBtn.addEventListener('click', function(e) {
  e.preventDefault();

  //const createPostForm = document.createElement('form');
  //document.body.appendChild(createPostForm);

  while (modalForm.firstChild) modalForm.removeChild(modalForm.firstChild);

  modal.classList.toggle('visible');
  modal.classList.add('is-active');
  
  let titleField = document.createElement('div');
  let descField = document.createElement('div');

  let titleLabel = document.createElement('label');
  let descLabel = document.createElement('label');

  let postTitle = document.createElement('input');
  let postDescription = document.createElement('textarea');
  let postSubmitBtn   = createButton('postSubmitBtn', 'POST', 'button');
  
  titleField.setAttribute('class', 'field');
  descField.setAttribute('class', 'field');

  titleLabel = attrSetter(titleLabel, [['class', 'label'], ['for', 'title'] ]);
  descLabel = attrSetter(descLabel, [['class', 'label'], ['for', 'description']]);

  postTitle = attrSetter(postTitle, [['class', 'input'], ['placeholder', 'Post Title']]);
  postDescription = attrSetter(postDescription, [['class', 'input'], ['placeholder', 'Please describe your post in detail (Optional)']]);
  // console.log(postTitle, postDescription);

  // postTitle.setAttribute('placeholder', 'Title');
  // postDescription.setAttribute('placeholder', 'Please describe your post in detail (Optional)');
  // postSubmitBtn.innerText = 'POST';

  titleField = multiAppender(titleField, [postTitle, titleLabel]);
  descField = multiAppender(descField, [postDescription, descLabel]);
  modalForm = multiAppender(modalForm, [titleField, descField, postSubmitBtn]);

  // createPostForm.append(postTitle);
  // createPostForm.append(postDescription);
  // createPostForm.append(postSubmitBtn);
  
  postSubmitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let title = postTitle.value;
    let token = sessionStorage.getItem('token');
    let description = postDescription.value;
    
    fetch(`http://thesi.generalassemb.ly:8080/post`, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +  token
      },
      body: JSON.stringify({
        title: title,
        description: description
      })})
      .then(response => response.json())
      .then(response => {
        if (!token) {
          alert('You must be logged in to post');
        } else if (!title) { 
          alert('Post must have a title');
        } else {
          console.log(response);
          modal.classList.remove('is-active');
          modal.classList.toggle('visible');  
          fetchAPI ();
        }
      })
      .catch(err => console.log(err));
  });
});


function postStyling(postOwner, title, description) {
  postOwner.setAttribute('class', 'is-size-7');
  title.setAttribute('class', 'is-size-4');
  title.classList.add('class', 'has-text-black-bis')
  description.setAttribute('class', 'is-size-6');
}

function getComments (id) {
  fetch(`http://thesi.generalassemb.ly:8080/post/${id}/comment`)
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        displayComments(response);
    })
    .catch(err => console.log(err)); 
}

function displayComments (response) {
  commentBox = document.createElement('div');
  postContainer.append(commentBox);

  response.forEach(comment => {
    let user = comment.user.username;
    let commentText = comment.text;
    
    let username = document.createElement('h4'); 
    let userComment = document.createElement('p');
    let comments = document.createElement('div');

    username.innerText = user;
    userComment.innerText = commentText;
    
    commentBox.setAttribute('class', 'commmentBox');
    comments.setAttribute('class', 'commments');

    commentBox.append(comments);
    comments.append(username);
    comments.append(userComment);
    
    // Logic for deleting comment buttons by matching username
    if (user === sessionStorage.getItem('username')) {
      console.log('username match');
      const deleteCommentBtn = document.createElement('button');
      deleteCommentBtn.innerText = 'Delete';
      deleteCommentBtn.setAttribute('data-id', comment.id);
      deleteCommentBtn.setAttribute('class', 'button is-dark is-small');
      comments.append(deleteCommentBtn);

      deleteCommentBtn.addEventListener('click', deleteComments);
    }
  });
}

function postComments (e) {
  e.preventDefault();
  let token = sessionStorage.getItem('token');
  let commentText = document.querySelector('#textarea-text');

  fetch(`http://thesi.generalassemb.ly:8080/comment/${currentPostID}`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
        text: commentText.value
    })})
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        commentBox.remove();
        getComments(currentPostID);
        commentText.value ='';
        // console.log(commentText);
    })
    .catch(err => console.log(err)); 
}

function createComment () {
  let textarea = document.createElement('textarea');
  let submitBtn = document.createElement('button');
  let commentBox = document.createElement('div');
  submitBtn.innerText = 'Comment'
  postContainer.append(commentBox);

  textarea.setAttribute('id', 'textarea-text');
  textarea.setAttribute('class', 'textarea is-medium');
  textarea.setAttribute('placeholder', 'Add a comment...');

  submitBtn.setAttribute('class', 'is-outlined button');

  commentBox.append(textarea);
  commentBox.append(submitBtn);
  console.log(textarea);

  submitBtn.addEventListener('click', postComments);
}


function deleteComments (e) {
  // console.log('delCom e', e);
  let token = sessionStorage.getItem('token');
  //let commentText = document.querySelector('#textarea-text').value;
  console.log("comments", e.target.dataset.id);
  fetch(`http://thesi.generalassemb.ly:8080/comment/${e.target.dataset.id}`, {
    method: 'DELETE',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }})
    .then(response => {
      response.json();
    })
    .then(response => {
      commentBox.remove();
      getComments(currentPostID);
    })
    .catch(err => console.log(err)); 
}

function logout() {
  let username = sessionStorage.getItem('username') || '';

  console.log('logout func fired', isAuthenticated);
  if (!!isAuthenticated) {
    console.log('logout conditional fired');
    let logoutBtn = createButton('logout', 'Logout', 'is-light');
    while (navButtons.firstChild) navButtons.removeChild(navButtons.firstChild);
    navButtons.append(logoutBtn);
    
    let profile = document.createElement('a');
    profile.innerHTML = `<i class="material-icons">
    person</i> ${username}`;
    navButtons.append(profile);

    profile.addEventListener('click', getProfile);

    //say hello with username
    //loginForm.remove(); 
  
    logoutBtn.addEventListener('click', function() {
      sessionStorage.clear();
      while (navButtons.firstChild) navButtons.removeChild(navButtons.firstChild);
      navButtons.append(loginBtn);
      navButtons.append(signUpBtn);
    })
  }
}

function createButton (id, innerText, className) {
  let btn = document.createElement('button');
  btn.setAttribute('id', id);
  btn.innerText = innerText;
  btn.setAttribute('class', className);
  btn.classList.add('button');
  return btn;
}


function getProfile () {
  fetch(`http://thesi.generalassemb.ly:8080/profile`, {
    method: 'GET',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +  sessionStorage.getItem('token')
    }})
    .then(response => response.json())
    .then(response => {
      isProfile(response);
    })
    .catch(err => console.log(err));
}

function createProfile(email, mobile, address) {
  
  fetch(`http://thesi.generalassemb.ly:8080/profile`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' +  sessionStorage.getItem('token')
    },
    body: JSON.stringify({
        additionalEmail: email,
        mobile: mobile,
        address: address        
    })})
    .then(response => response.json())
    .then(response => {
      isProfile(response);
    })
    .catch(err => console.log(err));
}


function isProfile (response) {
  while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);
  if (!!response.id) {
    displayProfile(response);   
  }
  else {
    displayProfileForm();
  }
}

function displayProfile (response) {
  let addEmail = document.createElement('p');
  let mobile = document.createElement('p');
  let address = document.createElement('p');
  let username = document.createElement('p');

  addEmail.innerText = response.additionalEmail;
  mobile.innerText = response.mobile;
  address.innerText = response.address;
  username.innerText = response.user.username;

  allPosts = multiAppender(allPosts, [addEmail, mobile, address, username]);
}

function displayProfileForm () {
  
  let addEmail = document.createElement('input');
  let mobile = document.createElement('input');
  let address = document.createElement('input');
  let createProfileBtn = createButton('createProfile', 'Create Profile', 'button is-primary');
  
  allPosts = multiAppender(allPosts, [addEmail, mobile, address, createProfileBtn]);

  createProfileBtn.addEventListener('click', function () {
    createProfile(addEmail.value, mobile.value, address.value);
  })
}

logout();
