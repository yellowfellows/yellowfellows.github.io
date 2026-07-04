/* =========================================================
   Loaded on every page. Functions guard themselves so only
   the relevant page's markup gets touched.

   HOW TO ADD REAL PHOTOS (no code changes needed):
   1. Field background:  images/field.jpg
   2. Player cutouts:    images/players/<slug>.png
      <slug> = player's name, lowercase, spaces -> hyphens
      e.g. "Hannah Ma" -> images/players/hannah-ma.png
   Until those files exist, a grass-field fallback and a
   ghost silhouette are shown automatically.
   ========================================================= */

const TEAMS = {
  YF: {
    name: "Yellow Fellows",
    accent: "#FFC94A",
    estDate: "May 2024",
    description: "Our core team, currently playing Monday nights at NSU."
  },
  YS: {
    name: "The Yellowship",
    accent: "#ffbf1f",
    estDate: "Sep 2024",
    description: "Our Wednesday Hills fun & frothers team."
  },
  PPYP: {
    name: "Penno Pineapple Yellow Pen",
    accent: "#f9ff4b",
    estDate: "Oct 2025",
    description: "Our late timeslot competitive team, bringing together players from Pennultimate."
  },
};

const PLAYER_INFO = {
  "Brian Wong": {
    nickname: "Michael Reeves",
    quote: "Well, well, well.",
    funfact: "When he's attacking the disc, guard him hard. When he's attacking your food, guard your food.",
    started: "2023"
  },

  "Richard Lo": {
    nickname: "Gout Gout",
    quote: "Go long.",
    funfact: "His Valorant and handler callouts are exactly the same.",
    started: "2020"
  },

  "Dharmesh Desai": {
    nickname: "Chief",
    quote: "You f*** ch***r",
    funfact: "It's a bird! It's a plane! It's a hammer from Dharmesh!",
    started: "2021"
  },

  "Michael Nyunt": {
    nickname: "DDS Goon God",
    quote: "Big stepper-r-r-",
    funfact: "There is nothing more relieving to a handler than hearing Michael clap his hands.",
    started: "2019"
  }
};

const PLAYERS = [
  ["Michael Nyunt","M",["YF"]],
  ["Dharmesh Desai","M",["YF","PPYP"]],
  ["Richard Lo","M",["YF"]],
  ["Brian Wong","M",["YF","PPYP","YS"]],
  ["Hannah Ma","F",["YF"]],
  ["Felicity Chu","F",["YF","PPYP"]],
  ["Natalie Hwang","F",["YF","PPYP"]],
  ["Anna Hou","F",["YF"]],
  ["Margaux Choo","F",["YF","PPYP","YS"]],
  ["Caleb Cheung","M",["YF","PPYP"]],
  ["Michael Lau","M",["YF","PPYP","YS"]],
  ["Andrew Chen","M",["YF","PPYP","YS"]],
  ["Angle Line","F",["PPYP","YS"]],
  ["Germaine Loke","F",["PPYP"]],
  ["Jess Zhang","F",["PPYP"]],
  ["Damien Teh","M",["PPYP"]],
  ["Ethan Diu","M",["PPYP"]],
  ["Joel Anderson","M",["PPYP"]],
  ["Julian Kok","M",["PPYP"]],
  ["Karlon Tse","M",["PPYP"]],
  ["Jessie Wong","F",["YS"]],
  ["Melva Tang","F",["YS"]],
  ["Matty Juan","M",["YS"]],
  ["Wilson Kwong","M",["YS"]],
  ["Tyrone Lau","M",["YS"]],
  ["Rex Mercado","M",["YS"]]
].map(([name, gender, teams]) => ({
  name,
  gender,
  teams,
  nickname: PLAYER_INFO[name]?.nickname ?? "",
  quote: PLAYER_INFO[name]?.quote ?? "",
  funfact: PLAYER_INFO[name]?.funfact ?? "",
  started: PLAYER_INFO[name]?.started ?? ""
}));

