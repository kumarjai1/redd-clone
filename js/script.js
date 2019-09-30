// Global Dom Selections
let allPosts = document.getElementById('allPosts');
let main = document.querySelector('main');
let navButtons = document.getElementById('navButtons');
let modalForm = document.getElementById('modalForm');
let modalBtn = document.querySelector('.modal-button');
let modal = document.querySelector('.modal');
let close = document.querySelector('.modal-close');

// Checks if user is authenticated on page loaded. If token exists in sessionStorage, set to true, else set to false
let isAuthenticated = !!sessionStorage.getItem('token') || false;

let postsArr = [];
let currentPost = {};

// Global vars initialized as undefined to allow for later assignment
let currentPostID;
let postContainer;
let commentBox;
let paginationBtn;
let postsStart;
let postsLimit = 25;

// console.log(isAuthenticated);

// Posts Feature
////////////////////////////////////////////////////////////////////////////////////////////////////

// Fetches the posts API, get many, Method: GET
function getPosts () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        // console.log(response)
        postsArr = response;
        // console.log({ postsArr });
        displayPosts(response);
        postsStart = response.length - 1;
    })
    .catch(err => console.log(err)); 
}

// Displays the latest 25 posts
function displayPosts(arr) {
  let postsStart = arr.length - 1;

  while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);

  for (let i = postsStart; i >= arr.length - postsLimit; i--) {
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

    // Add data-id
    postTitle.setAttribute('data-id', arr[i].id);

    // adds to the post container
    postContainer = multiAppender(postContainer, [ postOwner, postTitle, postContent ]);
    allPosts.append(postContainer);

    // Delete Post logic
    if (user === sessionStorage.getItem('username')) {
      const deletePostBtn = document.createElement('button');
      deletePostBtn.innerText = 'Delete';
      deletePostBtn.setAttribute('data-id', arr[i].id);
      deletePostBtn.setAttribute('class', 'button is-dark is-small');
      postContainer.append(deletePostBtn);

      // deletePostBtn.addEventListener('click', deletePost);
    }

    // Click Handler to show single post view
    postTitle.addEventListener('click', (e) => {
      singlePostView(e, postOwner, postContent, postContainer);
    });

    postStyling (postOwner, postTitle, postContent);
  // Closes for loop
  }
  // Show Pagination 'Load More' Button?
  if (arr[arr.length - postsLimit - 1]) {
    // console.log('more to load!');
    paginationBtn = createButton('paginationBtn', 'Load More', 'button is-primary');
    main.appendChild(paginationBtn);
    paginationBtn.addEventListener('click', pagination);
  }  
}

// Handles closing the modal
close.addEventListener('click', function(e) {
  e.preventDefault();
  modal.classList.remove('is-active');
  modal.classList.toggle('visible');
});

// Login Feature
////////////////////////////////////////////////////////////////////////////////////////////////////

let loginForm = document.getElementById('loginForm');
let loginBtn = createButton('loginBtn', 'Login', 'is-primary is-outlined');

navButtons.append(loginBtn);

loginBtn.addEventListener('click', generateLoginForm);

// Sign Up Feature
////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Sign Up Fetch, Method: POST
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

  titleField = multiAppender(titleField, [postTitle, titleLabel]);
  descField = multiAppender(descField, [postDescription, descLabel]);
  modalForm = multiAppender(modalForm, [titleField, descField, postSubmitBtn]);
  
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
          // console.log(response);
          modal.classList.remove('is-active');
          modal.classList.toggle('visible');  
          getPosts ();
        }
      })
      .catch(err => console.log(err));
  });
});

// Comments Feature
////////////////////////////////////////////////////////////////////////////////////////////////////

// Gets all comments associated with a given Post's id, get many, Method: GET
function getComments (id) {
  fetch(`http://thesi.generalassemb.ly:8080/post/${id}/comment`)
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        displayComments(response);
    })
    .catch(err => console.log(err)); 
}

// Displays the fetched comments on the Single Post View
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
      // console.log('username match');
      const deleteCommentBtn = document.createElement('button');
      deleteCommentBtn.innerText = 'Delete';
      deleteCommentBtn.setAttribute('data-id', comment.id);
      deleteCommentBtn.setAttribute('class', 'button is-dark is-small');
      comments.append(deleteCommentBtn);

      deleteCommentBtn.addEventListener('click', deleteComments);
    }
  });
}

// Generates a form to allow a user to create a comment
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
  // console.log(textarea);

  submitBtn.addEventListener('click', postComments);
}

// Fetch call to post a new comment, Method: POST
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

// Checks if a user is authorized to delete a comment, then calls a fetch to delete the comment, Method: DELETE
function deleteComments (e) {
  // console.log('delCom e', e);
  let token = sessionStorage.getItem('token');
  //let commentText = document.querySelector('#textarea-text').value;
  // console.log("comments", e.target.dataset.id);
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

// Logout and Authentication Feature
////////////////////////////////////////////////////////////////////////////////////////////////////

function logout() {
  let username = sessionStorage.getItem('username') || '';

  // console.log('logout func fired', isAuthenticated);
  if (!!isAuthenticated) {
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
      getPosts();
    })
  }
}

// User Profile Features
////////////////////////////////////////////////////////////////////////////////////////////////////

