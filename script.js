// ===== Mobile menu =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a.navlink').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Theme toggle =====
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light' || savedTheme === 'dark') root.setAttribute('data-theme', savedTheme);
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ===== Typed effect (no libs) =====
const typedEl = document.getElementById('typed');
const roles = [
  'seamless program development',
  'TOP-2V troubleshooting',
  'compression mapping',
  'GSM & stretch control'
];
let ri = 0, ci = 0, dir = 1; // 1 typing, -1 deleting
function tick(){
  if (!typedEl) return;
  const current = roles[ri];
  ci += dir;
  typedEl.textContent = current.slice(0, ci);
  let delay = 55;
  if (dir === 1 && ci === current.length) { delay = 1100; dir = -1; }
  else if (dir === -1 && ci === 0) { dir = 1; ri = (ri + 1) % roles.length; delay = 260; }
  else if (dir === 1) { delay = 38 + Math.random()*22; }
  else { delay = 22 + Math.random()*18; }
  setTimeout(tick, delay);
}
setTimeout(tick, 450);

// ===== Scroll reveal =====
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ===== Active nav link on scroll =====
const sections = Array.from(document.querySelectorAll('section[id]'));
const navA = Array.from(document.querySelectorAll('.nav a.navlink'));
function setActive(id){
  navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}
const spy = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible?.target?.id) setActive(visible.target.id);
}, { threshold: [0.2, 0.35, 0.5] });
sections.forEach(s => spy.observe(s));

// ===== Tabs (Selected vs Texture) =====
const tabs = Array.from(document.querySelectorAll('.tab'));
const paneSelected = document.getElementById('pane-selected');
const paneTexture = document.getElementById('pane-texture');
function showPane(which){
  tabs.forEach(t => {
    const is = t.dataset.tab === which;
    t.classList.toggle('active', is);
    t.setAttribute('aria-selected', String(is));
  });
  if (paneSelected && paneTexture) {
    const showSelected = which === 'selected';
    paneSelected.classList.toggle('active', showSelected);
    paneTexture.classList.toggle('active', !showSelected);
    paneSelected.hidden = !showSelected;
    paneTexture.hidden = showSelected;
  }
}
tabs.forEach(t => t.addEventListener('click', () => showPane(t.dataset.tab)));

// ===== Project modal =====
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTags = document.getElementById('modalTags');
function openModal(card){
  if (!modal || !modalTitle || !modalDesc || !modalTags) return;
  modalTitle.textContent = card.dataset.modalTitle || 'Details';
  modalDesc.textContent = card.dataset.modalDesc || '';
  modalTags.innerHTML = '';
  (card.dataset.modalTags || '').split(',').map(s => s.trim()).filter(Boolean).forEach(t => {
    const span = document.createElement('span');
    span.textContent = t;
    modalTags.appendChild(span);
  });
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('.project').forEach(card => {
  card.addEventListener('click', (e) => {
    const btn = e.target.closest('.plink');
    if (btn || e.target.closest('.project')) openModal(card);
  });
});
document.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ===== Contact form: Copy to clipboard =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    const text = `Name: ${name}
Email: ${email}

Message:
${message}`;

    try {
      await navigator.clipboard.writeText(text);
      alert('Copied! Now paste it into email/WhatsApp.');
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      alert('Copied! Now paste it into email/WhatsApp.');
    }
  });
}

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = String(new Date().getFullYear());

// ===== Workflow interactive detail =====
const wfData = {
  1: {
    title: "Buyer Brief",
    text: "Interpret buyer tech pack, performance targets (GSM/stretch/recovery), construction requirements, and feasibility risks before development.",
    chips: ["Tech pack", "Performance target", "Feasibility"]
  },
  2: {
    title: "Structure Build (iPolaris)",
    text: "Create structure layout, zoning, artwork alignment, and technical selections to match fit + performance goals while staying production-friendly.",
    chips: ["Zoning", "Artwork", "Structure logic"]
  },
  3: {
    title: "Machine Program (TOP-2V)",
    text: "Build stable machine logic, carrier behavior, stitch density control, and program corrections to ensure clean knitting and consistent output.",
    chips: ["Program stability", "Density", "Run consistency"]
  },
  4: {
    title: "Knit & Measure",
    text: "Knit samples, verify measurements, tube width, GSM, and stretch behavior. Identify defects and correct program/material parameters.",
    chips: ["Measurement", "Defect check", "Calibration"]
  },
  5: {
    title: "Dye Evaluation",
    text: "Coordinate dyeing and check post-dye changes in GSM, stretch, hand-feel, and dimensional stability. Adjust settings to hit targets.",
    chips: ["Post-dye", "Stability", "Target match"]
  },
  6: {
    title: "Fit Refinement",
    text: "Implement fit feedback: compression distribution, stitch tuning, and construction improvements. Iterate until size-set approval readiness.",
    chips: ["Fit", "Compression", "Refinement loop"]
  },
  7: {
    title: "Size-set & Bulk Support",
    text: "Finalize tech approval, handover programs, and provide ongoing bulk troubleshooting to maintain consistent quality and production speed.",
    chips: ["Handover", "Bulk support", "Consistency"]
  }
};

const wfSteps = document.querySelectorAll(".wf-step");
const wfTitle = document.getElementById("wfDetailTitle");
const wfText = document.getElementById("wfDetailText");
const wfChips = document.getElementById("wfDetailChips");

function renderWf(stepNum){
  const d = wfData[stepNum];
  if (!d || !wfTitle || !wfText || !wfChips) return;

  wfTitle.textContent = d.title;
  wfText.textContent = d.text;

  wfChips.innerHTML = "";
  d.chips.forEach(c => {
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = c;
    wfChips.appendChild(span);
  });
}

wfSteps.forEach(btn => {
  btn.addEventListener("click", () => {
    wfSteps.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    renderWf(btn.dataset.step);
  });
});

// initial render
renderWf(1);
