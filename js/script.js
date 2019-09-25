const allPosts = document.getElementById('allPosts');

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
  console.log(email, password);

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
      console.log(response.token);
      sessionStorage.setItem('token', response.token);

    })
    .catch(err => console.log(err));
}

console.log();

