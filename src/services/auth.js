import { apiUrl } from "../config";
import { getToken } from "./storage";
import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/token`, {
      email,
      password,
    });

    const { access_token } = response.data;

    localStorage.setItem("token", access_token);

    return { success: true, token: access_token };
  } catch (error) {
    console.error("Ошибка входа:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Ошибка входа",
    };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