// Fetch call to get a user's profile, get one, Method: GET
function getProfile () {
  paginationBtn.remove();
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

// Fetch call to generate a user's profile, Method: POST
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

// Checks if user has a profile. If profile exists, show user's current profile, else show create profile form
function isProfile (response) {
  while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);
  if (!!response.id) {
    displayProfile(response);   
  }
  else {
    displayProfileForm();
  }
}

// Shows the user's profile
function displayProfile (response) {
  // let addEmailLabel = document.createElement('p');
  let addEmail = document.createElement('p');
  // let mobileLabel = document.createElement('p');
  let mobile = document.createElement('p');
  // let addressLabel = document.createElement('p');
  let address = document.createElement('p');
  let username = document.createElement('p');
  let editProfile = createButton('updateProfile', 'Edit Profile', 'button is-info is-outlined is-small')
  
  addEmail.innerHTML = `<strong>Additional Email Address:</strong> </br>${response.additionalEmail}</br></br>`;
  mobile.innerHTML = `<strong>Mobile:</strong> </br>${response.mobile}</br></br>`;
  address.innerHTML = `<strong>Address:</strong> </br>${response.address}</br></br>`;
  username.innerHTML = `<strong>Username:</strong> </br>${response.user.username}</br></br>`;

  allPosts = multiAppender(allPosts, [addEmail, mobile, address, username, editProfile]);

  editProfile.addEventListener('click', function() {  
    updateProfileForm();
  })
}

// Displays a form to allow the user to create a profile
function displayProfileForm () {
  
  let addEmail = document.createElement('input');
  let mobile = document.createElement('input');
  let address = document.createElement('input');
  let createProfileBtn = createButton('createProfile', 'Create Profile', 'button is-primary');

  let addEmailLabel = document.createElement('label');
  let mobileLabel = document.createElement('label');
  let addressLabel = document.createElement('label');

  addEmailLabel.innerText = 'Additional Email Address: ';
  mobileLabel.innerText = ' Mobile: ';
  addressLabel.innerText = ' Address: ';

  addEmail.setAttribute('class', 'input');
  mobile.setAttribute('class', 'input');
  address.setAttribute('class', 'input');
  addEmail.setAttribute('placeholder', 'username@email.com');
  mobile.setAttribute('placeholder', '123.456.789');
  address.setAttribute('placeholder', '123 Name St, City, State, 12345');

  
  allPosts = multiAppender(allPosts, [addEmailLabel, addEmail, mobileLabel, mobile, addressLabel, address, createProfileBtn]);

  createProfileBtn.addEventListener('click', function () {
    createProfile(addEmail.value, mobile.value, address.value);
  })
}

// Shows a form to allow the user to update their profile
function updateProfileForm() {
  
  if (document.getElementById('divUpdateForm')) {
    document.getElementById('divUpdateForm').remove();
  }

  let updateDiv = document.createElement('div');
  let addEmail = document.createElement('input');
  let mobile = document.createElement('input');
  let address = document.createElement('input');
  let update = createButton('update', 'Update', 'button is-danger is-outlined is-small updateBtn')
  
  addEmail.setAttribute('class', 'input');
  mobile.setAttribute('class', 'input');
  address.setAttribute('class', 'input');
  addEmail.setAttribute('placeholder', 'username@email.com');
  mobile.setAttribute('placeholder', '123.456.789');
  address.setAttribute('placeholder', '123 Name St, City, State, 12345');

  let addEmailLabel = document.createElement('label');
  let mobileLabel = document.createElement('label');
  let addressLabel = document.createElement('label');

  addEmailLabel.innerText = 'Additional Email Address: ';
  mobileLabel.innerText = ' Mobile: ';
  addressLabel.innerText = ' Address: ';
  
  updateDiv.setAttribute('id', 'divUpdateForm');

  allPosts.append(updateDiv);

  updateDiv = multiAppender(updateDiv, [addEmailLabel, addEmail, mobileLabel, mobile, addressLabel, address, update]);
  
  update.addEventListener('click', function () {
    updateProfile(addEmail.value, mobile.value, address.value);
  })
}

// Fetch function to update the user's profile
function updateProfile(email, mobile, address) {
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
      getProfile();
    })
    .catch(err => console.log(err));
}

// Helper Functions
////////////////////////////////////////////////////////////////////////////////////////////////////

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

/**
 * @name createButton
 * @description Creates a button and sets the attributes and innerText arguments to the button
 * @param { string } id The id to assign to the button
 * @param { string } innerText The text to be shown on the button face
 * @param { string } className The classes to be assigned to the button for Bulma styling
 * @returns A button to be stored in a variable
 */
function createButton (id, innerText, className) {
  let btn = document.createElement('button');
  btn.setAttribute('id', id);
  btn.innerText = innerText;
  btn.setAttribute('class', className);
  btn.classList.add('button');
  return btn;
}

/**
 * @name postStyling
 * @description Uses Bulma classes to style an element passed in, specifically for styling posts
 * @param { variable } postOwner A DOM node set to a variable that is the username of the post author
 * @param { variable } title A DOM node set to a variable that is the title of the post
 * @param { variable } description A DOM node set to a variable that is the text body of the post
 */
function postStyling(postOwner, title, description) {
  postOwner.setAttribute('class', 'is-size-7');
  title.setAttribute('class', 'is-size-4');
  title.classList.add('class', 'has-text-black-bis')
  description.setAttribute('class', 'is-size-6');
}

// Default function invocations on page load
////////////////////////////////////////////////////////////////////////////////////////////////////

logout();
getPosts();

