// ===== LOGIN VIEW =====
// No form — redirects to Keycloak's login page.
// Keycloak handles username/password, MFA, etc.

(() => {
  const template = `
    <div class="login-wrapper">
      <h1 id="loginTitle"></h1>
      <div class="card">
        <p style="color:var(--muted);font-size:14px;margin:0 0 16px">
          Log in to continue.
        </p>
        <button id="loginBtn" class="btn-block">Log in</button>
        <div id="loginStatus" class="hint"></div>
      </div>
    </div>
  `;

  function mount() {
    document.getElementById("loginTitle").textContent = CONFIG.APP_TITLE;

    document.getElementById("loginBtn").addEventListener("click", async () => {
      const statusEl = document.getElementById("loginStatus");
      statusEl.textContent = "Redirecting to login\u2026";

      try {
        await Auth.login(); // redirects to Keycloak
      } catch (err) {
        statusEl.textContent = "Could not connect to authentication server.";
        console.error("[login]", err);
      }
    });
  }

  Router.register("login", { template, mount });
})();
