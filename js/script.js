const allPosts = document.getElementById('allPosts');

function fetchAPI () {
    fetch(`http://thesi.generalassemb.ly:8080/post/list`)
    .then(response => response.json())
    .then(response => {
        console.log(response)
        displayPosts(response);
    })
    .catch(err => console.log(err)); 
}

function displayPosts(arr) {
    for (let i = 0; i <= 50; i++) {
      let postContainer = document.createElement('div');
      let postOwner = document.createElement('h4');
    
      postContainer.classList.add('container');
      postOwner.innerText = arr[i].user.username;

      console.log(postOwner);
      allPosts.append(postContainer);
      postContainer.append(postOwner);
    }
}
fetchAPI();