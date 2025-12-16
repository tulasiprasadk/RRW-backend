// frontend/src/supplier/auth.js
import axios from "axios";

/**
 * Request OTP for supplier login
 */
export async function requestOtp({ email, phone }) {
  try {
    const response = await axios.post("/api/suppliers/request-otp", {
      email,
      phone,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to request OTP");
  }
}

/**
 * Verify OTP and login supplier
 */
export async function verifyOtp({ email, phone, otp }) {
  try {
    const response = await axios.post("/api/suppliers/verify-otp", {
      email,
      phone,
      otp,
    });
    
    if (response.data.supplier) {
      // Store supplier info in localStorage
      localStorage.setItem("supplierToken", response.data.token || "supplier-logged-in");
      localStorage.setItem("supplierId", response.data.supplier.id);
      localStorage.setItem("supplierData", JSON.stringify(response.data.supplier));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to verify OTP");
  }
}

/**
 * Login supplier with phone number (simple auth)
 */
export async function loginSupplier({ phone, email }) {
  try {
    const response = await axios.post("/api/suppliers/login", {
      phone: phone || email,
    });
    
    if (response.data.supplier) {
      // Store supplier info
      localStorage.setItem("supplierToken", "supplier-logged-in");
      localStorage.setItem("supplierId", response.data.supplier.id);
      localStorage.setItem("supplierData", JSON.stringify(response.data.supplier));
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Supplier not found");
  }
}

/**
 * Logout supplier
 */
export function logoutSupplier() {
  localStorage.removeItem("supplierToken");
  localStorage.removeItem("supplierId");
  localStorage.removeItem("supplierData");
}

/**
 * Check if supplier is logged in
 */
export function isSupplierLoggedIn() {
  return !!localStorage.getItem("supplierToken");
}

/**
 * Get current supplier data
 */
export function getCurrentSupplier() {
  const data = localStorage.getItem("supplierData");
  return data ? JSON.parse(data) : null;
}
