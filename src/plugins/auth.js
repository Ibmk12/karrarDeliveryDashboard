import Vue from "vue";
import axios from "axios";
import { Config } from "@/services/Config";

/**
 * Who is signed in (role) and what they may see.
 *  - ADMIN: every page
 *  - USER : no Dashboard, Users or Traders Financial Report
 *
 * The role is read from the JWT access token: a `role` / `roles` /
 * `authorities` claim if the token has one; otherwise the token's subject
 * (the user's phone number) is looked up once in the users list.
 * No backend change is needed.
 *
 * Note: this only hides menus and blocks the pages in the browser — the API
 * itself must also check the role to really protect the data.
 */
const KEY = "karrar.role";

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
}

function readProfile() {
  try {
    return JSON.parse(localStorage.getItem("karrar.profile") || "null");
  } catch (e) {
    return null;
  }
}

export const authState = Vue.observable({ role: read(), profile: readProfile() });

/** Signed-in user's display info: { name, phone, role } (looked up once from the users list). */
export function setProfile(profile) {
  if (!profile) profileFresh = false;
  authState.profile = profile || null;
  try {
    if (profile) localStorage.setItem("karrar.profile", JSON.stringify(profile));
    else localStorage.removeItem("karrar.profile");
  } catch (e) {
    /* ignore */
  }
}

export function setRole(role) {
  authState.role = role ? String(role).toUpperCase() : null;
  try {
    if (authState.role) localStorage.setItem(KEY, authState.role);
    else localStorage.removeItem(KEY);
  } catch (e) {
    /* ignore storage errors */
  }
}

export function clearRole() {
  setRole(null);
  setProfile(null);
}

let profilePending = null;
let profileFresh = false;

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

/**
 * The signed-in user, from GET /users/me (name, phone, role; never the password).
 * Until the backend with /users/me is deployed, falls back to finding the phone
 * in GET /users. A 401/403 is passed on to the caller.
 */
function fetchMe(phone) {
  return axios
    .get(`${Config.users_url()}/me`, { headers: authHeader() })
    .then((res) => (res.data && res.data.data) || res.data || null)
    .catch((err) => {
      const status = err && err.response && err.response.status;
      if (status === 401 || status === 403 || !err.response) throw err;
      // older backend: "/users/me" doesn't exist yet
      return axios.get(`${Config.users_url()}?size=2000`, { headers: authHeader() }).then((res) => {
        const body = res.data;
        const list = Array.isArray(body) ? body : (body && body.data) || [];
        return list.find((u) => String(u.phone) === String(phone)) || null;
      });
    });
}

/**
 * First and last name, each word starting with a capital: "ibrahim KHALID" -> "Ibrahim Khalid".
 * The middle name is used only when there is no last name.
 */
function fullName(first, last, middle) {
  const second = String(last || "").trim() || String(middle || "").trim();
  return [first, second]
    .map((p) => String(p || "").trim())
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .map((w) => w.charAt(0).toLocaleUpperCase() + w.slice(1).toLocaleLowerCase())
    .join(" ");
}

/** "ROLE_ADMIN" / "admin" -> "ADMIN" */
const roleName = (r) => (r ? String(r).toUpperCase().replace(/^ROLE_/, "") : null);

/** Load the signed-in user's name for the top bar (falls back to the phone number). */
export function ensureProfile() {
  const claims = tokenClaims();
  const phone = claims && claims.sub;
  if (!phone) return Promise.resolve(null);
  const cached = authState.profile && String(authState.profile.phone) === String(phone) ? authState.profile : null;
  // the saved name shows at once; it is checked against the server once per app load
  if (cached && profileFresh) return Promise.resolve(cached);
  if (profilePending) return profilePending;
  profilePending = fetchMe(phone)
    .then((me) => {
      const name = me ? fullName(me.firstName, me.lastName, me.middleName) : "";
      setProfile({ name: name || (cached && cached.name) || "", phone, role: roleName(me && me.role) || authState.role || null });
      profileFresh = true;
      return authState.profile;
    })
    .catch(() => {
      if (!cached) setProfile({ name: "", phone, role: authState.role });
      return authState.profile;
    })
    .finally(() => {
      profilePending = null;
    });
  return profilePending;
}

export const isAdmin = () => authState.role === "ADMIN";

function tokenClaims() {
  try {
    const token = localStorage.getItem("token");
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch (e) {
    return null;
  }
}

/** Role claim inside the JWT, if the backend puts one there (ROLE_ADMIN, ADMIN, ["ROLE_ADMIN"], ...). */
function roleFromToken(claims) {
  if (!claims) return null;
  const raw = claims.role || claims.roles || claims.authorities || claims.scope;
  const list = Array.isArray(raw) ? raw : raw ? String(raw).split(/[ ,]+/) : [];
  const names = list.map((r) => String((r && r.authority) || r).toUpperCase().replace(/^ROLE_/, ""));
  if (names.includes("ADMIN")) return "ADMIN";
  return names.length ? names[0] : null;
}

/** Role from the current access token, read synchronously (null if the token has no roles claim). */
export function roleFromCurrentToken() {
  return roleFromToken(tokenClaims());
}

let pending = null;

/** Resolve the current user's role (cached). Returns "ADMIN", "USER" or null. */
export function ensureRole() {
  if (authState.role) return Promise.resolve(authState.role);
  if (pending) return pending;
  const claims = tokenClaims();
  const fromToken = roleFromToken(claims);
  if (fromToken) {
    setRole(fromToken);
    return Promise.resolve(authState.role);
  }
  const phone = claims && claims.sub;
  if (!phone) return Promise.resolve(null);

  pending = fetchMe(phone)
    .then((me) => {
      setRole(roleName(me && me.role) || "USER");
      return authState.role;
    })
    .catch((err) => {
      // not allowed => certainly not an admin
      if (err && err.response && (err.response.status === 401 || err.response.status === 403)) {
        setRole("USER");
        return "USER";
      }
      return null; // network problem: don't remember, try again later
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export default {
  install(V) {
    Object.defineProperty(V.prototype, "$isAdmin", {
      get() {
        return authState.role === "ADMIN";
      },
    });
    Object.defineProperty(V.prototype, "$profile", {
      get() {
        return authState.profile;
      },
    });
    Object.defineProperty(V.prototype, "$role", {
      get() {
        return authState.role;
      },
    });
  },
};
