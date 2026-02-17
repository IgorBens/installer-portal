// ===== APP INITIALIZATION =====
// Loaded last — wires up the login form, binds filters, starts router.

document.addEventListener("DOMContentLoaded", () => {
  // Set title from config
  document.title = CONFIG.APP_TITLE;
  document.getElementById("appTitle").textContent = CONFIG.APP_TITLE;
  document.getElementById("loginTitle").textContent = CONFIG.APP_TITLE;

  // Login form
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const statusEl = document.getElementById("loginStatus");
    const username = document.getElementById("loginUser").value.trim().toLowerCase();
    const password = document.getElementById("loginPass").value;

    if (!username || !password) {
      statusEl.textContent = "Vul gebruikersnaam en wachtwoord in.";
      return;
    }

    statusEl.textContent = "Inloggen\u2026";

    try {
      await Auth.login(username, password);
      statusEl.textContent = "";
      document.getElementById("loginUser").value = "";
      document.getElementById("loginPass").value = "";
      Router.showView("tasks");
    } catch (err) {
      statusEl.textContent = err.message || "Login mislukt.";
    }
  });

  // Bind task list filter events
  TaskList.bindFilters();

  // Start router (shows login or tasks based on stored token)
  Router.init();

  console.log("[app] Thermoduct Portal initialized");
});