/* ---------- TIMELINE DATA (about.html only) ---------- */
// To add a new milestone: push a new object here and drop the matching
// image at images/timeline/<img>.png (e.g. img:"3" -> images/timeline/3.png).
// No image yet? Leave it -- the card just renders without a photo.
const TIMELINE = [
  {
    img: "1",
    date: "May 2024",
    caption: "Yellow Fellows founded",
    description: "A reunion of Wushu Warriors and friends."
  },
  {
    img: "2",
    date: "Sep 2024",
    caption: "The Yellowship has its first season",
    description: "An extra night of frisbee once we found out half our team lived in the area."
  },
  {
    img: "3",
    date: "May 2025",
    caption: "After a game at George Kendall!",
    description: "Smile :)"
  },
  {
    img: "5",
    date: "Oct 2025",
    caption: "Roadtrip",
    description: "A visit to the Blue Mountains!"
  },
  {
    img: "4",
    date: "Oct 2025",
    caption: "Penno Pineapple Yellow Pen",
    description: "Merger and acquisition with Pennultimate to form a brand new team."
  }
];

function renderTimeline(){
  const track = document.getElementById("timelineTrack");
  if(!track) return;

  track.innerHTML = TIMELINE.map(item => `
    <div class="timeline-entry">
      <div class="timeline-photo">
        <img
          src="images/timeline/${item.img}.png"
          alt="${item.caption}"
          onerror="this.parentElement.classList.add('photo-fallback'); this.remove();">
      </div>

      <div class="timeline-dot"></div>

      <div class="timeline-card">
        ${item.date ? `<div class="timeline-date">${item.date}</div>` : ""}
        <h3 class="timeline-caption">${item.caption}</h3>
        ${item.description ? `<p class="timeline-desc">${item.description}</p>` : ""}
      </div>
    </div>
  `).join("");

  // Reveal-on-scroll animation
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const entries = track.querySelectorAll(".timeline-entry");

  if(prefersReduced || !("IntersectionObserver" in window)){
    entries.forEach(el => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver((observed) => {
    observed.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px"
  });

  entries.forEach(el => io.observe(el));
}

const AVATAR_PALETTE = ["#FFC94A","#A8D93C","#FF8C42","#FF4FA3","#7FD8D0","#FFD9EC"];

function slugify(name){
  return name.toLowerCase().trim().replace(/[^a-z\s-]/g,"").replace(/\s+/g,"-");
}
function initials(name){
  return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
}
function colorFor(name){
  let h = 0;
  for(const c of name) h = c.charCodeAt(0) + ((h<<5)-h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}
function rosterFor(team){
  if(team == null) return PLAYERS;
  return PLAYERS.filter(p => p.teams.includes(team));
}

/* ---------- NAV / HAMBURGER (all pages) ---------- */
function setupNav(){
  const btn = document.getElementById("brandLogo");
  const nav = document.getElementById("siteNav");
  if(!btn || !nav) return;

  const MOBILE_BREAKPOINT = 760;

  const closeNav = () => {
    nav.classList.remove("open");
    btn.classList.remove("active");
    btn.setAttribute("aria-expanded", false);
  };

  btn.addEventListener("click", (e)=>{
    // On desktop the logo is just a normal home link. On mobile it
    // doubles as the menu toggle, so we intercept the click there.
    if(window.innerWidth > MOBILE_BREAKPOINT) return;

    e.preventDefault();
    const open = nav.classList.toggle("open");
    btn.classList.toggle("active", open);
    btn.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", closeNav);
  });

  // Crossing the mobile breakpoint (resize/rotate) shouldn't leave a
  // stale open dropdown or a "toggled" logo state behind.
  let resizeTimer = null;
  window.addEventListener("resize", ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      if(window.innerWidth > MOBILE_BREAKPOINT) closeNav();
    }, 150);
  });
}

