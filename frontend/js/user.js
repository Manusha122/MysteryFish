// USER MODULE: calls the Mystery Fish API and keeps only the login token/profile cache.
const User = (() => {
  const API_BASE = 'http://localhost:3000/api';
  const TOKEN_KEY = 'mf_token';
  const USER_KEY = 'mf_user';

  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
    catch (error) {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  }

  async function request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch (error) {
      throw new Error('Cannot reach the game server. Start the backend and try again.');
    }

    let data;
    try { data = await response.json(); }
    catch (error) { throw new Error('The game server returned an invalid response.'); }

    if (!response.ok) {
      if (response.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
        logout();
        window.location.replace('index.html');
      }
      throw new Error(data.error || 'The request could not be completed.');
    }
    return data;
  }

  function saveSession(data) {
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
  }

  async function register(username, email, password, confirmation) {
    username = username.trim();
    email = email.trim().toLowerCase();
    if (username.length < 3) return { ok: false, error: 'Username needs at least 3 characters.' };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return { ok: false, error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.' };
    }
    if (password !== confirmation) return { ok: false, error: 'Passwords do not match.' };

    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });
      saveSession(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function login(identifier, password) {
    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ login: identifier.trim(), password })
      });
      saveSession(data);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  async function refreshProfile() {
    const data = await request('/profile');
    return setUser(data.user);
  }

  async function updateProfile(changes) {
    const data = await request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(changes)
    });
    return setUser(data.user);
  }

  async function recordGame(level, score, stars, game) {
    const data = await request('/games', {
      method: 'POST',
      body: JSON.stringify({ level, score, stars, ...game })
    });
    setUser(data.user);
    return data;
  }

  async function getGames() {
    const data = await request('/games/mine');
    return data.games;
  }

  async function getLeaderboard() {
    const data = await request('/leaderboard');
    return data.rows;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    register, login, current: getUser, logout, refreshProfile, updateProfile,
    recordGame, getGames, getLeaderboard
  };
})();
