/* ==========================================================
   MegaOnlineChat - interactive demo widgets
   Every widget here is a labelled sample. None of them awards
   anything, and none of the people, chats or results are real.
   ========================================================== */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const fmt = s => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  document.addEventListener("DOMContentLoaded", () => {
    chat();
    video();
    sponsored();
    stories();
    music();
    spin();
    checkin();
    games();
  });

  /* ---------- 1. Community chat (scripted sample) ---------- */
  function chat() {
    const body = $("#chatBody");
    const typing = $("#chatTyping");
    if (!body) return;

    const script = [
      ["Amina", "Hello everyone, how is your day going?"],
      ["Daniel", "Going well. I just finished a quiz."],
      ["Grace", "Which one? I have been on the music activity."],
      ["Daniel", "The general knowledge one. Quick and easy."],
      ["Amina", "I will try that one next."],
      ["Peter", "Anyone up for a game of chess later?"],
      ["Grace", "Count me in."],
      ["Amina", "Same here. See you all later."]
    ];
    const colors = ["#FFD447", "#39D98A", "#3B82F6", "#FF9F6B"];
    let i = 0;

    function addMessage() {
      const [name, text] = script[i % script.length];
      const row = document.createElement("div");
      row.className = "msg";

      const av = document.createElement("span");
      av.className = "avatar";
      av.textContent = name[0];
      av.style.background = colors[i % colors.length];

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      const who = document.createElement("small");
      who.textContent = name;
      const msg = document.createElement("span");
      msg.textContent = text;
      bubble.append(who, msg);

      row.append(av, bubble);
      body.appendChild(row);
      while (body.children.length > 5) body.removeChild(body.firstChild);
      i++;
    }

    function cycle() {
      typing.hidden = false;
      setTimeout(() => {
        typing.hidden = true;
        addMessage();
        setTimeout(cycle, 1700);
      }, 1100);
    }

    // Start when the widget first scrolls into view
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { io.disconnect(); addMessage(); setTimeout(cycle, 1200); }
      }, { threshold: 0.3 });
      io.observe(body);
    } else {
      addMessage();
      setTimeout(cycle, 1200);
    }
  }

  /* ---------- 2. Video task ---------- */
  function video() {
    const screen = $("#videoScreen");
    if (!screen) return;
    const bar = $("#videoBar");
    const time = $("#videoTime");
    const status = $("#videoStatus");
    const playBtn = $("#videoPlay");
    const bigBtn = $("#videoBig");
    const reset = $("#videoReset");
    const DURATION = 12;

    let t = 0;
    let timer = null;

    function paint() {
      bar.style.width = (t / DURATION) * 100 + "%";
      time.textContent = fmt(t) + " / " + fmt(DURATION);
    }
    function setPlayLabel(icon, text) {
      playBtn.innerHTML = '<i class="fa-solid ' + icon + '"></i> ' + text;
    }
    function stop() {
      clearInterval(timer);
      timer = null;
      screen.classList.remove("playing");
    }
    function finish() {
      stop();
      t = DURATION;
      paint();
      status.textContent = "Task complete";
      status.classList.add("done");
      setPlayLabel("fa-rotate-right", "Replay");
      bigBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
    }
    function play() {
      if (t >= DURATION) t = 0;
      screen.classList.add("playing");
      status.textContent = "Watching";
      status.classList.remove("done");
      setPlayLabel("fa-pause", "Pause");
      bigBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      timer = setInterval(() => {
        t += 0.1;
        if (t >= DURATION) { finish(); return; }
        paint();
      }, 100);
    }
    function toggle() {
      if (timer) {
        stop();
        status.textContent = "Paused";
        setPlayLabel("fa-play", "Play");
      } else {
        play();
      }
    }
    function doReset() {
      stop();
      t = 0;
      paint();
      status.textContent = "Ready";
      status.classList.remove("done");
      setPlayLabel("fa-play", "Play");
      bigBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }

    playBtn.addEventListener("click", toggle);
    bigBtn.addEventListener("click", toggle);
    reset.addEventListener("click", doReset);
    paint();
  }

  /* ---------- 3. Sponsored content ---------- */
  function sponsored() {
    const btn = $("#adStart");
    if (!btn) return;
    const bar = $("#adBar");
    const status = $("#adStatus");
    const TOTAL = 5;
    let timer = null;

    function reset() {
      bar.style.width = "0";
      status.className = "ad-status";
      status.textContent = "Press the button to start the " + TOTAL + " second view.";
      btn.disabled = false;
      btn.innerHTML = 'View Ad <span>→</span>';
      btn.dataset.state = "idle";
    }

    btn.addEventListener("click", () => {
      if (btn.dataset.state === "done") { reset(); return; }
      let left = TOTAL;
      btn.disabled = true;
      btn.dataset.state = "running";
      status.textContent = "Viewing... " + left + "s left";
      bar.style.width = "0";
      const start = performance.now();

      timer = setInterval(() => {
        const elapsed = (performance.now() - start) / 1000;
        left = Math.max(0, Math.ceil(TOTAL - elapsed));
        bar.style.width = Math.min(100, (elapsed / TOTAL) * 100) + "%";
        status.textContent = "Viewing... " + left + "s left";
        if (elapsed >= TOTAL) {
          clearInterval(timer);
          bar.style.width = "100%";
          status.className = "ad-status done";
          status.textContent = "View complete (sample only, nothing awarded)";
          btn.disabled = false;
          btn.dataset.state = "done";
          btn.innerHTML = 'Try again <span>↻</span>';
        }
      }, 100);
    });
    reset();
  }

  /* ---------- 4. Status stories ---------- */
  function stories() {
    const wrap = $("#story");
    if (!wrap) return;
    const barsBox = $("#storyBars");
    const nameEl = $("#storyName");
    const agoEl = $("#storyAgo");
    const avatar = $("#storyAvatar");
    const slide = $("#storySlide");
    const textEl = $("#storyText");

    const items = [
      { name: "Emma", ago: "2h ago", text: "Just finished my first quiz of the day!", grad: "linear-gradient(135deg,#0B6B45,#06231A)" },
      { name: "Kwame", ago: "3h ago", text: "Anyone up for a game of draughts tonight?", grad: "linear-gradient(135deg,#16A765,#06231A)" },
      { name: "Sarah", ago: "5h ago", text: "New sample tracks are up in the music section.", grad: "linear-gradient(135deg,#0E7C5A,#0A3A2A)" }
    ];
    const STORY_MS = 3500;
    let idx = 0;
    let elapsed = 0;
    let paused = false;

    items.forEach(() => {
      const i = document.createElement("i");
      i.appendChild(document.createElement("b"));
      barsBox.appendChild(i);
    });
    const fills = [...barsBox.querySelectorAll("b")];

    function show(n) {
      idx = (n + items.length) % items.length;
      elapsed = 0;
      const it = items[idx];
      nameEl.textContent = it.name;
      agoEl.textContent = it.ago;
      avatar.textContent = it.name[0];
      textEl.textContent = it.text;
      slide.style.background = it.grad;
      fills.forEach((f, k) => { f.style.width = k < idx ? "100%" : "0"; });
    }

    $("#storyPrev").addEventListener("click", () => show(idx - 1));
    $("#storyNext").addEventListener("click", () => show(idx + 1));
    wrap.addEventListener("mouseenter", () => { paused = true; });
    wrap.addEventListener("mouseleave", () => { paused = false; });

    setInterval(() => {
      if (paused || document.hidden) return;
      elapsed += 50;
      fills[idx].style.width = Math.min(100, (elapsed / STORY_MS) * 100) + "%";
      if (elapsed >= STORY_MS) show(idx + 1);
    }, 50);

    show(0);
  }

  /* ---------- 5. Music player (visual only, no audio) ---------- */
  function music() {
    const playBtn = $("#musicPlay");
    if (!playBtn) return;
    const tracks = [
      { title: "Sample Track One", artist: "Demo Artist", len: 28 },
      { title: "Sample Track Two", artist: "Demo Artist", len: 35 },
      { title: "Sample Track Three", artist: "Demo Artist", len: 31 }
    ];
    const titleEl = $("#musicTitle");
    const artistEl = $("#musicArtist");
    const bar = $("#musicBar");
    const timeEl = $("#musicTime");
    const durEl = $("#musicDur");
    const eq = $("#musicEq");
    const list = $("#trackList");

    let idx = 0;
    let t = 0;
    let playing = false;
    let timer = null;

    tracks.forEach((tr, i) => {
      const li = document.createElement("li");
      const a = document.createElement("span");
      a.textContent = tr.title;
      const b = document.createElement("span");
      b.textContent = fmt(tr.len);
      li.append(a, b);
      li.addEventListener("click", () => { load(i); setPlaying(true); });
      list.appendChild(li);
    });

    function load(i) {
      idx = (i + tracks.length) % tracks.length;
      t = 0;
      const tr = tracks[idx];
      titleEl.textContent = tr.title;
      artistEl.textContent = tr.artist;
      durEl.textContent = fmt(tr.len);
      [...list.children].forEach((li, n) => li.classList.toggle("active", n === idx));
      paint();
    }
    function paint() {
      bar.style.width = (t / tracks[idx].len) * 100 + "%";
      timeEl.textContent = fmt(t);
    }
    function setPlaying(on) {
      playing = on;
      eq.classList.toggle("playing", on);
      playBtn.innerHTML = '<i class="fa-solid ' + (on ? "fa-pause" : "fa-play") + '"></i>';
      playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
      clearInterval(timer);
      if (on) {
        timer = setInterval(() => {
          t += 0.25;
          if (t >= tracks[idx].len) { load(idx + 1); return; }
          paint();
        }, 250);
      }
    }

    playBtn.addEventListener("click", () => setPlaying(!playing));
    $("#musicPrev").addEventListener("click", () => { load(idx - 1); });
    $("#musicNext").addEventListener("click", () => { load(idx + 1); });
    load(0);
  }

  /* ---------- 6. Spin wheel (demo points only) ---------- */
  function spin() {
    const canvas = $("#wheel");
    if (!canvas) return;
    const btn = $("#spinBtn");
    const result = $("#spinResult");
    const labels = ["10 pts", "25 pts", "5 pts", "50 pts", "15 pts", "100 pts", "20 pts", "Try again"];
    const colors = ["#F23A2E", "#FFC93C", "#F23A2E", "#FFC93C", "#F23A2E", "#FFC93C", "#F23A2E", "#FFC93C"];
    const SIZE = 320;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const seg = (Math.PI * 2) / labels.length;
    let angle = 0;
    let spinning = false;

    function draw() {
      const c = SIZE / 2;
      const r = c - 6;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(angle);

      labels.forEach((label, i) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, i * seg, (i + 1) * seg);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.rotate(i * seg + seg / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = i % 2 ? "#5A2A00" : "#fff";
        ctx.font = "900 15px Montserrat, Arial, sans-serif";
        ctx.fillText(label, r - 16, 5);
        ctx.restore();
      });
      ctx.restore();

      // gold rim
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.lineWidth = 7;
      ctx.strokeStyle = "#FFB52C";
      ctx.stroke();

      // hub
      ctx.beginPath();
      ctx.arc(c, c, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD447";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#FF9F1C";
      ctx.stroke();
      ctx.fillStyle = "#5A2A00";
      ctx.font = "900 13px Montserrat, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SPIN", c, c + 5);
    }

    function currentIndex() {
      // The pointer sits at the top (-90 degrees). Find which segment is under it.
      let a = (-Math.PI / 2 - angle) % (Math.PI * 2);
      if (a < 0) a += Math.PI * 2;
      return Math.floor(a / seg);
    }

    btn.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      btn.disabled = true;
      result.textContent = "Spinning...";

      const startAngle = angle;
      const total = Math.PI * 2 * (5 + Math.random() * 3) + Math.random() * Math.PI * 2;
      const dur = 4500;
      const t0 = performance.now();

      (function frame(now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        angle = startAngle + total * eased;
        draw();
        if (p < 1) {
          requestAnimationFrame(frame);
        } else {
          spinning = false;
          btn.disabled = false;
          const label = labels[currentIndex()];
          result.textContent = label === "Try again"
            ? "Demo result: try again. Nothing is awarded."
            : "Demo result: " + label + ". Sample points only, nothing awarded.";
        }
      })(t0);
    });

    draw();
  }

  /* ---------- 7. Daily check-in (saved in this browser only) ---------- */
  function checkin() {
    const daysBox = $("#days");
    if (!daysBox) return;
    const numEl = $("#streakNum");
    const status = $("#checkinStatus");
    const btn = $("#checkinBtn");
    const KEY = "earnly_demo_checkin";

    function dayKey(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || { streak: 0, last: "" }; }
      catch (e) { return { streak: 0, last: "" }; }
    }
    function save(s) {
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ }
    }

    let state = load();
    const today = dayKey(new Date());
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = dayKey(y);

    // A missed day resets the streak
    if (state.last && state.last !== today && state.last !== yesterday) {
      state = { streak: 0, last: "" };
      save(state);
    }

    for (let i = 1; i <= 7; i++) {
      const d = document.createElement("div");
      d.className = "day";
      d.textContent = "D" + i;
      daysBox.appendChild(d);
    }

    function paint() {
      numEl.textContent = state.streak;
      const filled = state.streak === 0 ? 0 : ((state.streak - 1) % 7) + 1;
      [...daysBox.children].forEach((d, i) => {
        const done = i < filled;
        d.classList.toggle("done", done);
        d.innerHTML = done ? '<i class="fa-solid fa-check"></i>' : "D" + (i + 1);
      });
      const checked = state.last === today;
      btn.disabled = checked;
      status.textContent = checked
        ? "You have checked in today. Come back tomorrow to keep your streak."
        : "You have not checked in today.";
    }

    btn.addEventListener("click", () => {
      state = { streak: state.streak + 1, last: today };
      save(state);
      paint();
    });
    $("#checkinReset").addEventListener("click", () => {
      state = { streak: 0, last: "" };
      save(state);
      paint();
    });
    paint();
  }

  /* ---------- 8. Chess and draughts (scripted sample games) ---------- */
  function games() {
    const boardEl = $("#board");
    if (!boardEl) return;
    const statusEl = $("#gameStatus");
    const movesEl = $("#gameMoves");
    const playBtn = $("#gamePlay");
    const restartBtn = $("#gameRestart");
    const tabs = document.querySelectorAll(".tab");

    const PIECE_ICON = { p: "fa-chess-pawn", n: "fa-chess-knight", b: "fa-chess-bishop", r: "fa-chess-rook", q: "fa-chess-queen", k: "fa-chess-king" };
    const FILES = "abcdefgh";

    // [row, col] from algebraic square, where row 0 is rank 8
    const sq = a => [8 - Number(a[1]), FILES.indexOf(a[0])];
    const name = (r, c) => FILES[c] + (8 - r);

    function emptyBoard() { return Array.from({ length: 8 }, () => Array(8).fill(null)); }

    const GAMES = {
      chess: {
        title: "Sample chess game",
        end: "Checkmate. White wins this sample game.",
        setup() {
          const b = emptyBoard();
          "rnbqkbnr".split("").forEach((t, c) => { b[0][c] = { c: "b", t }; b[7][c] = { c: "w", t }; });
          for (let c = 0; c < 8; c++) { b[1][c] = { c: "b", t: "p" }; b[6][c] = { c: "w", t: "p" }; }
          return b;
        },
        // Scholar's mate
        moves: [
          { from: sq("e2"), to: sq("e4"), text: "1. e4" },
          { from: sq("e7"), to: sq("e5"), text: "e5" },
          { from: sq("f1"), to: sq("c4"), text: "2. Bc4" },
          { from: sq("b8"), to: sq("c6"), text: "Nc6" },
          { from: sq("d1"), to: sq("h5"), text: "3. Qh5" },
          { from: sq("g8"), to: sq("f6"), text: "Nf6" },
          { from: sq("h5"), to: sq("f7"), text: "4. Qxf7#" }
        ],
        piece(p) {
          const i = document.createElement("i");
          i.className = "fa-solid " + PIECE_ICON[p.t] + " piece " + p.c;
          return i;
        }
      },
      draughts: {
        title: "Sample draughts game",
        end: "Sample game finished.",
        setup() {
          const b = emptyBoard();
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if ((r + c) % 2 === 1) {
                if (r < 3) b[r][c] = { c: "b", t: "m" };
                if (r > 4) b[r][c] = { c: "w", t: "m" };
              }
            }
          }
          return b;
        },
        moves: [
          { from: [5, 2], to: [4, 3] },
          { from: [2, 5], to: [3, 4] },
          { from: [4, 3], to: [2, 5], cap: [3, 4] },
          { from: [1, 6], to: [3, 4], cap: [2, 5] },
          { from: [5, 4], to: [4, 5] },
          { from: [3, 4], to: [4, 3] }
        ],
        piece(p) {
          const s = document.createElement("span");
          s.className = "checker " + p.c;
          return s;
        }
      }
    };

    let key = "chess";
    let board = null;
    let step = 0;
    let timer = null;
    let playing = true;

    function label(m) {
      return m.text || (name(m.from[0], m.from[1]) + (m.cap ? "x" : "-") + name(m.to[0], m.to[1]));
    }

    function render(hl) {
      const game = GAMES[key];
      boardEl.innerHTML = "";
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const cell = document.createElement("div");
          cell.className = "sq " + ((r + c) % 2 === 0 ? "light" : "dark");
          if (hl && ((hl.from[0] === r && hl.from[1] === c) || (hl.to[0] === r && hl.to[1] === c))) {
            cell.classList.add("hl");
          }
          if (board[r][c]) cell.appendChild(game.piece(board[r][c]));
          boardEl.appendChild(cell);
        }
      }
    }

    function renderMoves() {
      const game = GAMES[key];
      movesEl.innerHTML = "";
      game.moves.forEach((m, i) => {
        const s = document.createElement("span");
        s.textContent = label(m);
        if (i === step - 1) s.classList.add("current");
        if (i < step) movesEl.appendChild(s);
      });
    }

    function applyMove(m) {
      const piece = board[m.from[0]][m.from[1]];
      board[m.from[0]][m.from[1]] = null;
      if (m.cap) board[m.cap[0]][m.cap[1]] = null;
      board[m.to[0]][m.to[1]] = piece;
    }

    function setPlayLabel() {
      playBtn.innerHTML = playing
        ? '<i class="fa-solid fa-pause"></i> Pause'
        : '<i class="fa-solid fa-play"></i> Play';
    }

    function tick() {
      const game = GAMES[key];
      if (step >= game.moves.length) {
        statusEl.textContent = game.end;
        clearInterval(timer);
        playing = false;
        setPlayLabel();
        return;
      }
      const m = game.moves[step];
      applyMove(m);
      step++;
      render(m);
      renderMoves();
      statusEl.textContent = game.title + ": move " + step + " of " + game.moves.length;
    }

    function start() {
      clearInterval(timer);
      board = GAMES[key].setup();
      step = 0;
      render(null);
      renderMoves();
      statusEl.textContent = GAMES[key].title;
      playing = true;
      setPlayLabel();
      timer = setInterval(tick, 1500);
    }

    tabs.forEach(t => t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.toggle("active", x === t));
      key = t.dataset.game;
      start();
    }));

    playBtn.addEventListener("click", () => {
      const game = GAMES[key];
      if (step >= game.moves.length) { start(); return; }
      playing = !playing;
      setPlayLabel();
      clearInterval(timer);
      if (playing) timer = setInterval(tick, 1500);
    });
    restartBtn.addEventListener("click", start);

    start();
  }
})();