/* ---------- BACKGROUND DISCS (all pages) ---------- */
function scatterDiscs(){
  const bg = document.querySelector(".disc-bg");
  if(!bg) return;
  for(let i=0;i<14;i++){
    const s = document.createElement("span");
    s.textContent = "";
    s.style.top = Math.random()*100 + "%";
    s.style.left = Math.random()*100 + "%";
    s.style.transform = `rotate(${Math.random()*360}deg) scale(${0.6+Math.random()*1.2})`;
    bg.appendChild(s);
  }
}

/* ---------- ROSTER STAGE (index.html only) ---------- */
let activeTeam = "YF";
const activeIndex = {
  ALL: 0,
  YF: 0,
  PPYP: 0,
  YS: 0
};

function renderTabs() {
  const nav = document.querySelector(".tabs");
  if (!nav) return;

  nav.innerHTML = "";

  Object.entries(TEAMS).forEach(([key, t]) => {

    const count = rosterFor(key).length;
    const selected = key === activeTeam;

    const btn = document.createElement("button");
    btn.className = "tab-btn" + (selected ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", selected);

    btn.innerHTML = `
      ${t.name}
      <span class="count">${count} players</span>
    `;

    btn.style.background = selected ? t.accent : "";

    btn.addEventListener("click", () => {

      // Clicking the selected team deselects it
      if (activeTeam === key) {
        activeTeam = null;
      } else {
        activeTeam = key;
      }

      renderRosterAll();
    });

    nav.appendChild(btn);

  });
}

function renderMeta(){

    const est = document.getElementById("teamEst");
    const desc = document.getElementById("teamDesc");

    if(!est || !desc) return;

    if(activeTeam === null){

        est.textContent = "Est. 2024";
        est.className = "team-est";

        desc.textContent =
            "See our entire roster below.";

        return;
    }

    const t = TEAMS[activeTeam];

    est.textContent = `Est. ${t.estDate}`;
    est.className = "team-est";

    desc.textContent = t.description;
}

function ghostSVG(name){
  return `
    <div class="ghost">
      <svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="3" stroke-dasharray="6 6">
          <circle cx="50" cy="34" r="22"/>
          <path d="M50 56 L50 140"/>
          <path d="M50 75 L18 120"/>
          <path d="M50 75 L82 120"/>
          <path d="M50 140 L28 216"/>
          <path d="M50 140 L72 216"/>
        </g>
        <text x="50" y="40" text-anchor="middle" class="ghost-initials">${initials(name)}</text>
      </svg>
    </div>`;
}

function displayName(player) {
  if (!player.nickname) return player.name;

  const parts = player.name.split(" ");
  return `${parts[0]} "${player.nickname}" ${parts.slice(1).join(" ")}`;
}

function renderStage(fade){
  const figure = document.getElementById("playerFigure");
  const card = document.getElementById("infoCard");
  if(!figure || !card) return;

  const roster = rosterFor(activeTeam);
  const indexKey = activeTeam ?? "ALL";
  const idx = activeIndex[indexKey];
  const p = roster[idx];

  const doUpdate = () => {
    const slug = slugify(p.name);

    const video = document.getElementById("stageVideo");

    if (video) {
      video.src = `videos/players/${slug}.mp4`;

      video.onloadeddata = () => {
        video.style.display = "block";
        video.play();
      };

      video.onerror = () => {
        video.style.display = "none";
      };

      video.load();
    }

    figure.innerHTML = `<img src="images/players/${slug}.png" alt="${p.name}"
      onerror="this.parentElement.innerHTML = document.getElementById('ghost-tpl-${slug}')?.innerHTML || '';">`;
    const tpl = document.createElement("template");
    tpl.id = `ghost-tpl-${slug}`;
    tpl.innerHTML = ghostSVG(p.name);
    figure.appendChild(tpl);

    document.getElementById("badgeRow").innerHTML = p.teams
      .map(t => `<span class="team-chip chip-${t}" title="${TEAMS[t].name}">${t}</span>`)
      .join("");

    document.getElementById("stageName").textContent = displayName(p);

    const nick = document.getElementById("stageNickname");
    nick.textContent = p.quote ? `“${p.quote}”` : "Quote coming soon…";
    nick.className = "nickname" + (p.quote ? "" : " empty");

    const ff = document.getElementById("stageFunfact");
    ff.textContent = p.funfact || "fun fact coming soon…";
    ff.className = "funfact" + (p.funfact ? "" : " empty");

    const started = document.getElementById("stageStarted");
    started.textContent = p.started || "year TBD";
    started.className = "p-value" + (p.started ? "" : " empty");

    figure.classList.remove("fade");
    card.classList.remove("fade");
  };

  if(fade){
    figure.classList.add("fade");
    card.classList.add("fade");
    setTimeout(doUpdate, 220);
  } else {
    doUpdate();
  }
}

// Thumbs are positioned with `left`/`top` as percentages, and .thumb has no
// positioned ancestor between it and .stage-wrap (see #thumbRow in
// index.html) -- so a percentage here is *always* relative to stage-wrap's
// own box. No window measurements, no manual offset fudging.
const thumbPositions = new Map();

const THUMB_SIZE   = 86;              // desktop default -- must match .thumb width/height in CSS
const THUMB_GAP    = 30;              // desktop default -- minimum breathing room between neighbouring thumbs
const FRAME_INSET  = THUMB_SIZE / 6; // negative = the travel path sits outside stage-wrap's
                                       // edges, so each thumb straddles the border half in/half out

// Responsive thumb sizing -- on mobile the stage-wrap stacks into a much
// narrower/taller box, so a fixed 86px thumb + 30px gap can't fit 26+
// players around the perimeter without overlapping. These breakpoints
// mirror the .thumb width/height media queries in styles.css so the JS
// layout math and the CSS visuals always agree.
function thumbSize(){
  const w = window.innerWidth;
  if(w <= 600) return 48;
  if(w <= 760) return 62;
  return THUMB_SIZE;
}
function thumbGap(){
  const w = window.innerWidth;
  if(w <= 600) return 10;
  if(w <= 760) return 16;
  return THUMB_GAP;
}
function frameInset(){
  return thumbSize() / 6;
}

// Walks clockwise from the top-left corner and returns the {x,y} point
// (relative to the frame's own top-left) that sits `dist` px along the
// perimeter of a rw x rh rectangle.
function pointOnFrame(dist, rw, rh){
  const perimeter = 2 * (rw + rh);
  dist = ((dist % perimeter) + perimeter) % perimeter;

  if(dist <= rw)  return { x: dist, y: 0, edge: "top" };
  dist -= rw;
  if(dist <= rh)  return { x: rw, y: dist, edge: "right" };
  dist -= rh;
  if(dist <= rw)  return { x: rw - dist, y: rh, edge: "bottom" };
  dist -= rw;
  return { x: 0, y: rh - dist, edge: "left" };
}

// Places any not-yet-positioned slugs around a rectangle inset (or, with a
// negative FRAME_INSET, expanded) from the stage-wrap box, storing each as a
// stage-wrap-relative percentage. Already-placed slugs are left alone, so
// thumbs stay put across re-renders and team switches.
function layoutThumbs(slugs, containerW, containerH){
  const unplaced = slugs.filter(s => !thumbPositions.has(s));
  if(unplaced.length === 0) return;

  const size = thumbSize();
  const gap = thumbGap();
  const inset = frameInset();

  const rw = containerW - 2 * inset;
  const rh = containerH - 2 * inset;
  const perimeter = 2 * (rw + rh);

  const slot = perimeter / unplaced.length;
  const maxJitter = Math.max(0, (slot - size - gap) / 2);
  const startOffset = Math.random() * perimeter;

  unplaced.forEach((slug, i) => {
    const base = startOffset + i * slot;
    const jitter = (Math.random() * 2 - 1) * maxJitter;
    const spot = pointOnFrame(base + jitter, rw, rh);

    // small perpendicular nudge (in/out a few px) for an organic feel --
    // this never eats into another thumb's slot since it runs sideways
    // to the direction spacing is measured in.
    const perp = (Math.random() * 2 - 1) * 8;
    let px = spot.x, py = spot.y;
    if(spot.edge === "top" || spot.edge === "bottom") py += perp;
    else px += perp;

    // back into stage-wrap-relative coords, then to a %
    thumbPositions.set(slug, {
      x: ((inset + px) / containerW) * 100,
      y: ((inset + py) / containerH) * 100
    });
  });
}

// Slug of whichever player is currently shown on the stage, given the
// active team + that team's current index. Returns null if nothing's
// rendered yet (e.g. an empty roster).
function currentSlug(){
  const roster = rosterFor(activeTeam);
  const p = roster[activeIndex[activeTeam ?? "ALL"]];
  return p ? slugify(p.name) : null;
}

// Drives all three thumb states in one pass:
//   dim      -- not on the active team (default .thumb styling)
//   active   -- on the active team
//   selected -- the exact player currently shown on stage
// Toggling these classes is what drives the fades/pulses -- the actual
// opacity/filter/transform/glow animation lives in the `.thumb` rules in
// CSS, so this only works smoothly if the elements already exist in the
// DOM (see buildThumbs / renderThumbs below).
function updateThumbStates(){
  const rosterNow = rosterFor(activeTeam);
  const activeSet = new Set(rosterNow.map(p => slugify(p.name)));
  const selected = currentSlug();

  document.querySelectorAll(".thumb").forEach(el => {
    const key = el.dataset.key;
    el.classList.toggle("active", activeSet.has(key));
    el.classList.toggle("selected", key === selected);
  });
}

// Creates the thumb elements once, laid out around the stage frame, and
// plays a staggered fade+scale entrance. Called only the first time
// renderThumbs runs for this page load.
function buildThumbs(row){
  const wrap = row.closest(".stage-wrap") || row;
  const rect = wrap.getBoundingClientRect();
  const containerW = rect.width || 1000;
  const containerH = rect.height || 480;

  const roster = rosterFor(null); // IMPORTANT: ALL PLAYERS always, fixed order
  const slugs = roster.map(p => slugify(p.name));

  layoutThumbs(slugs, containerW, containerH);

  row.innerHTML = "";

  roster.forEach((p, i) => {
    const slug = slugify(p.name);
    const pos = thumbPositions.get(slug);

    const t = document.createElement("div");
    t.className = "thumb";
    t.dataset.key = slug;

    t.style.left = pos.x + "%";
    t.style.top = pos.y + "%";

    // entrance state -- transitioned away below, riding the same
    // opacity/transform transition used for the highlight/dim fade
    t.style.opacity = "0";
    t.style.transform = "translate(-50%, -50%) scale(0.3)";
    t.style.transitionDelay = (Math.min(i, 24) * 16) + "ms";

    t.innerHTML = `
      <img src="images/thumbs/${slug}.png"
        alt="${p.name}"
        onerror="this.remove(); this.parentElement.classList.add('thumb-fallback'); this.parentElement.textContent='${initials(p.name)}';">
    `;

    // click = select player
    t.addEventListener("click", () => {

      // Find the player in the full roster
      const player = PLAYERS.find(pp => slugify(pp.name) === slug);
      if (!player) return;

      // If they're not in the current team, switch to one they belong to
      if (activeTeam !== null && !player.teams.includes(activeTeam)) {
        activeTeam = player.teams[0];      // or choose another preferred team
      }

      const rosterNow = rosterFor(activeTeam);
      const idx = rosterNow.findIndex(pp => slugify(pp.name) === slug);

      if (idx !== -1) {
        activeIndex[activeTeam ?? "ALL"] = idx;
        renderRosterAll();     // updates tabs, stage, metadata and thumb states
      }
    });

    row.appendChild(t);
  });

  updateThumbStates();

  // release the entrance state on the next frame so the transition animates
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      row.querySelectorAll(".thumb").forEach(el => {
        el.style.opacity = "";
        el.style.transform = "";
      });
      // clear the stagger once the entrance has played so later
      // highlight/dim fades (team switches) happen in lockstep, not staggered
      setTimeout(() => {
        row.querySelectorAll(".thumb").forEach(el => { el.style.transitionDelay = ""; });
      }, 700);
    });
  });
}

