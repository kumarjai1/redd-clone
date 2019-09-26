const allPosts = document.getElementById('allPosts');
let currentPostID;
let isAuthenticated;
let postsArr = [];
let currentPost = {};
let postContainer;

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
            postComments();
          }
        });

      })

      postStyling (postOwner, postTitle, postContent);
    }
}

fetchAPI();

//login feature
let loginBtn = document.getElementById('loginBtn');
let loginForm = document.getElementById('loginForm');

loginBtn.addEventListener('click', function () {
  console.log(loginForm);
  let emailInput = document.createElement('input');
  let passwordInput = document.createElement('input');
  let submitBtn = document.createElement('button');
  submitBtn.innerText = 'Login'
  loginForm.append(emailInput);
  loginForm.append(passwordInput); 
  loginForm.append(submitBtn);

  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    /**
     * grab the values
     * post it to the backend
     */

     let emailText = emailInput.value;
     let passwordText = passwordInput.value;
     
    submitLogin(emailText, passwordText);
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
      isAuthenticated = !!sessionStorage.getItem('token');
    })
    .catch(err => console.log(err));
}

// Sign up features
const signUpBtn = document.querySelector('#signUpBtn');
const signUpForm = document.querySelector('#signUpForm');

signUpBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const email = document.createElement('input');
  const username = document.createElement('input');
  const password = document.createElement('input');
  const submitBtn = document.createElement('button');

  submitBtn.innerText = 'Sign Up';

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
    })
    .catch(err => console.log(err));
}

let createPostBtn = document.querySelector('#createPostBtn');

createPostBtn.addEventListener('click', function(e) {
  e.preventDefault();

  const createPostForm = document.createElement('form');
  document.body.appendChild(createPostForm);

  const postTitle = document.createElement('input');
  const postDescription = document.createElement('input');
  const postSubmitBtn   = document.createElement('button');

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
  response.forEach(comment => {
    let user = comment.user.username;
    let commentText = comment.text;
    
    let username = document.createElement('h4'); 
    let userComment = document.createElement('p');
    let commentBox = document.createElement('div')

    username.innerText = user;
    userComment.innerText = commentText;

    postContainer.append(commentBox);
    commentBox.append(username);
    commentBox.append(userComment);
  })
}

function postComments () {
  let token = sessionStorage.getItem('token');
  fetch(`http://thesi.generalassemb.ly:8080/comment/${currentPostID}`, {
    method: 'POST',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
        text: 'frontend task'
    })})
    .then(response => response.json())
    .then(response => {
        console.log(response);
    })
    .catch(err => console.log(err)); 
}