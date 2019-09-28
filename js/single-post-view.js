console.log('single post view');

function singlePostView(e, postOwner, postContent, postContainer) {
    // console.log(e.target.dataset.id);
  currentPostID = e.target.dataset.id;

  // Empties All Posts View for Single Post View
  allPosts.innerHTML = '';
  postContainer.innerHTML = '';

  paginationBtn.remove();

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
}