function renderThumbs(){
  const row = document.getElementById("thumbRow");
  if(!row) return;

  if(!row.dataset.built){
    row.dataset.built = "1";
    buildThumbs(row);
  } else {
    // thumbs already exist -- just fade/pulse their active + selected state
    updateThumbStates();
  }
}

// Thumb size/gap/inset are viewport-dependent (see thumbSize/thumbGap/
// frameInset above). If the window crosses one of those breakpoints --
// e.g. rotating a phone, or resizing a desktop window past 760px -- the
// cached positions and image sizes would fall out of sync with each
// other, so wipe the cache and rebuild from scratch when that happens.
function currentThumbBreakpoint(){
  const w = window.innerWidth;
  if(w <= 600) return "sm";
  if(w <= 760) return "md";
  return "lg";
}
let _thumbBreakpoint = currentThumbBreakpoint();
let _thumbResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(_thumbResizeTimer);
  _thumbResizeTimer = setTimeout(() => {
    const bp = currentThumbBreakpoint();
    if(bp === _thumbBreakpoint) return;
    _thumbBreakpoint = bp;

    const row = document.getElementById("thumbRow");
    if(!row) return;
    thumbPositions.clear();
    row.dataset.built = "";
    renderThumbs();
  }, 200);
});

function step(delta){
  const roster = rosterFor(activeTeam);
  const len = roster.length;
  const key = activeTeam ?? "ALL";
  activeIndex[key] =
    (activeIndex[key] + delta + len) % len;
  renderStage(true);
  renderThumbs();
}

