// FILE: js/events.js
// PURPOSE: A simple event system. Other code announces what happened here.
// EXAMPLE: Events.emit('CorrectAnswer', { points: 10 });
const Events = {
  listeners: {},
  on(eventName, callback) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];
    this.listeners[eventName].push(callback);
  },
  emit(eventName, details = {}) {
    (this.listeners[eventName] || []).forEach(callback => callback(details));
  }
};
