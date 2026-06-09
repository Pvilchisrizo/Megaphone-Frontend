const baseURL = `https://megaphone-backend-paloma.onrender.com`;
const form = document.getElementById("new-post-form");
const deleteEnabled = false;

const getPosts = async (username = null) => {
  const response = await fetch(`${baseURL}/posts`);
  let posts = await response.json();

  if (username) {
    posts = posts.filter((post) => {
      return post.author === username;
    });
    addPostsWithUserInfo(posts);
    return posts;
  }

  const allPosts = document.getElementById("all-posts");
  allPosts.innerHTML = "";
  addPostsToPage(posts);
  return posts;
};

const addPostsWithUserInfo = (posts) => {
  const allPosts = document.getElementById("all-posts");

  const cancelButton = document.createElement("a");
  cancelButton.className = "cancel-button";
  cancelButton.innerText = "×";

  cancelButton.addEventListener("click", () => {
    getPosts();
  });

  const userDescription = document.createElement("p");
  userDescription.innerText = `Posts by ${posts[0].author}: ${posts.length}`;

  allPosts.innerHTML = "";
  allPosts.appendChild(userDescription);
  allPosts.appendChild(cancelButton);
  addPostsToPage(posts);
};

const addPostsToPage = (posts) => {
  const allPosts = document.getElementById("all-posts");

  posts.reverse().forEach((post) => {
    const newListItem = document.createElement("li");
    newListItem.className = "post";
    const postBody = document.createElement("p");
    postBody.className = "post-body";
    const postMeta = document.createElement("div");
    postMeta.className = "post-meta";
    const deleteButton = document.createElement("a");
    deleteButton.className = "delete-button";
    deleteButton.innerText = "❌";

    postBody.innerText = post.body;

    usernameLabel = document.createElement("a");
    usernameLabel.href = "#";
    usernameLabel.innerText = post.author;
    usernameLabel.addEventListener("click", usernameClickEvent);
    postMeta.appendChild(usernameLabel);

    const secondsSincePosted = Math.round(
      (Date.now() - post.timecreated) / 1000
    );
    let unitOfTime = "second";
    let numberOfUnits = secondsSincePosted;

    if (numberOfUnits >= 60) {
      unitOfTime = "minute";
      numberOfUnits = Math.round(numberOfUnits / 60);
    }

    if (numberOfUnits >= 60) {
      unitOfTime = "hour";
      numberOfUnits = Math.round(numberOfUnits / 60);
    }

    if (numberOfUnits >= 24) {
      unitOfTime = "day";
      numberOfUnits = Math.round(numberOfUnits / 24);
    }

    timeLabel = document.createElement("p");
    timeLabel.innerText = `posted ${numberOfUnits} ${unitOfTime}${
      numberOfUnits !== 1 ? "s" : ""
    } ago.`;
    postMeta.appendChild(timeLabel);

    deleteButton.addEventListener("click", async () => {
      await fetch(`${baseURL}/posts/${post._id}`, { method: "DELETE" });

      getPosts();
    });

    newListItem.appendChild(postBody);
    newListItem.appendChild(postMeta);

    if (deleteEnabled) {
      postMeta.appendChild(deleteButton);
    }

    allPosts.appendChild(newListItem);
  });
};

getPosts();

const usernameClickEvent = (event) => {
  getPosts(event.target.innerText);
};

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
