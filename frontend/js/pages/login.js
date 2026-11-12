// FILE: js/pages/login.js
// PAGE: index.html
// TASK: Check username and password, then open the main menu.
if (localStorage.getItem('mf_token')) window.location.replace('menu.html');

document.getElementById('toggle-password').addEventListener('click', () => {
  const field = document.getElementById('login-password');
  field.type = field.type === 'password' ? 'text' : 'password';
});

document.getElementById('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.getElementById('login-id').value;
  const password = document.getElementById('login-password').value;
  const result = await User.login(id, password);
  if (result.ok) window.location.href = 'menu.html';
  else Common.text('login-error', result.error);
});
