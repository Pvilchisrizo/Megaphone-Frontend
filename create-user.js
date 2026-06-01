const baseURL = `https://megaphone-backend-paloma.onrender.com`;
const form = document.getElementById("new-post-form");
const statusMessage = document.getElementById("status-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = forrm.elements.username.value;
  const password = form.element.password.value;

  const responsem = await fetch(`${baseURL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (!response.ok) {
    statusMessage.innerText = `Failed to create a new user.`;
    return flase;
  }

  const user = await response.json();
  statusMessage.innerText = `Created new user: ${username}`;
  form.reset();
});
