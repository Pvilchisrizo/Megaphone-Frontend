//const baseURL = `https://megaphone-backend-paloma.onrender.com`;
const form = document.getElementById("new-post-form");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const logoutButton = document.getElementById("logout-button");
const baseURL =
  window.location.protocol === "file:"
    ? "http://localhost:3000"
    : window.location.origin;
const deleteEnabled = false;
let currentUser = localStorage.getItem("megaphone-username");

const updateAuthUi = () => {
  loginStatus.innerText = currentUser
    ? `Logged in as ${currentUser}.`
    : "Not logged in.";
  form.style.display = currentUser ? "flex" : "none";
  logoutButton.style.display = currentUser ? "inline-block" : "none";
};

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
updateAuthUi();

const usernameClickEvent = (event) => {
  getPosts(event.target.innerText);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    return;
  }

  await fetch(`${baseURL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: form.elements.body.value,
      author: currentUser,
    }),
  }).then((response) => {
    return response.json();
  });

  getPosts();
  form.reset();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch(`${baseURL}/login/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: loginForm.elements.username.value,
      password: loginForm.elements.password.value,
    }),
  });

  if (!response.ok) {
    loginStatus.innerText = "Incorrect username or password.";
    return;
  }

  const user = await response.json();
  currentUser = user.username;
  localStorage.setItem("megaphone-username", currentUser);
  updateAuthUi();
  loginForm.reset();
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("megaphone-username");
  updateAuthUi();
});
