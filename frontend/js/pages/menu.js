// FILE: js/pages/menu.js
// PAGE: menu.html
// TASK: Show menu after checking the player is logged in.
if (Common.requireLogin()) {
  Common.setupHeader();
}
