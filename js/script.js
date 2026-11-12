/* ==========================================================
   MegaOnlineChat - core script
   Edit the CONFIG block below to customise the whole site.
   ========================================================== */
const CONFIG = {
  brand: "MegaOnlineChat",
  // Where every "Join now / Register / Get started" button goes
  registerUrl: "https://pexerearn.com/register?ref=topmentor",
  // Contact email used by "Contact Support" / "Contact Us"
  email: "hello@example.com",
  // WhatsApp number in international format, digits only (e.g. 256700000000).
  // Leave empty to hide the floating WhatsApp button.
  whatsappNumber: "",
  whatsappMessage: "Hello, I have a question about MegaOnlineChat.",
  // Link to your WhatsApp channel. Leave empty to hide the "Join WhatsApp Channel" button.
  // The floating WhatsApp button also uses this link when whatsappNumber is empty.
  whatsappChannel: "https://whatsapp.com/channel/0029VbDgoxPKWEKo1DvRWV2U",
  // Social links shown in the footer. Remove any you do not use.
  social: [
    { icon: "fa-brands fa-facebook-f", label: "Facebook", url: "#" },
    { icon: "fa-brands fa-tiktok", label: "TikTok", url: "#" },
    { icon: "fa-brands fa-instagram", label: "Instagram", url: "#" },
    { icon: "fa-brands fa-x-twitter", label: "X", url: "#" }
  ],
  // Words that rotate under "Online Activities" in the hero
  heroWords: ["Video tasks", "Trivia quizzes", "Chess & draughts", "Daily check-ins", "Music", "Wheel spin"],

  // ----- MONEY + NUMBERS: PLACEHOLDERS -----
  // Anything left as "" shows as "---" on the page. Fill in real figures only.
  currency: "UGX",
  payoutMethod: "Mobile Money",
  // Hero pill number, e.g. 726  (text beside it is set in index.html)
  onlineCount: "",
  money: {
    daily: "",         // hero line, e.g. "30,000-150,000+"
    welcomeBonus: "",  // e.g. "5,000"
    chat: "",          // reward per chat
    video: "",         // reward per video
    ad: "",            // reward per ad
    trivia: "",        // reward per correct answer
    status: "",        // reward per status view
    music: "",         // reward per song
    spin: "",          // top wheel prize
    login: "",         // daily login bonus
    game: ""           // reward per win
  },
  // Tasks available per day, shown at the bottom of each card
  limits: { ad: "", trivia: "", status: "", music: "", spin: "" },

  // Real member reviews, e.g. { name: "Aisha N.", country: "Uganda", flag: "🇺🇬", text: "...", stars: 5 }
  // While this is empty, the community section shows marked placeholder cards.
  testimonials: [],

  // Countries where MegaOnlineChat is actually available. Edit to match where you operate.
  // status: "ACTIVE" or "EXPANDING"
  regions: [
    { name: "East Africa", status: "ACTIVE", countries: [["UG", "Uganda"], ["KE", "Kenya"], ["TZ", "Tanzania"], ["RW", "Rwanda"], ["BI", "Burundi"]] },
    { name: "West Africa", status: "ACTIVE", countries: [["NG", "Nigeria"], ["GH", "Ghana"], ["SN", "Senegal"], ["ML", "Mali"], ["BF", "Burkina Faso"]] },
    { name: "Central Africa", status: "ACTIVE", countries: [["CM", "Cameroon"], ["CD", "DR Congo"], ["CF", "Central African Republic"], ["GQ", "Equatorial Guinea"], ["GA", "Gabon"]] },
    { name: "Southern Africa", status: "ACTIVE", countries: [["ZA", "South Africa"], ["ZM", "Zambia"], ["BW", "Botswana"], ["MW", "Malawi"], ["NA", "Namibia"]] },
    { name: "More Across Africa", status: "EXPANDING", countries: [["MZ", "Mozambique"], ["ZW", "Zimbabwe"], ["SS", "South Sudan"], ["SL", "Sierra Leone"], ["LR", "Liberia"]] }
  ]
};

/* Sample quiz questions (demo only, no rewards) */
const QUIZ = [
  { q: "What is the capital city of Uganda?", options: ["Nairobi", "Kampala", "Kigali", "Dodoma"], answer: 1 },
  { q: "Which is the longest river in Africa?", options: ["Congo", "Niger", "Nile", "Zambezi"], answer: 2 },
  { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Mercury"], answer: 1 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 }
];


document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initRotator();
  initMoney();
  initCommunity();
  initNetwork();
  initSocials();
  initFaq();
  initQuiz();
  initFabSide();
});

/* Keep the WhatsApp button on the opposite side to the Chatway bubble */
function initFabSide() {
  const fab = document.querySelector(".whatsapp-fab");
  if (!fab) return;
  const place = () => {
    const chat = document.getElementById("chatway_widget_trigger");
    if (!chat) return false;
    const r = chat.getBoundingClientRect();
    if (!r.width) return false;
    fab.classList.toggle("fab-right", r.left + r.width / 2 < window.innerWidth / 2);
    return true;
  };
  let tries = 0;
  const timer = setInterval(() => { if (place() || ++tries > 30) clearInterval(timer); }, 500);
  window.addEventListener("resize", place);
}

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

