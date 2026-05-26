# kieboard.me — Task List

## Project Context
- **Site:** kieboard.me — terminal-style cybersecurity portfolio
- **Stack:** Vanilla HTML/CSS/JS, GitHub Pages, Cloudflare CDN
- **Terminal engine:** `Terminal/main.js` (minified, ~280KB with WAV embedded)
- **GUI portfolio:** `index.html` + `styles.css` + `script.js`
- **Automation:** `.github/workflows/fetch-writeups.yml` — nightly THM stats + GitBook writeups
- **Backend:** Supabase (guestbook + visitors), Formspree (contact form)
- **Owner:** Kieran Rorrison — IT Analyst transitioning to Cyber Security

## Critical Rules
- `Terminal/main.js` is minified — always run acorn syntax check after edits:
  ```
  node -e "const acorn=require('acorn'); const code=require('fs').readFileSync('Terminal/main.js','utf8'); try{acorn.parse(code,{ecmaVersion:2020});console.log('CLEAN');}catch(e){console.log('ERR',e.pos,e.message);}"
  ```
- Never inject `const` declarations after comma operators in minified code — use IIFE pattern instead
- WAV typing sound is embedded as base64 in main.js — do not strip it
- Cloudflare proxies the site — cache purge required after CSS/JS changes
- Scottish spelling throughout — no CV/resume section (contact form only)
- No mention of Ashurst — use "International Law Firm" or "the firm"

## Key Variables & IDs
- Supabase URL: `https://xhgtgdqmqmwexnxetdrd.supabase.co`
- Formspree ID: `xvgzwwdz`
- THM username: `Kieboard`
- GitHub repo: `Kieboard/Kieboard.github.io`
- TryHackMe API: `https://tryhackme.com/api/user/Kieboard`

---

## To-Do List

### 🔴 Outstanding Fixes
- [ ] Credly badge URLs — currently `example/example2/example3` — update when certs achieved
- [ ] Mirror/archive repo — `Kieboard.github.io-archive` should be set to private

### 🟡 Terminal
- [ ] Hack easter egg 2 — second hidden easter egg (first is Lenny)
- [ ] Update `whoami` / `about` commands with current info
- [ ] progress command — build out properly when ready (currently shows WIP)

### 🟡 Quest / CTF Hub
- [ ] Mirror repo for CTF-Hub pipeline

### 🟢 Portfolio Content (GUI)
- [ ] CTF Writeups section — mac-style floating windows, live pull from GitBook, top 5 per platform (THM/HTB)
- [ ] Add more TryHackMe room cards — 82+ rooms completed, only 3 shown currently
- [ ] University tab outputs — add actual assignment outputs as they complete
- [ ] Home lab / blue team writeup — biggest gap vs other cyber portfolios, high priority for SOC roles
- [ ] SIEM/Splunk writeup — document AoC Splunk work as standalone writeup
- [ ] Incident response report — even simulated, critical for SOC applications
- [ ] Experience + Learning Journey section split — left: learning journey timeline, right: work experience

### 🔵 New Features

#### THM Badge Display
- [ ] Pull badge data from THM API (`/api/user/Kieboard`)
- [ ] Nightly GitHub Action writes badges array to `thm-stats.json`
- [ ] Render scrollable badge strip on portfolio (About section or dedicated widget)
- [ ] Click badge → modal/tooltip showing badge name + date earned + description
- [ ] Resize badge images to thumbnail size for performance

#### THM Streak
- [ ] Add `streak` field to nightly GitHub Action fetch
- [ ] Add streak column to THM stats display on portfolio
- [ ] Auto-updates every night alongside rooms/rank/badges

#### Other Features
- [ ] "Currently" widget — live status block: studying X, playing Y, active on THM
- [ ] Skills progress bars — replace static skill tags with animated bars
- [ ] Visitor counter — tie into existing Supabase visitors table, display on site
- [ ] Time machine terminal command — portal image + VHS/glitch transition effect
- [ ] `forever` window — floating terminal window with Sleep Token art
- [ ] progress command — build out properly with current cert roadmap and goals

### ⚙️ Infrastructure
- [ ] TryHackMe stats accuracy check — verify live API is pulling correctly (82 rooms, Top 8%, 11 badges)
- [ ] Mirror/archive repo — confirm set to private

---

## Completed ✅
- [x] kieboard.me live via GitHub Pages + Cloudflare
- [x] HTTPS enforced + www redirect
- [x] Single clean commit — no history
- [x] favicon.ico (32x32 + 16x16)
- [x] Typing sounds — WAV embedded, smooth envelope, tuned volume
- [x] Guestbook — 100 char limit, profanity filter (IIFE), randomised good messages
- [x] Visitors POST fixed (direct fetch to Supabase RPC)
- [x] Formspree contact form
- [x] THM GitHub Actions — nightly stats + GitBook writeups fetch
- [x] Quest 1 (Breach), Quest 2 (Dead Drop), Quest 3 (The Vessel) — all complete
- [x] ASCII login logo — KieOS
- [x] progress command — disabled with WIP message
- [x] clear command — wipes + reprints full MOTD
- [x] certs.txt Top 8%
- [x] Quest window minimise + fullscreen buttons
- [x] Quest exit message (no more hall/guestbook hints)
- [x] Volume slider on Quest 3 audio player
- [x] Pacman + Space Invaders removed from play menu
- [x] Label-cursor blinking squares removed
- [x] Nav hamburger open by default
- [x] Experience text bigger (.82rem → .92rem)
- [x] Hero tagline updated
- [x] BSc Year 2 references updated
- [x] Password Generator removed from projects
- [x] data-animate opacity fix (sections no longer invisible on snap scroll)
- [x] URL hash updates on scroll (kieboard.me/#about etc)
- [x] Script.js B reference error fixed
