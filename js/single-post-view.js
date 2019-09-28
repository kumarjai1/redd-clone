function singlePostView(e, postOwner, postContent, postContainer) {
  currentPostID = e.target.dataset.id;

  // Empties All Posts View for Single Post View
  while (allPosts.firstChild) allPosts.removeChild(allPosts.firstChild);
  while (postContainer.firstChild) postContainer.removeChild(postContainer.firstChild);

  paginationBtn.remove();

  // Populate the view with Single Post elements
  postsArr.forEach(post => {
    if (post.id === parseInt(currentPostID)) {

      currentPost.id = post.id;
      currentPost.title = post.title;
      currentPost.description = post.description;
      currentPost.user = post.user;

      // Create Single Post View Elements
      const singlePostTitle = document.createElement('h1');

      postContainer.classList.add('container');
      postOwner.innerText = 'posted by ' + post.user.username;
      singlePostTitle.innerText = post.title;
      postContent.innerText = post.description;

      // Append Single View Post Elements
      postContainer = multiAppender(postContainer, [ postOwner, singlePostTitle, postContent ]);
      allPosts.append(postContainer);

      getComments(currentPostID);
      createComment();
    }
  });
}