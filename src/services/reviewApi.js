import axios from "axios";
import toast from "react-hot-toast";
import { getProviderToken } from "../utils/providerCookieUtils";

const BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const providerToken = getProviderToken();
  if (providerToken) {
    config.headers.Authorization = `Bearer ${providerToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Review API Error:", error.response || error.message);
    // Don't show toast for network errors as requested
    return Promise.reject(error);
  }
);

// Review APIs
export const getReviewsByMandapId = async (mandapId) => {
  try {
    const response = await api.get(`/provider/get-review/${mandapId}`);
    return response.data.data.reviews || [];
  } catch (error) {
    return [];
  }
};

export const getAllReviewsByProvider = async () => {
  try {
    const response = await api.get(`/provider/get-all-reviews`);
    return response.data.data.reviews || [];
  } catch (error) {
    return [];
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const response = await api.get(`/user/review/${reviewId}`);
    return response.data.data.review;
  } catch (error) {
    return null;
  }
};
