document.addEventListener("DOMContentLoaded", () => {
  let appData = {
    teams: {},
    matches: [],
  };

  // --- DOM Elements ---
  const addTeamForm = document.getElementById("addTeamForm");
  const addMatchForm = document.getElementById("addMatchForm");
  const teamsList = document.getElementById("teamsList");
  const matchesContainer = document.getElementById("matchesContainer");
  const homeTeamSelect = document.getElementById("homeTeamSelect");
  const awayTeamSelect = document.getElementById("awayTeamSelect");
  const calculateBtn = document.getElementById("calculatePredictions");
  const saveEverythingBtn = document.getElementById("saveEverything");
  const saveRatingsBtn = document.getElementById("saveRatings");
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // --- Data Management & Sync ---

  async function fetchData() {
    try {
      const response = await fetch("/api/data");
      appData = await response.json();
      updateAll();
    } catch (error) {
      showToast("Fehler beim Laden der Daten", "error");
    }
  }

  async function saveData(silent = false) {
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appData),
      });
      if (response.ok) {
        if (!silent) showToast("Daten erfolgreich gespeichert!");
      } else {
        showToast("Fehler beim Speichern", "error");
      }
    } catch (error) {
      showToast("Fehler beim Speichern", "error");
    }
  }

  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toast.classList.remove("translate-y-32", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    const icon = document.getElementById("toastIcon");
    if (type === "error") {
      icon.classList.remove("bg-brand-500");
      icon.classList.add("bg-red-500");
    } else {
      icon.classList.add("bg-brand-500");
      icon.classList.remove("bg-red-500");
    }

    setTimeout(() => {
      toast.classList.add("translate-y-32", "opacity-0");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 3000);
  }

  // --- Logic & Stats ---

  function calculateStats() {
    // Reset team stats
    Object.keys(appData.teams).forEach((name) => {
      appData.teams[name].goalsScored = 0;
      appData.teams[name].matchesPlayed = 0;
      appData.teams[name].goalsPerMatch = 0;
    });

    // Calculate based on matches
    appData.matches.forEach((match) => {
      if (match.status === "FINISHED") {
        const home = appData.teams[match.home];
        const away = appData.teams[match.away];

        if (home && away) {
          home.matchesPlayed++;
          away.matchesPlayed++;
          home.goalsScored += parseInt(match.homeScore) || 0;
          away.goalsScored += parseInt(match.awayScore) || 0;
        }
      }
    });

    // Calculate average
    Object.keys(appData.teams).forEach((name) => {
      const team = appData.teams[name];
      if (team.matchesPlayed > 0) {
        team.goalsPerMatch = (team.goalsScored / team.matchesPlayed).toFixed(2);
      }
    });
  }

  function runPredictionAlgorithm() {
    appData.matches.forEach((match) => {
      if (match.status !== "FINISHED") {
        const home = appData.teams[match.home];
        const away = appData.teams[match.away];

        if (home && away) {
          const ratingDiff = home.rating - away.rating;
          const homeGPM = parseFloat(home.goalsPerMatch) || 1.2;
          const awayGPM = parseFloat(away.goalsPerMatch) || 1.2;

          let predHome = homeGPM + ratingDiff / 40;
          let predAway = awayGPM - ratingDiff / 40;

          predHome = Math.max(0, Math.round(predHome));
          predAway = Math.max(0, Math.round(predAway));

          const isKnockout = !match.matchday.toLowerCase().includes("gruppe");
          if (isKnockout && predHome === predAway) {
            if (home.rating >= away.rating) {
              predHome++;
            } else {
              predAway++;
            }
          }

          match.predictedHome = predHome;
          match.predictedAway = predAway;
        }
      }
    });
    showToast("Prognosen berechnet!");
    renderMatches();
  }

  // --- UI Rendering ---

  function updateAll() {
    calculateStats();
    renderTeams();
    renderMatches();
    updateSelects();
  }

  function renderTeams() {
    teamsList.innerHTML = "";
    const sortedTeams = Object.keys(appData.teams).sort();

    sortedTeams.forEach((name) => {
      const team = appData.teams[name];
      const div = document.createElement("div");
      div.className =
        "group rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700 hover:shadow-lg";
      div.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-zinc-50">${name}</span>
                    <div class="flex items-center gap-3">
                        <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded">TPS: ${team.goalsPerMatch || 0}</span>
                        <button onclick="window.deleteTeam('${name}')" class="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <input type="range" min="0" max="100" value="${team.rating}"
                        class="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-800 accent-brand-500"
                        oninput="this.nextElementSibling.textContent = this.value"
                        onchange="window.updateTeamRating('${name}', this.value)">
                    <span class="text-xs font-bold text-brand-500 w-6 text-right">${team.rating}</span>
                </div>
            `;
      teamsList.appendChild(div);
    });
  }

  window.updateTeamRating = (name, val) => {
    if (appData.teams[name]) {
      appData.teams[name].rating = parseInt(val);
    }
  };

  // Robust Team Deletion with Persistence
  window.deleteTeam = (name) => {
    if (
      confirm(
        `Team "${name}" wirklich löschen? Alle zugehörigen Spiele werden ebenfalls permanent entfernt.`,
      )
    ) {
      // 1. Remove from teams object
      delete appData.teams[name];

      // 2. Remove all matches involving this team
      appData.matches = appData.matches.filter(
        (m) => m.home !== name && m.away !== name,
      );

      // 3. UI Updates
      updateAll();

      // 4. Immediate Sync to JSON
      saveData(true);
      showToast(`Team ${name} und zugehörige Spiele wurden gelöscht.`);
    }
  };

  function updateSelects() {
    const sortedTeams = Object.keys(appData.teams).sort();
    const options = sortedTeams
      .map((name) => `<option value="${name}">${name}</option>`)
      .join("");

    homeTeamSelect.innerHTML =
      '<option value="" disabled selected>Team 1 wählen</option>' + options;
    awayTeamSelect.innerHTML =
      '<option value="" disabled selected>Team 2 wählen</option>' + options;
  }

  function renderMatches() {
    matchesContainer.innerHTML = "";
    const groups = {};
    appData.matches.forEach((m) => {
      if (!groups[m.matchday]) groups[m.matchday] = [];
      groups[m.matchday].push(m);
    });

    Object.keys(groups).forEach((day) => {
      const section = document.createElement("section");
      section.className =
        "rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-2xl backdrop-blur-sm";

      let matchesHtml = groups[day]
        .map((match) => {
          const isFinished = match.status === "FINISHED";
          return `
                    <div class="border-b border-zinc-800/50 last:border-b-0 p-5 transition-all hover:bg-zinc-800/30">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <!-- Teams & Score Display -->
                            <div class="flex items-center justify-between md:justify-center gap-6 flex-1">
                                <div class="text-right flex-1 text-base font-bold text-zinc-100 truncate tracking-tight">${match.home}</div>
                                <div class="flex items-center gap-3">
                                    <input type="number" value="${match.homeScore !== null ? match.homeScore : ""}"
                                        placeholder="-"
                                        class="h-12 w-12 rounded-xl border-2 border-zinc-800 bg-zinc-950 text-center text-lg font-bold text-brand-500 focus:border-brand-500/50 focus:outline-none transition-all ${isFinished ? "border-zinc-700 bg-zinc-900 text-zinc-400" : ""}"
                                        onchange="window.updateMatchScore(${match.id}, 'home', this.value)">
                                    <span class="text-zinc-700 font-bold text-xl">:</span>
                                    <input type="number" value="${match.awayScore !== null ? match.awayScore : ""}"
                                        placeholder="-"
                                        class="h-12 w-12 rounded-xl border-2 border-zinc-800 bg-zinc-950 text-center text-lg font-bold text-brand-500 focus:border-brand-500/50 focus:outline-none transition-all ${isFinished ? "border-zinc-700 bg-zinc-900 text-zinc-400" : ""}"
                                        onchange="window.updateMatchScore(${match.id}, 'away', this.value)">
                                </div>
                                <div class="text-left flex-1 text-base font-bold text-zinc-100 truncate tracking-tight">${match.away}</div>
                            </div>

                            <!-- Prediction & Interactive Elements -->
                            <div class="flex items-center justify-between md:justify-end gap-8 border-t border-zinc-800 md:border-0 pt-5 md:pt-0">
                                <div class="flex flex-col items-center min-w-[70px]">
                                    <span class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Tipp</span>
                                    <span class="text-sm font-bold text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">${match.predictedHome !== null ? match.predictedHome + ":" + match.predictedAway : "-- : --"}</span>
                                </div>
                                <div class="flex items-center gap-5">
                                    <label class="flex items-center gap-3 cursor-pointer group">
                                        <div class="relative flex items-center">
                                            <input type="checkbox" ${isFinished ? "checked" : ""}
                                                onchange="window.toggleMatchStatus(${match.id}, this.checked)"
                                                class="peer h-5 w-5 appearance-none rounded-lg border-2 border-zinc-700 bg-zinc-950 checked:bg-brand-500 checked:border-brand-500 transition-all">
                                            <svg class="absolute h-3.5 w-3.5 text-zinc-950 opacity-0 peer-checked:opacity-100 transition-opacity left-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span class="text-[11px] font-black text-zinc-500 peer-checked:text-brand-500 uppercase tracking-widest">Beendet</span>
                                    </label>
                                    <button onclick="window.deleteMatch(${match.id})" class="text-zinc-600 hover:text-red-500 transition-colors transform hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        })
        .join("");

      section.innerHTML = `
                <div class="border-b border-zinc-800 bg-zinc-950/30 px-6 py-3 flex justify-between items-center">
                    <span class="text-xs font-black uppercase tracking-[0.3em] text-brand-500">${day}</span>
                    <span class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">${groups[day].length} Begegnungen</span>
                </div>
                <div>${matchesHtml}</div>
            `;
      matchesContainer.appendChild(section);
    });
  }

  // --- Interaction Handlers ---

  window.updateMatchScore = (id, side, val) => {
    const match = appData.matches.find((m) => m.id === id);
    if (match) {
      match[side + "Score"] = val === "" ? null : parseInt(val);
      calculateStats();
      renderTeams();
    }
  };

  window.toggleMatchStatus = (id, finished) => {
    const match = appData.matches.find((m) => m.id === id);
    if (match) {
      match.status = finished ? "FINISHED" : "UPCOMING";
      updateAll();
    }
  };

  window.deleteMatch = (id) => {
    if (confirm("Dieses Spiel wirklich löschen?")) {
      appData.matches = appData.matches.filter((m) => m.id !== id);
      updateAll();
    }
  };

  addTeamForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("teamName").value.trim();
    const rating = parseInt(document.getElementById("teamRating").value);

    if (name && !appData.teams[name]) {
      appData.teams[name] = {
        rating: rating,
        goalsScored: 0,
        matchesPlayed: 0,
        goalsPerMatch: 0,
      };
      document.getElementById("teamName").value = "";
      updateAll();
      showToast(`Team ${name} hinzugefügt!`);
    } else {
      showToast("Team existiert bereits oder Name ungültig", "error");
    }
  });

  addMatchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const home = homeTeamSelect.value;
    const away = awayTeamSelect.value;
    const matchday = document.getElementById("matchdayInput").value.trim();

    if (home && away && home !== away && matchday) {
      const newMatch = {
        id: Date.now(),
        home,
        away,
        homeScore: null,
        awayScore: null,
        status: "UPCOMING",
        matchday,
        predictedHome: null,
        predictedAway: null,
      };
      appData.matches.push(newMatch);
      updateAll();
      showToast("Spiel hinzugefügt!");
    } else {
      showToast("Ungültige Spieldaten", "error");
    }
  });

  calculateBtn.addEventListener("click", runPredictionAlgorithm);
  saveEverythingBtn.addEventListener("click", () => saveData());
  saveRatingsBtn.addEventListener("click", () => saveData());

  // Initial Load
  fetchData();
});
