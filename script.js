/* =========================================================
   THE YELLOW SQUAD — shared script
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
    estDate: "2024",
    description: "Our first and core team."
  },
  PPYP: {
    name: "Penno Pineapple Yellow Pen",
    accent: "#f9ff4b",
    estDate: "2025",
    description: "Our late timeslot team, bringing together players from Pennultimate."
  },
  YS: {
    name: "The Yellowship",
    accent: "#ffbf1f",
    estDate: "2024",
    description: "Our Wednesday Hills social team."
  },
};

const PLAYER_INFO = {
  "Brian Wong": {
    nickname: "Michael Reeves",
    quote: "Well, well, well.",
    funfact: "When he's attacking the disc, guard him hard. When he's attacking your food, guard your food."
  }
};

const PLAYERS = [
  ["Brian Wong","M",["YF","PPYP","YS"]],
  ["Hannah Ma","F",["YF"]],
  ["Felicity Chu","F",["YF","PPYP"]],
  ["Natalie Hwang","F",["YF","PPYP"]],
  ["Anna Hou","F",["YF"]],
  ["Margaux Choo","F",["YF","PPYP","YS"]],
  ["Richard Lo","M",["YF"]],
  ["Caleb Cheung","M",["YF","PPYP"]],
  ["Michael Lau","M",["YF","PPYP","YS"]],
  ["Michael Nyunt","M",["YF"]],
  ["Andrew Chen","M",["YF","PPYP","YS"]],
  ["Dharmesh Desai","M",["YF","PPYP"]],
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
  funfact: PLAYER_INFO[name]?.funfact ?? ""
}));

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
  const btn = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("siteNav");
  if(!btn || !nav) return;

  btn.addEventListener("click", ()=>{
    const open = nav.classList.toggle("open");
    btn.classList.toggle("active", open);
    btn.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", ()=>{
      nav.classList.remove("open");
      btn.classList.remove("active");
      btn.setAttribute("aria-expanded", false);
    });
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
            "Showing every Yellow Squad player across all teams.";

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

    document.getElementById("stageCounter").textContent = `${idx + 1} / ${roster.length}`;

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

function renderThumbs(){
  const row = document.getElementById("thumbRow");
  if(!row) return;
  row.innerHTML = "";
  const roster = rosterFor(activeTeam);
  roster.forEach((p, i)=>{
    const t = document.createElement("div");
    const indexKey = activeTeam ?? "ALL";
    t.className = "thumb" + (i === activeIndex[indexKey] ? " active" : "");
    const slug = slugify(p.name);

    t.innerHTML = `
      <img src="images/thumbs/${slug}.png"
          alt="${p.name}"
          onerror="this.style.display='none'; this.parentElement.textContent='${initials(p.name)}';">
    `;

    t.title = p.name;
    t.addEventListener("click", ()=>{
      if(i === activeIndex[indexKey ?? "ALL"]) return;
      activeIndex[indexKey ?? "ALL"] = i;
      renderStage(true);
      renderThumbs();
    });
    row.appendChild(t);
  });
}

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
});
