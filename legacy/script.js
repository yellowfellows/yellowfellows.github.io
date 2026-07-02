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
    estDate: "",
    description: "The original. Where it all started, back when the jerseys were the only yellow thing about this team. Expect handlers who overthink cutting lanes and a sideline louder than the score."
  },
  PPYP: {
    name: "Penno Pineapple Yellow Pen",
    accent: "#A8D93C",
    estDate: "",
    description: "Somehow both the biggest roster and the hardest name to fit on a jersey. Deep bench, deeper inside jokes — ask someone about the name sometime."
  },
  TY: {
    name: "The Yellowship",
    accent: "#FF8C42",
    estDate: "",
    description: "Small but mighty. Everyone knows everyone, and everyone's played every position at least once, usually by accident."
  },
  ALL: {
    name: "All",
    accent: "#FF4FA3",
    estDate: "",
    description: "Every player across all three teams in one combined roster. Yes, some names show up more than once — that's just how it works when three teams share a color."
  }
};

const PLAYERS = [
  ["Hannah Ma","F",["YF"]],
  ["Felicity Chu","F",["YF","PPYP"]],
  ["Natalie Hwang","F",["YF","PPYP"]],
  ["Anna Hou","F",["YF"]],
  ["Margaux Choo","F",["YF","PPYP","TY"]],
  ["Brian Wong","M",["YF","PPYP","TY"]],
  ["Richard Lo","M",["YF"]],
  ["Caleb Cheung","M",["YF","PPYP"]],
  ["Michael Lau","M",["YF","PPYP","TY"]],
  ["Michael Nyunt","M",["YF"]],
  ["Andrew Chen","M",["YF","PPYP","TY"]],
  ["Dharmesh Desai","M",["YF","PPYP"]],
  ["Angle Line","F",["PPYP","TY"]],
  ["Germaine Loke","F",["PPYP"]],
  ["Jess Zhang","F",["PPYP"]],
  ["Damien Teh","M",["PPYP"]],
  ["Ethan Diu","M",["PPYP"]],
  ["Joel Anderson","M",["PPYP"]],
  ["Julian Kok","M",["PPYP"]],
  ["Karlon Tse","M",["PPYP"]],
  ["Jessie Wong","F",["TY"]],
  ["Melva Tang","F",["TY"]],
  ["Matty Juan","M",["TY"]],
  ["Wilson Kwong","M",["TY"]],
  ["Tyrone Lau","M",["TY"]],
  ["Rex Mercado","M",["TY"]]
].map(([name, gender, teams]) => ({ name, gender, teams, nickname: "", funfact: "" }));

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
  if(team === "ALL") return PLAYERS;
  return PLAYERS.filter(p=>p.teams.includes(team));
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
    s.textContent = "🥏";
    s.style.top = Math.random()*100 + "%";
    s.style.left = Math.random()*100 + "%";
    s.style.transform = `rotate(${Math.random()*360}deg) scale(${0.6+Math.random()*1.2})`;
    bg.appendChild(s);
  }
}

/* ---------- ROSTER STAGE (index.html only) ---------- */
let activeTeam = "YF";
const activeIndex = { YF:0, PPYP:0, TY:0, ALL:0 };

function renderTabs(){
  const nav = document.querySelector(".tabs");
  if(!nav) return;
  nav.innerHTML = "";
  Object.entries(TEAMS).forEach(([key, t])=>{
    const count = rosterFor(key).length;
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (key==="ALL" ? " tab-all" : "") + (key===activeTeam ? " active" : "");
    btn.setAttribute("role","tab");
    btn.setAttribute("aria-selected", key===activeTeam);
    btn.innerHTML = `${t.name}<span class="count">${count} players</span>`;
    if(key===activeTeam && key!=="ALL") btn.style.background = t.accent;
    else if(key!=="ALL") btn.style.background = "";
    btn.addEventListener("click", ()=>{ activeTeam = key; renderRosterAll(); });
    nav.appendChild(btn);
  });
}

function renderMeta(){
  const est = document.getElementById("teamEst");
  const desc = document.getElementById("teamDesc");
  if(!est || !desc) return;
  const t = TEAMS[activeTeam];
  est.textContent = t.estDate ? `Est. ${t.estDate}` : "Est. — add a date";
  est.className = "team-est" + (t.estDate ? "" : " empty");
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

function renderStage(fade){
  const figure = document.getElementById("playerFigure");
  const card = document.getElementById("infoCard");
  if(!figure || !card) return;

  const roster = rosterFor(activeTeam);
  const idx = activeIndex[activeTeam];
  const p = roster[idx];

  const doUpdate = () => {
    const slug = slugify(p.name);
    figure.innerHTML = `<img src="images/players/${slug}.png" alt="${p.name}"
      onerror="this.parentElement.innerHTML = document.getElementById('ghost-tpl-${slug}')?.innerHTML || '';">`;
    const tpl = document.createElement("template");
    tpl.id = `ghost-tpl-${slug}`;
    tpl.innerHTML = ghostSVG(p.name);
    figure.appendChild(tpl);

    const otherTeams = activeTeam === "ALL" ? p.teams : p.teams.filter(t=>t!==activeTeam);
    document.getElementById("badgeRow").innerHTML = otherTeams
      .map(t=>`<span class="team-chip chip-${t}" title="${TEAMS[t].name}">${t}</span>`).join("");
    document.getElementById("stageName").textContent = p.name;
    const nick = document.getElementById("stageNickname");
    nick.textContent = p.nickname ? `"${p.nickname}"` : "nickname tbd";
    nick.className = "nickname" + (p.nickname ? "" : " empty");
    const ff = document.getElementById("stageFunfact");
    ff.textContent = p.funfact || "fun fact coming soon…";
    ff.className = "funfact" + (p.funfact ? "" : " empty");

    document.getElementById("stageCounter").textContent = `${idx+1} / ${roster.length}`;

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
    t.className = "thumb" + (i===activeIndex[activeTeam] ? " active" : "");
    t.style.setProperty("--tbg", colorFor(p.name));
    t.textContent = initials(p.name);
    t.title = p.name;
    t.addEventListener("click", ()=>{
      if(i === activeIndex[activeTeam]) return;
      activeIndex[activeTeam] = i;
      renderStage(true);
      renderThumbs();
    });
    row.appendChild(t);
  });
}

function step(delta){
  const roster = rosterFor(activeTeam);
  const len = roster.length;
  activeIndex[activeTeam] = (activeIndex[activeTeam] + delta + len) % len;
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
  img.src = "images/field.jpg";
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
