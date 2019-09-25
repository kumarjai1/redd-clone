
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
    
}
fetchAPI();