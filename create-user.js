const baseURL = `https://megaphone-backend-paloma.onrender.com`;
const form = document.getElementById("new-user-form");
const statusMessage = document.getElementById("status-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // event.preventDefault stops the browser from executing its built-in default action associated with a specific eventForms: Stops <form> elements from submitting and refreshing the page. This is critical for validating data or sending inputs asynchronously via APIs

  const username = form.elements.username.value;
  const password = form.element.password.value;

  const response = await fetch(`${baseURL}/signup`, {
    method: "POST",
    // headers is equivalent of the postman menu where you select body and json
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
