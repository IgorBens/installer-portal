// ===== AUTHENTICATION (JWT via Keychain) =====
//
// Flow:
//   1. POST { username, password } → AUTH_URL
//   2. Keychain returns { token: "jwt…", user: { id, name, role } }
//   3. Token stored in localStorage, sent as Bearer header on every API call
//   4. Role determines which views/tabs the user can see
//
// Expected roles: "installer", "admin", "projectleider"
// Default role (if not returned): "installer"

const Auth = (() => {
  const TOKEN_KEY = "auth_token";
  const USER_KEY  = "auth_user";

  return {
    getToken() {
      return localStorage.getItem(TOKEN_KEY);
    },

    getUser() {
      try { return JSON.parse(localStorage.getItem(USER_KEY)); }
      catch { return null; }
    },

    getRole() {
      return this.getUser()?.role || "installer";
    },

    isLoggedIn() {
      return !!this.getToken();
    },

    async login(username, password) {
      const res = await fetch(CONFIG.AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login mislukt");
      }

      if (!data.token) {
        throw new Error("Geen token ontvangen van server");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user || { name: username }));
      return data;
    },

    logout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },

    authHeader() {
      const token = this.getToken();
      return token ? `Bearer ${token}` : "";
    },
  };
})();