function renderRosterAll(){
  renderTabs();
  renderMeta();
  renderStage(false);
  renderThumbs();
}

function setupFieldBg(){
  const img = document.getElementById("fieldImg");
  if(!img) return;
  img.src = "images/field.png";
}

function setupRosterPage(){
  if(!document.getElementById("stage")) return;
  document.addEventListener("click", (e)=>{
    if(e.target.closest(".arrow-left")) step(-1);
    if(e.target.closest(".arrow-right")) step(1);
  });
  setupFieldBg();
  renderRosterAll();
}

/* ---------- CONTACT FORM (contact.html only) ---------- */
function setupContactForm(){
  const form = document.querySelector(".panel form");
  const confirm = document.getElementById("formConfirm");
  if(!form || !confirm) return;

  form.addEventListener("submit", () => {
    // mailto forms hand off to the user's mail client rather than doing a
    // real network submit, so this is an optimistic "looks like it went
    // through" confirmation rather than a guaranteed delivery receipt.
    confirm.hidden = false;
    confirm.classList.add("show");
  });
}

/* ---------- ABOUT PAGE STATS (about.html only) ---------- */
function setupAboutStats(){
  const statPlayers = document.getElementById("statPlayers");
  if(!statPlayers) return;
  statPlayers.textContent = PLAYERS.length;
  document.getElementById("statTeams").textContent = 3;
  const overlap = PLAYERS.filter(p=>p.teams.length > 1).length;
  document.getElementById("statOverlap").textContent = overlap;
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  setupNav();
  scatterDiscs();
  setupRosterPage();
  setupAboutStats();
  setupContactForm();
  renderTimeline();
});
