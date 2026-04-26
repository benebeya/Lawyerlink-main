const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export const initStorage = () => {
  // No-op for now as backend handles init
};

export const storage = {
  // Profiles
  getProfiles: async () => {
    const res = await fetch(`${API_URL}/profiles`);
    return res.json();
  },
  getProfile: async (id) => {
    const profiles = await storage.getProfiles();
    return profiles.find(p => p.id === id);
  },
  addProfile: async (profile) => {
    // Handled by signup in this mock
  },
  updateProfile: async (id, updates) => {
    const res = await fetch(`${API_URL}/profiles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Auth
  signUp: async (userData) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },
  login: async (credentials) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  // Requests
  getRequests: async (userId, role) => {
    const url = userId ? `${API_URL}/requests?userId=${userId}&role=${role}` : `${API_URL}/requests`;
    const res = await fetch(url);
    return res.json();
  },
  addRequest: async (request) => {
    const newRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    const res = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest)
    });
    return res.json();
  },
  updateRequest: async (id, updates) => {
    const res = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  // Notifications
  getNotifications: async (userId) => {
    const res = await fetch(`${API_URL}/notifications/${userId}`);
    return res.json();
  },
  addNotification: async (notification) => {
    const newNotif = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    const res = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotif)
    });
    return res.json();
  },
  markNotificationsRead: async (userId) => {
    const res = await fetch(`${API_URL}/notifications/read/${userId}`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Session (Still in localStorage for persistence)
  getSession: () => {
    const session = localStorage.getItem('lawyerlink_session');
    return session ? JSON.parse(session) : null;
  },
  setSession: (user) => localStorage.setItem('lawyerlink_session', JSON.stringify(user)),
  clearSession: () => localStorage.removeItem('lawyerlink_session')
};
