import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const adminLogin = (username, password) =>
  axios
    .post(`${BASE_URL}/api/admin/login`, { username, password })
    .then((r) => r.data);
