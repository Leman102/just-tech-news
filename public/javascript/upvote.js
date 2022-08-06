// async function bc it will make an asynchronous PUT request with fetch()
async function upvoteClickHandler(event) {
    event.preventDefault();

    //take the id from the URL
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
};
  
document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);