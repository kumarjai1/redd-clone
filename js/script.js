const allPosts = document.getElementById('allPosts');
let isAuthenticated;

//fetches the post API
function fetchAPI () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        //console.log(response)
        displayPosts(response);
    })
    .catch(err => console.log(err)); 
}

//displays all latest 50 posts
function displayPosts(arr) {
    for (let i = arr.length -1; i > arr.length-50; i--) {

      //creates tags for the post elements in the frontend
      let postContainer = document.createElement('div');
      let postOwner = document.createElement('h4');
      let postTitle = document.createElement('h1');
      let postContent = document.createElement('p');

      //defines the content to the tags
      postContainer.classList.add('container');
      postOwner.innerText = arr[i].user.username;
      postTitle.innerText = arr[i].title;
      postContent.innerText = arr[i].description;

      //console.log(postContent.innerText);

      //adds to the post container
      allPosts.append(postContainer);
      postContainer.append(postOwner);
      postContainer.append(postTitle);
      postContainer.append(postContent);
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

  let title = postTitle.value;
  let description = postDescription.value;

  postSubmitBtn.addEventListener('click', function(e) {
    e.preventDefault();

    let token = sessionStorage.getItem('token');
    
    fetch(`http://thesi.generalassemb.ly:8080/post`, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        title,
        description
      })})
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(err => console.log(err));
  });
});
