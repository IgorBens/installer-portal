// ===== LOGIN VIEW =====

(() => {
  const template = `
    <div class="login-wrapper">
      <h1 id="loginTitle"></h1>
      <div class="card">
        <form id="loginForm">
          <div class="form-group">
            <input id="loginUser" placeholder="Gebruikersnaam" autocomplete="username" />
          </div>
          <div class="form-group">
            <input id="loginPass" type="password" placeholder="Wachtwoord" autocomplete="current-password" />
          </div>
          <button type="submit" class="btn-block">Inloggen</button>
        </form>
        <div id="loginStatus" class="hint"></div>
      </div>
    </div>
  `;

  function mount() {
    document.getElementById("loginTitle").textContent = CONFIG.APP_TITLE;

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
        Router.showView("tasks");
      } catch (err) {
        statusEl.textContent = err.message || "Login mislukt.";
      }
    });
  }

  // No tab — login is not shown in the nav bar
  Router.register("login", { template, mount });
})();
