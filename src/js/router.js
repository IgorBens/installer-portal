// ===== VIEW ROUTER =====
//
// Manages which view is visible and builds the nav bar.
// Role-based: call getTabsForRole() to control what each role sees.
//
// Views:  login | tasks | taskDetail
// (add more views here as you build them — dashboard, settings, etc.)

const Router = (() => {
  let currentView = null;

  function hideAllViews() {
    document.querySelectorAll(".view").forEach(v => (v.style.display = "none"));
  }

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
    nameSpan.textContent = user?.name || "—";
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

    // ── Nav tabs (role-based) ──
    nav.innerHTML = "";
    const tabs = getTabsForRole(Auth.getRole());
    tabs.forEach(tab => {
      const btn = document.createElement("button");
      btn.className = "nav-tab" + (tab.view === currentView ? " active" : "");
      btn.textContent = tab.label;
      btn.addEventListener("click", () => Router.showView(tab.view));
      nav.appendChild(btn);
    });
  }

  function getTabsForRole(role) {
    // Everyone gets tasks
    const tabs = [
      { label: "Taken", view: "tasks" },
    ];

    // Extend for other roles:
    // if (role === "admin" || role === "projectleider") {
    //   tabs.push({ label: "Dashboard", view: "dashboard" });
    //   tabs.push({ label: "Instellingen", view: "settings" });
    // }

    return tabs;
  }

  return {
    showView(name) {
      currentView = name;
      hideAllViews();

      const el = document.getElementById(`view-${name}`);
      if (el) el.style.display = "";

      updateHeader();

      // Auto-load tasks when navigating to the tasks view
      if (name === "tasks" && Auth.isLoggedIn()) {
        TaskList.fetch();
      }
    },

    init() {
      this.showView(Auth.isLoggedIn() ? "tasks" : "login");
    },
  };
})();
