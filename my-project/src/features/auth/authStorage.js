export const loadUser = () => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveUser = (user) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch {
    // ignore storage errors in the demo app
  }
};

export const clearUser = () => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem('user');
  } catch {
    // ignore storage errors in the demo app
  }
};

