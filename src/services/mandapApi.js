import axios from "axios";
import toast from "react-hot-toast";
import { getProviderToken } from "../utils/providerCookieUtils";

const BASE_URL = "http://localhost:4000/api";

const providerApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

providerApi.interceptors.request.use((config) => {
  const providerToken = getProviderToken();
  if (providerToken) {
    config.headers.Authorization = `Bearer ${providerToken}`;
  }
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  return config;
});

providerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Mandap API Error:", error.response || error.message);
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else if (error.message) {
      toast.error("Network error. Please try again.");
    }
    return Promise.reject(error);
  }
);

// Mandap APIs
export const createMandap = async (
  {
    mandapName,
    mandapDesc,
    fullAddress,
    city,
    state,
    pinCode,
    availableDates,
    venueType,
    penaltyChargesPerHour,
    cancellationPolicy,
    guestCapacity,
    venuePricing,
    securityDeposit,
    securityDepositType,
    amenities,
    outdoorFacilities,
    paymentOptions,
    isExternalCateringAllowed,
    advancePayment,
  },
  venueImages
) => {
  const formData = new FormData();
  formData.append("mandapName", mandapName);
  formData.append("mandapDesc", mandapDesc);
  formData.append("fullAddress", fullAddress);
  formData.append("city", city);
  formData.append("state", state);
  formData.append("pinCode", pinCode);
  formData.append("availableDates", JSON.stringify(availableDates));
  formData.append("venueType", JSON.stringify(venueType));
  formData.append("penaltyChargesPerHour", penaltyChargesPerHour);
  formData.append("cancellationPolicy", cancellationPolicy);
  formData.append("guestCapacity", guestCapacity);
  formData.append("venuePricing", venuePricing);
  formData.append("securityDeposit", securityDeposit);
  formData.append("securityDepositType", securityDepositType);
  formData.append("amenities", JSON.stringify(amenities));
  formData.append("outdoorFacilities", JSON.stringify(outdoorFacilities));
  formData.append("paymentOptions", JSON.stringify(paymentOptions));
  formData.append("isExternalCateringAllowed", isExternalCateringAllowed);
  formData.append("advancePayment", advancePayment);
  if (venueImages && Array.isArray(venueImages)) {
    venueImages.forEach((image) => formData.append("venueImages", image));
  }
  const response = await api.post("/mandap", formData);
  return response.data;
};

export const getProviderMandaps = async () => {
  const response = await api.get("/get-mandap");
  return response.data;
};

export const updateMandap = async (mandapId, mandapData, venueImages) => {
  const formData = new FormData();
  Object.keys(mandapData).forEach((key) => {
    if (Array.isArray(mandapData[key]) || typeof mandapData[key] === "object") {
      formData.append(key, JSON.stringify(mandapData[key]));
    } else {
      formData.append(key, mandapData[key]);
    }
  });
  if (venueImages && Array.isArray(venueImages)) {
    venueImages.forEach((image) => formData.append("venueImages", image));
  }
  const response = await api.put(`/update-mandap/${mandapId}`, formData);
  return response.data;
};

export const deleteMandap = async (mandapId) => {
  const response = await api.delete(`/delete-mandap/${mandapId}`);
  return response.data;
};

export const getMandapById = async (mandapId) => {
  const response = await api.get(`/mandap/get-mandap/${mandapId}`);
  return response.data;
};
