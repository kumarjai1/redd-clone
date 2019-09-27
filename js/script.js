const allPosts = document.getElementById('allPosts');
let currentPostID;
let isAuthenticated = !!sessionStorage.getItem('token') || false;
console.log(isAuthenticated);
let postsArr = [];
let currentPost = {};
let postContainer;
let commentBox;
let navButtons = document.getElementById('navButtons');
console.log(navButtons);


//fetches the post API
function fetchAPI () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        postsArr = response;
        console.log({ postsArr });
        displayPosts(response);
    })
    .catch(err => console.log(err)); 
}

//displays all latest 50 posts
function displayPosts(arr) {
    for (let i = 0; i < arr.length; i++) {

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

      postTitle.addEventListener('click', function(e) {
        console.log(e.target.dataset.id);
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
            console.log('currentPost', currentPostID);

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
            console.log(postContainer);

            getComments(currentPostID);
            //postComments();
            console.log("test")
            createComment();
          }
        });

      })

      postStyling (postOwner, postTitle, postContent);
    }
}

fetchAPI();

//login feature
let loginBtn = createButton('loginBtn', 'Login', 'is-light');
navButtons.append(loginBtn);
console.log(loginBtn);
let loginForm = document.getElementById('loginForm');



// logout();



let modalBtn = document.querySelector('.modal-button');
let modal = document.querySelector('.modal');
let close = document.querySelector('.modal-close')
console.log(modalBtn);
close.addEventListener('click', function(e) {
  e.preventDefault();
  modal.classList.remove('is-active');
  modal.classList.toggle('visible');
})



loginBtn.addEventListener('click', function (e) {
  console.log(loginForm);

  e.preventDefault();
  modal.classList.toggle('visible');
  modal.classList.add('is-active');

  let modalForm = document.getElementById('modalForm');
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

  emailInput.setAttribute('placeholder', 'email@domain.com');
  emailInput.setAttribute('for', 'email');
  emailInput.setAttribute('class','input')

  passwordInput.setAttribute('placeholder', 'password');
  passwordInput.setAttribute('class','input')
  
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
     console.log(isAuthenticated);

    logout();
    modal.classList.remove('is-active');
    modal.classList.toggle('visible');

    

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
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('username', response.username);
      isAuthenticated = !!sessionStorage.getItem('token');
      
    })
    .catch(err => console.log(err));
}

// Sign up features
const signUpBtn = createButton('signUpBtn', 'Sign Up', 'is-primary');
navButtons.append(signUpBtn);
const signUpForm = document.querySelector('#signUpForm');

signUpBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const email = document.createElement('input');
  const username = document.createElement('input');
  const password = document.createElement('input');
  const submitBtn = document.createElement('button');

  submitBtn.innerText = 'Sign Up';

  email.setAttribute('placeholder', 'email@domain.com');
  username.setAttribute('placeholder', 'username');
  password.setAttribute('placeholder', 'password');

  signUpForm.append(email);
  signUpForm.append(username);
  signUpForm.append(password);
  signUpForm.append(submitBtn);

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();

    submitSignUp(email.value, username.value, password.value)
  });
});

// Sign Up Fetch Method: POST
function submitSignUp(email, username, password) {
  fetch(`http://thesi.generalassemb.ly:8080/signup`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email,
        username,
        password,
    })})
    .then(response => response.json())
    .then(response => {
      sessionStorage.setItem('token', response.token);
      isAuthenticated = !!sessionStorage.getItem('token');
      logout();
    })
    .catch(err => console.log(err));
}

let createPostBtn = document.querySelector('#createPostBtn');

createPostBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const createPostForm = document.createElement('form');
  document.body.appendChild(createPostForm);

  const postTitle = document.createElement('input');
  const postDescription = document.createElement('textarea');
  const postSubmitBtn   = document.createElement('button');

  postTitle.setAttribute('placeholder', 'Title');
  postDescription.setAttribute('placeholder', 'Please describe your post in detail (Optional)');

  postSubmitBtn.innerText = 'POST';

  createPostForm.append(postTitle);
  createPostForm.append(postDescription);
  createPostForm.append(postSubmitBtn);
  

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
        console.log(response);
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
        console.log(response);
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
      comments.append(deleteCommentBtn);

      deleteCommentBtn.addEventListener('click', deleteComments);
    }
  });
}

function postComments (e) {
  e.preventDefault();
  let token = sessionStorage.getItem('token');
  let commentText = document.querySelector('#textarea-text').value;

  fetch(`http://thesi.generalassemb.ly:8080/comment/${currentPostID}`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
        text: commentText
    })})
    .then(response => response.json())
    .then(response => {
        // console.log(response);
        commentBox.remove();
        getComments(currentPostID);
    })
    .catch(err => console.log(err)); 
}

function createComment () {
  let textarea = document.createElement('textarea');
  let submitBtn = document.createElement('button');
  let commentBox = document.createElement('div');
  submitBtn.innerText = 'Submit Comment'
  postContainer.append(commentBox);

  textarea.setAttribute('id', 'textarea-text');
  textarea.setAttribute('placeholder', 'Add a comment...');

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
  console.log('logout func fired', isAuthenticated);
  if (!!isAuthenticated) {
    console.log('logout conditional fired');
    let logoutBtn = createButton('logout', 'Logout', 'is-light');
    navButtons.append(logoutBtn);
      
    loginBtn.remove();
    signUpBtn.remove();

    //say hello with username
    navButtons.append(`hi, ${sessionStorage.username}`);
    //loginForm.remove();
  
    logoutBtn.addEventListener('click', function() {
      sessionStorage.clear();
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
