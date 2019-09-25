const allPosts = document.getElementById('allPosts');

//fetches the post API
function fetchAPI () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        displayPosts(response);
    })
    .catch(err => console.log(err)); 
}

//displays all posts
function displayPosts(arr) {
    for (let i = 0; i <= 50; i++) {

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

      console.log(postContent.innerText);

      //adds to the post container
      allPosts.append(postContainer);
      postContainer.append(postOwner);
      postContainer.append(postTitle);
      postContainer.append(postContent);
    }
}
fetchAPI();