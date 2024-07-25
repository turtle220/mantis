// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',  // Directly target the API server
});

export default api;
