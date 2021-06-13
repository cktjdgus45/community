const form = document.getElementById('commentForm');
const delBtns = document.querySelectorAll('.delBtn');

const addComment = (text, id) => {
    const videoComments = document.querySelector('.video__comments ul');
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    span.innerText = `${text}`;
    span2.innerText = '❌';
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
    span2.addEventListener('click', handleDelete);
}

const handleDelete = async (event) => {
    event.preventDefault();
    const delbtn = event.target;
    const comment = delbtn.parentNode;
    const videoComments = comment.parentNode;
    const commentId = comment.dataset.id;
    const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
    })
    if (response.status === 201) {
        videoComments.removeChild(comment);
    }
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const news = document.querySelector('.news');
    const textarea = form.querySelector('textarea');
    const newsId = news.dataset.id;
    const text = textarea.value; //댓글 값.
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${newsId}/comment`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    textarea.value = "";
    if (response.status === 201) {
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
}

if (form) {
    form.addEventListener('submit', handleSubmit);
}

if (delBtns) {
    delBtns.forEach(delBtn => {
        delBtn.addEventListener('click', handleDelete);
    })
}