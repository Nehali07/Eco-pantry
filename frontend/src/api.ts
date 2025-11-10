import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// ---------- Pantry ----------
export async function fetchPantryItems(userId: string, token: string) {
  const response = await axios.get(`${API_BASE}/pantry/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function addPantryItem(item: any, token: string) {
  const response = await axios.post(`${API_BASE}/pantry/add`, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// ---------- Recipes ----------
export async function fetchRecipes() {
  const response = await axios.get(`${API_BASE}/recipes`);
  return response.data;
}

// ---------- Shopping List ----------
export async function fetchShoppingLists(userId: string, token: string) {
  const response = await axios.get(`${API_BASE}/shopping/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
