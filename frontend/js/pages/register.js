// FILE: js/pages/register.js
// PAGE: register.html
// TASK: Create a player account through the backend API.
[
  ['toggle-password', 'password', 'password'],
  ['toggle-confirm-password', 'confirm-password', 'confirm password']
].forEach(([buttonId, inputId, label]) => {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  button.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} ${label}`);
    button.setAttribute('aria-pressed', String(show));
  });
});

document.getElementById('register-form').addEventListener('submit', async event => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmation = document.getElementById('confirm-password').value;
  const result = await User.register(username, email, password, confirmation);
  if (result.ok) window.location.href = 'menu.html';
  else Common.text('register-error', result.error);
});
