const form = document.getElementById("new-post-form");
const baseURL = `https://megaphone-backend-paloma.onrender.com`;

const getPosts = async () => {
  const response = await fetch(`${baseURL}/posts`);
  const posts = await response.json();

  addPostsToPage(posts);
  return posts;
};

const addPostsToPage = (posts) => {
  const allPosts = document.getElementById("all-posts");
  allPosts.innerHTML = "";

  posts.reverse().forEach((post) => {
    const newListItem = document.createElement("li");
    newListItem.className = "post";
    const postBody = document.createElement("p");
    postBody.className = "post-body";
    const postMeta = document.createElement("p");
    postMeta.className = "post-meta";
    const deleteButton = document.createElement("a");
    deleteButton.className = "delete-button";
    deleteButton.innerText = "❌";

    postBody.innerText = post.body;
    postMeta.innerText = post.author;

    deleteButton.addEventListener("click", async () => {
      await fetch(`${baseURL}/posts/${post._id}`, { method: "DELETE" });

      getPosts();
    });

    newListItem.appendChild(postBody);
    newListItem.appendChild(postMeta);
    newListItem.appendChild(deleteButton);

    allPosts.appendChild(newListItem);
  });
};

getPosts();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  await fetch(`${baseURL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: form.elements.body.value,
      author: form.elements.user.value,
    }),
  }).then((response) => {
    return response.json();
  });

  getPosts();
  form.reset();
});
