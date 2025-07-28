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
    console.error("Photographer API Error:", error.response || error.message);
    // Don't show toast for network errors as requested
    return Promise.reject(error);
  }
);

// Photographer APIs
export const addPhotographer = async (
  { mandapId, photographerName, photographyTypes, printOption },
  sampleWork
) => {
  const formData = new FormData();
  formData.append("mandapId", mandapId);
  formData.append("photographerName", photographerName);
  formData.append("photographyTypes", JSON.stringify(photographyTypes));
  if (printOption) formData.append("printOption", JSON.stringify(printOption));
  if (sampleWork && Array.isArray(sampleWork)) {
    sampleWork.forEach((file) => formData.append("sampleWork", file));
  }
  const response = await api.post("/provider/add-photographer", formData);
  return response.data;
};

export const getAllPhotographers = async () => {
  try {
    const response = await api.get("/provider/get-all-photographers");
    return response.data.data.photographers || [];
  } catch (error) {
    return [];
  }
};

export const getPhotographers = async (mandapId) => {
  try {
    const response = await api.get(`/provider/get-all-photographer/${mandapId}`);
    return response.data.data.photographers || [];
  } catch (error) {
    return [];
  }
};

export const getPhotographerById = async (photographerId) => {
  const response = await api.get(`/provider/get-photographer/${photographerId}`);
  return response.data;
};

export const updatePhotographer = async (
  photographerId,
  { photographerName, photographyTypes, printOption },
  sampleWork
) => {
  const formData = new FormData();
  if (photographerName) formData.append("photographerName", photographerName);
  if (photographyTypes)
    formData.append("photographyTypes", JSON.stringify(photographyTypes));
  if (printOption) formData.append("printOption", JSON.stringify(printOption));
  if (sampleWork && Array.isArray(sampleWork)) {
    sampleWork.forEach((file) => formData.append("sampleWork", file));
  }
  const response = await api.put(
    `/provider/update-photographer/${photographerId}`,
    formData
  );
  return response.data;
};

export const deletePhotographer = async (photographerId) => {
  const response = await api.delete(`/provider/delete-photographer/${photographerId}`);
  return response.data;
};
