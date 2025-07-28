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
    console.error("Booking API Error:", error.response || error.message);
    // Don't show toast for network errors as requested
    return Promise.reject(error);
  }
);
// Booking APIs
export const getBookingsByProvider = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/provider/bookings?page=${page}&limit=${limit}`);
    return response.data.data.bookings || [];
  } catch (error) {
    return [];
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/booking/${bookingId}`);
    return response.data.data.booking;
  } catch (error) {
    return null;
  }
};

export const updateBooking = async (bookingId, bookingData) => {
  const response = await api.put(`/booking/${bookingId}`, bookingData);
  return response.data;
};

export const deleteBooking = async (bookingId) => {
  const response = await api.delete(`/booking/${bookingId}`);
  return response.data;
};

export const completePayment = async (bookingId, paymentAmount) => {
  const response = await api.post(`/booking/complete-payment/${bookingId}`, {
    paymentAmount
  });
  return response.data;
};
