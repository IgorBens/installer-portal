// ===== VIEW ROUTER (Registration Pattern) =====
//
// Views register themselves:
//   Router.register("tasks", {
//     template: `<div>...</div>`,      — HTML injected into #viewContainer
//     mount()  { ... },                — called after HTML is injected (bind events, fetch data)
//     unmount(){ ... },                — called before switching away (optional, save state)
//     tab: { label: "Taken", roles: ["*"] }  — nav tab (optional, omit = no tab)
//   });
//
// Adding a new view:
//   1. Create js/views/yourview.js with template + mount + Router.register()
//   2. Create css/yourview.css
//   3. Add <script> and <link> tags in index.html
//   That's it — no editing router.js or other files.

const Router = (() => {
  const views = {};
  let current = { name: null, module: null };

  function updateHeader() {
    const header   = document.getElementById("appHeader");
    const nav      = document.getElementById("mainNav");
    const userInfo = document.getElementById("userInfo");

    if (!Auth.isLoggedIn()) {
      header.style.display = "none";
      return;
    }

    header.style.display = "";

    // ── User info ──
    const user = Auth.getUser();
    userInfo.innerHTML = "";

    const nameSpan = document.createElement("span");
    nameSpan.className = "user-name";
    nameSpan.textContent = user?.name || "\u2014";
    userInfo.appendChild(nameSpan);

    const roleSpan = document.createElement("span");
    roleSpan.className = "user-role";
    roleSpan.textContent = Auth.getRole();
    userInfo.appendChild(roleSpan);

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "secondary btn-sm";
    logoutBtn.textContent = "Uitloggen";
    logoutBtn.addEventListener("click", () => {
      Auth.logout();
      Router.showView("login");
    });
    userInfo.appendChild(logoutBtn);

    // ── Nav tabs (built from registered views) ──
    nav.innerHTML = "";
    const role = Auth.getRole();

    Object.entries(views)
      .filter(([_, m]) => m.tab)
      .filter(([_, m]) => m.tab.roles.includes("*") || m.tab.roles.includes(role))
      .forEach(([name, m]) => {
        const btn = document.createElement("button");
        btn.className = "nav-tab" + (name === current.name ? " active" : "");
        btn.textContent = m.tab.label;
        btn.addEventListener("click", () => Router.showView(name));
        nav.appendChild(btn);
      });
  }

  return {
    register(name, module) {
      views[name] = module;
    },

    showView(name) {
      const module = views[name];
      if (!module) {
        console.warn(`[router] Unknown view: ${name}`);
        return;
      }

      // Unmount current view (let it save state)
      if (current.module?.unmount) current.module.unmount();

      // Mount new view
      const container = document.getElementById("viewContainer");
      container.innerHTML = module.template || "";
      current = { name, module };

      if (module.mount) module.mount(container);

      updateHeader();
    },

    init() {
      this.showView(Auth.isLoggedIn() ? "tasks" : "login");
    },
  };
})();