/* ---------- Config -> DOM ---------- */
function applyConfig() {
  document.querySelectorAll("[data-cta]").forEach(a => { a.href = CONFIG.registerUrl; });
  document.querySelectorAll("[data-email]").forEach(a => { a.href = "mailto:" + CONFIG.email; });

  const waUrl = CONFIG.whatsappNumber
    ? "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(CONFIG.whatsappMessage)
    : CONFIG.whatsappChannel;
  if (waUrl) {
    const url = waUrl;
    document.querySelectorAll("[data-whatsapp]").forEach(a => {
      if (!CONFIG.whatsappNumber) a.setAttribute("aria-label", "Join our WhatsApp Channel");
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.hidden = false;
    });
  }
  const channelWrap = document.getElementById("channelWrap");
  if (CONFIG.whatsappChannel && channelWrap) {
    document.getElementById("channelBtn").href = CONFIG.whatsappChannel;
    channelWrap.hidden = false;
  }

  document.querySelectorAll("[data-brand]").forEach(s => { s.textContent = CONFIG.brand; });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- Hero word rotator ---------- */
function initRotator() {
  const r = document.getElementById("rotator");
  if (!r || !CONFIG.heroWords.length) return;
  r.textContent = CONFIG.heroWords[0];
  if (CONFIG.heroWords.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let i = 0;
  setInterval(() => {
    r.classList.add("swap");
    setTimeout(() => {
      i = (i + 1) % CONFIG.heroWords.length;
      r.textContent = CONFIG.heroWords[i];
      r.classList.remove("swap");
    }, 300);
  }, 2600);
}

/* ---------- Money + number placeholders ---------- */
function initMoney() {
  const ph = "---";
  const setVal = (node, val, withCurrency) => {
    const has = val !== "" && val != null;
    node.textContent = (withCurrency ? CONFIG.currency + " " : "") + (has ? val : ph);
    node.classList.toggle("ph", !has);
  };
  document.querySelectorAll("[data-money]").forEach(n => setVal(n, CONFIG.money[n.dataset.money], true));
  document.querySelectorAll("[data-limit]").forEach(n => setVal(n, CONFIG.limits[n.dataset.limit], false));
  const count = document.getElementById("onlineCount");
  if (count) setVal(count, CONFIG.onlineCount, false);
  const pm = document.getElementById("payoutMethod");
  if (pm) pm.textContent = CONFIG.payoutMethod;
}

/* ---------- Community reviews (continuous slider) ---------- */
function initCommunity() {
  const track = document.getElementById("communityTrack");
  if (!track) return;

  const real = CONFIG.testimonials.length > 0;
  const items = real ? CONFIG.testimonials : [
    { name: "Member Name", country: "Country", flag: "🌍", text: "Placeholder. Add a real review from one of your members in CONFIG.testimonials (js/script.js).", stars: 5 },
    { name: "Member Name", country: "Country", flag: "🌍", text: "Placeholder. Each review shows a name, country, star rating and a short quote.", stars: 5 },
    { name: "Member Name", country: "Country", flag: "🌍", text: "Placeholder. Once you add real reviews, these cards are replaced automatically.", stars: 5 },
    { name: "Member Name", country: "Country", flag: "🌍", text: "Placeholder. Keep reviews short, one or two sentences reads best.", stars: 5 }
  ];
  const tones = ["p-green", "p-gold", "p-purple", "p-blue", "p-coral", "p-teal"];

  const card = (t, i) => {
    const c = el("article", "community-card" + (real ? "" : " placeholder"));
    const top = el("div", "t-top");
    const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    top.appendChild(el("div", "t-initial " + tones[i % tones.length], initials));
    const info = el("div", "t-info");
    info.append(el("strong", null, t.name), el("span", null, (t.flag ? t.flag + " " : "") + t.country));
    top.appendChild(info);
    const stars = Math.max(0, Math.min(5, t.stars || 5));
    top.appendChild(el("div", "t-stars", "★".repeat(stars) + "☆".repeat(5 - stars)));
    const bottom = el("div", "t-bottom");
    bottom.append(el("span", null, "Community Member"), el("span", "t-tag", real ? "MEMBER" : "PLACEHOLDER"));
    c.append(top, el("p", "t-text", "“" + t.text + "”"), bottom);
    return c;
  };

  // two copies so the CSS loop is seamless
  for (let k = 0; k < 2; k++) {
    items.forEach((t, i) => {
      const c = card(t, i);
      if (k) c.setAttribute("aria-hidden", "true");
      track.appendChild(c);
    });
  }
  track.style.animationDuration = items.length * 8 + "s";
}

/* ---------- Network regions ---------- */
function initNetwork() {
  const list = document.getElementById("regionList");
  const total = document.getElementById("countryTotal");
  if (!list) return;
  let count = 0;

  CONFIG.regions.forEach(r => {
    count += r.countries.length;
    const box = el("div", "region" + (r.status === "EXPANDING" ? " expanding" : ""));
    const head = el("div", "region-head");
    const title = el("div", "region-title");
    title.appendChild(el("div", "region-icon", "✦"));
    const t = el("div");
    t.append(el("h3", null, r.name), el("span", null, r.status === "EXPANDING" ? "Growing Network" : r.countries.length + " Countries"));
    title.appendChild(t);
    const status = el("div", "region-status");
    status.append(el("span", "pulse"), document.createTextNode(r.status));
    head.append(title, status);

    const pills = el("div", "country-pills");
    r.countries.forEach(([code, name]) => {
      const p = el("div", "country-pill");
      p.append(el("span", null, code), el("strong", null, name), el("i"));
      pills.appendChild(p);
    });
    box.append(head, pills);
    list.appendChild(box);
  });
  if (total) total.textContent = count + (count >= 10 ? "+" : "");
}

/* ---------- Footer socials ---------- */
function initSocials() {
  const wrap = document.getElementById("socials");
  if (!wrap) return;
  CONFIG.social.forEach(s => {
    const a = el("a");
    a.href = s.url;
    a.setAttribute("aria-label", s.label);
    if (s.url && s.url !== "#") { a.target = "_blank"; a.rel = "noopener"; }
    a.appendChild(el("i", s.icon));
    wrap.appendChild(a);
  });
}

/* ---------- FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-q").forEach(other => {
        other.setAttribute("aria-expanded", "false");
        other.nextElementSibling.style.maxHeight = null;
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        btn.nextElementSibling.style.maxHeight = btn.nextElementSibling.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Sample quiz (demo, no rewards) ---------- */
function initQuiz() {
  const box = document.getElementById("quiz");
  if (!box) return;

  const count = document.getElementById("quizCount");
  const bar = document.getElementById("quizBar");
  const question = document.getElementById("quizQuestion");
  const options = document.getElementById("quizOptions");
  const feedback = document.getElementById("quizFeedback");
  const next = document.getElementById("quizNext");
  const original = box.innerHTML;

  let index = 0;
  let score = 0;

  function bind() {
    // re-query elements after a restart rebuilds the markup
    return {
      count: document.getElementById("quizCount"),
      bar: document.getElementById("quizBar"),
      question: document.getElementById("quizQuestion"),
      options: document.getElementById("quizOptions"),
      feedback: document.getElementById("quizFeedback"),
      next: document.getElementById("quizNext")
    };
  }
  let ui = { count, bar, question, options, feedback, next };

  function render() {
    const item = QUIZ[index];
    ui.count.textContent = "Question " + (index + 1) + " of " + QUIZ.length;
    ui.bar.style.width = (index / QUIZ.length) * 100 + "%";
    ui.question.textContent = item.q;
    ui.feedback.textContent = "";
    ui.feedback.style.color = "";
    ui.next.hidden = true;
    ui.options.innerHTML = "";

    item.options.forEach((text, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = text;
      b.addEventListener("click", () => choose(i));
      ui.options.appendChild(b);
    });
  }

  function choose(i) {
    const item = QUIZ[index];
    const buttons = ui.options.querySelectorAll(".option");
    buttons.forEach((b, n) => {
      b.disabled = true;
      if (n === item.answer) b.classList.add("correct");
    });

    if (i === item.answer) {
      score++;
      ui.feedback.textContent = "Correct!";
      ui.feedback.style.color = "var(--green)";
    } else {
      buttons[i].classList.add("wrong");
      ui.feedback.textContent = "Not quite. The correct answer is highlighted.";
      ui.feedback.style.color = "var(--red)";
    }

    ui.bar.style.width = ((index + 1) / QUIZ.length) * 100 + "%";
    ui.next.textContent = index === QUIZ.length - 1 ? "See result" : "Next question";
    ui.next.hidden = false;
    ui.next.focus({ preventScroll: true });
  }

  function onNext() {
    if (index === QUIZ.length - 1) { finish(); return; }
    index++;
    render();
  }

  function finish() {
    box.innerHTML =
      '<div class="quiz-end">' +
      '<span class="badge">Demo finished</span>' +
      '<h3 style="margin-top:14px">You got ' + score + " of " + QUIZ.length + " correct</h3>" +
      '<p class="muted">This was only a sample. Nothing was awarded.</p>' +
      '<button class="btn btn-outline" id="quizRestart">Try again</button>' +
      "</div>";
    document.getElementById("quizRestart").addEventListener("click", () => {
      box.innerHTML = original;
      ui = bind();
      ui.next.addEventListener("click", onNext);
      index = 0;
      score = 0;
      render();
    });
  }

  next.addEventListener("click", onNext);
  render();
}
