// FILE: js/fishApi.js
// PURPOSE: Get the ONE revival puzzle ("How many fish are in the picture?") from the
//          lecturer's Marc Conrad Fish API.  Same call as GameServer.java in the Java starter code.
// API documentation: https://marcconrad.com/uob/fish/doc.php
// IMPORTANT: The external server must be online and allow browser (CORS) requests.
//            If it does not answer, revival.js offers a clearly labelled BACKUP puzzle.
const FishApi = (() => {
  const API_URL = 'https://marcconrad.com/uob/fish/api.php?out=json&base64=yes';
  const TIMEOUT_MS = 8000;   // give up after 8 seconds instead of waiting forever

  // ---------------------------------------------------------------
  // 1. makeOptions(): four DIFFERENT answer choices (solution + 3 nearby numbers)
  // ---------------------------------------------------------------
  function makeOptions(solution) {
    const choices = new Set([solution]);
    let offset = 1;
    while (choices.size < 4) {
      if (solution - offset >= 0) choices.add(solution - offset);
      if (choices.size < 4) choices.add(solution + offset);
      offset++;
    }
    return [...choices].sort((a, b) => a - b);
  }

  // ---------------------------------------------------------------
  // 2. parseReply(): understand what the API sent back.
  //    JSON reply: an image string in "question" and the answer in "fish"
  //    CSV reply: image and answer are the first two fields
  // ---------------------------------------------------------------
  function parseReply(text) {
    text = text.trim();
    let rawImage, solution;
    if (text.startsWith('{')) {                                    // JSON reply
      const data = JSON.parse(text);
      rawImage = data.question || data.image || data.img || data.picture;
      solution = Number(data.solution ?? data.answer ?? data.fish);
    } else {                                                       // CSV reply
      const fields = text.split(',');
      if (fields.length < 2) throw new Error('Fish API sent an unexpected response.');
      rawImage = fields[0].trim().replace(/^"|"$/g, '');
      solution = Number(fields[1].trim().replace(/^"|"$/g, ''));
    }
    if (!rawImage || !Number.isInteger(solution) || solution < 0) {
      throw new Error('Fish API puzzle is missing an image or answer.');
    }
    const image = /^(data:|https?:)/.test(rawImage) ? rawImage : 'data:image/png;base64,' + rawImage;
    return { image, solution, options: makeOptions(solution), source: 'api' };
  }

  // ---------------------------------------------------------------
  // 3. getPuzzle(): ask the real Fish API (with a time limit)
  // ---------------------------------------------------------------
  async function getPuzzle() {
    const stop = new AbortController();
    const timer = setTimeout(() => stop.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(API_URL, { cache: 'no-store', signal: stop.signal });
      if (!response.ok) throw new Error('Fish API HTTP error: ' + response.status);
      return parseReply(await response.text());
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Fish API did not answer within 8 seconds.');
      throw error;
    } finally { clearTimeout(timer); }
  }

  // ---------------------------------------------------------------
  // 4. getBackupPuzzle(): used ONLY when the real API cannot be reached.
  //    Draws 1-6 blue fish mixed with orange treasure boxes (same idea as the API puzzle).
  // ---------------------------------------------------------------
  function getBackupPuzzle() {
    const count = 1 + Math.floor(Math.random() * 6);
    let items = '';
    for (let i = 0; i < 9; i++) {                                  // treasure boxes = decoys
      items += `<rect x="${12 + (i % 5) * 52 + Math.random() * 12}" y="${14 + Math.floor(i / 5) * 62 + Math.random() * 14}" width="26" height="22" rx="4" fill="#d98a2b" stroke="#6b3d0c" stroke-width="3"/>`;
    }
    for (let i = 0; i < count; i++) {                              // the fish we count
      const x = 20 + (i % 3) * 82 + Math.random() * 14, y = 100 + Math.floor(i / 3) * 40 + Math.random() * 8;
      items += `<g transform="translate(${x} ${y})"><ellipse cx="18" cy="0" rx="18" ry="10" fill="#3f7fd9" stroke="#12307a" stroke-width="3"/>` +
               `<path d="M0 0 L-14 -9 L-14 9 Z" fill="#3f7fd9" stroke="#12307a" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="-3" r="2.5" fill="#fff"/></g>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="190" viewBox="0 0 300 190"><rect width="300" height="190" fill="#fff"/>` +
                `<text x="8" y="12" font-size="11" font-family="Arial" fill="#0a5bc4" font-weight="bold">Backup puzzle: how many fish?</text>${items}</svg>`;
    return { image: 'data:image/svg+xml;base64,' + btoa(svg), solution: count, options: makeOptions(count), source: 'backup' };
  }

  return { getPuzzle, getBackupPuzzle };
})();
