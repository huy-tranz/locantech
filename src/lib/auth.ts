export interface AuthUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  createdAt: string;
  avatar?: string;
}

export interface AuthSession {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  avatar?: string;
}

const USERS_STORAGE_KEY = "locan_users";
const AUTH_STORAGE_KEY = "locan_auth_user";
const AUTH_SESSION_KEY = "locan_auth_user_session";
const AUTH_EVENT_NAME = "locan-auth-changed";

function hasWindow() {
  return typeof window !== "undefined";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function toSessionUser(user: AuthUser): AuthSession {
  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar,
  };
}

function emitAuthChanged() {
  if (!hasWindow()) return;
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
}

function persistCurrentSession(sessionUser: AuthSession | null) {
  if (!hasWindow()) return;

  if (!sessionUser) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    emitAuthChanged();
    return;
  }

  if (localStorage.getItem(AUTH_STORAGE_KEY)) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  }

  if (sessionStorage.getItem(AUTH_SESSION_KEY)) {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
  }

  emitAuthChanged();
}

export function getStoredUsers(): AuthUser[] {
  if (!hasWindow()) return [];

  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: AuthUser[]) {
  if (!hasWindow()) return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function registerUser(input: {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}) {
  const users = getStoredUsers();
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);

  if (users.some((user) => normalizeEmail(user.email) === email)) {
    return { ok: false as const, message: "Email này đã được đăng ký." };
  }

  if (users.some((user) => normalizePhone(user.phone) === phone)) {
    return { ok: false as const, message: "Số điện thoại này đã được đăng kí." };
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    phone,
    email,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, user]);
  return { ok: true as const, user: toSessionUser(user) };
}

export function loginUser(identifier: string, password: string, remember = true) {
  const users = getStoredUsers();
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const normalizedPhone = normalizePhone(identifier);

  const user = users.find((item) => {
    const sameEmail = normalizeEmail(item.email) === normalizedIdentifier;
    const samePhone = normalizedPhone.length > 0 && normalizePhone(item.phone) === normalizedPhone;
    return sameEmail || samePhone;
  });

  if (!user || user.password !== password) {
    return { ok: false as const, message: "Thông tin đăng nhập không chính xác." };
  }

  const sessionUser = toSessionUser(user);

  if (hasWindow()) {
    const targetStorage = remember ? localStorage : sessionStorage;
    const clearStorage = remember ? sessionStorage : localStorage;
    const targetKey = remember ? AUTH_STORAGE_KEY : AUTH_SESSION_KEY;
    const clearKey = remember ? AUTH_SESSION_KEY : AUTH_STORAGE_KEY;

    targetStorage.setItem(targetKey, JSON.stringify(sessionUser));
    clearStorage.removeItem(clearKey);
  }

  emitAuthChanged();
  return { ok: true as const, user: sessionUser };
}

export function getCurrentUser(): AuthSession | null {
  if (!hasWindow()) return null;

  const raw = localStorage.getItem(AUTH_STORAGE_KEY) ?? sessionStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession> & { name?: string };

    const normalized: AuthSession = {
      id: parsed.id ?? "",
      fullName: parsed.fullName ?? parsed.name ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
      avatar: parsed.avatar,
    };

    if (!normalized.id && !normalized.email) return null;
    return normalized;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  if (!hasWindow()) return false;
  return localStorage.getItem('locan_access_token') !== null;
}

export function updateCurrentUserProfile(input: {
  fullName: string;
  phone: string;
  email: string;
  avatar?: string;
}) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { ok: false as const, message: "Ban chua dang nhap." };
  }

  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const users = getStoredUsers();

  if (users.some((user) => user.id !== currentUser.id && normalizeEmail(user.email) === email)) {
    return { ok: false as const, message: "Email này đã được sử dụng bởi tài khoản khác." };
  }

  if (users.some((user) => user.id !== currentUser.id && normalizePhone(user.phone) === phone)) {
    return { ok: false as const, message: "Số điện thoại này đã được sử dụng bởi tài khoản khác." };
  }

  let updatedUser: AuthUser | null = null;
  const updatedUsers = users.map((user) => {
    if (user.id !== currentUser.id) return user;

    updatedUser = {
      ...user,
      fullName: input.fullName.trim(),
      phone,
      email,
      avatar: input.avatar,
    };

    return updatedUser;
  });

  if (!updatedUser) {
    return { ok: false as const, message: "Không tìm thấy tài khoản để cập nhật." };
  }

  saveStoredUsers(updatedUsers);
  const sessionUser = toSessionUser(updatedUser);
  persistCurrentSession(sessionUser);
  return { ok: true as const, user: sessionUser };
}

export function changeCurrentUserPassword(currentPassword: string, newPassword: string) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { ok: false as const, message: "Bạn chưa đăng nhập." };
  }

  let changed = false;
  const updatedUsers = getStoredUsers().map((user) => {
    if (user.id !== currentUser.id) return user;
    if (user.password !== currentPassword) return user;

    changed = true;
    return { ...user, password: newPassword };
  });

  if (!changed) {
    return { ok: false as const, message: "Mật khẩu hiện tại không đúng." };
  }

  saveStoredUsers(updatedUsers);
  persistCurrentSession(getCurrentUser());
  return { ok: true as const };
}

export function logoutUser() {
  if (!hasWindow()) return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  emitAuthChanged();
}

export function subscribeAuthChange(callback: () => void) {
  if (!hasWindow()) return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if ([AUTH_STORAGE_KEY, AUTH_SESSION_KEY, 'locan_access_token', 'locan_refresh_token'].includes(event.key ?? "")) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_EVENT_NAME, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_EVENT_NAME, callback);
  };
}
