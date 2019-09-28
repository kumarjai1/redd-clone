function pagination(e) {
  
  postsStart -= postsLimit;
  console.log('from pagination.js pagination() ', postsArr, postsStart);

  for (let i = postsStart - 1; i >= postsStart - postsLimit; i -= 1) {
    // console.log(postsArr[i]);
    if (!postsArr[i]) break;

    let user = postsArr[i].user.username;

    //creates tags for the post elements in the frontend
    postContainer = document.createElement('div');
    let postOwner = document.createElement('h4');
    let postTitle = document.createElement('a');
    let postContent = document.createElement('p');

    //defines the content to the tags
    postContainer.classList.add('container');
    postOwner.innerText = 'posted by ' + postsArr[i].user.username;
    postTitle.innerText = postsArr[i].title;
    postContent.innerText = postsArr[i].description;

    // Add data-id
    postTitle.setAttribute('data-id', postsArr[i].id);

    //adds to the post container
    allPosts.append(postContainer);
    postContainer = multiAppender(postContainer, [ postOwner, postTitle, postContent ]);

    if (user === sessionStorage.getItem('username')) {
      const deletePostBtn = document.createElement('button');
      deletePostBtn.innerText = 'Delete';
      deletePostBtn.setAttribute('data-id', postsArr[i].id);
      deletePostBtn.setAttribute('class', 'button is-dark is-small');
      postContainer.append(deletePostBtn);
    }

    // Show Single Post View Click Handler
    postTitle.addEventListener('click', function(e) {
      currentPostID = e.target.dataset.id;
      // Empties All Posts View for Single Post View
      while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);
      while (postContainer.firstChild) postContainer.removeChild(postContainer.firstChild);

      paginationBtn.remove();

      postsArr.forEach(post => {
        if (post.id === parseInt(currentPostID)) {

          currentPost.id = post.id;
          currentPost.title = post.title;
          currentPost.description = post.description;
          currentPost.user = post.user;

          // Create Single View Post Elements
          const singlePostTitle = document.createElement('h1');

          postContainer.classList.add('container');
          postOwner.innerText = 'posted by ' + post.user.username;
          singlePostTitle.innerText = post.title;
          postContent.innerText = post.description;

          // Append Single View Post Elements
          allPosts = multiAppender(allPosts, [ postOwner, singlePostTitle, postContent ]);
          allPosts.append(postContainer);

          getComments(currentPostID);
          createComment();
        }
      });
    });
    postStyling (postOwner, postTitle, postContent);
  }
}