/**
 * Utility Functions for Care.xyz
 * 
 * This file contains helper functions used throughout the application.
 * These utilities help with class name handling, formatting, and validation.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names and merges Tailwind classes intelligently
 * This prevents conflicting Tailwind classes and ensures proper styling
 * 
 * @param {...any} inputs - Class names to combine
 * @returns {string} - Merged class names
 * 
 * Example:
 * cn("px-2 py-1", "px-4") => "py-1 px-4" (px-4 overwrites px-2)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price number to BDT currency format
 * 
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted price string
 * 
 * Example:
 * formatPrice(3000) => "৳3,000"
 */
export function formatPrice(amount) {
  return `৳${amount.toLocaleString("en-BD")}`;
}

/**
 * Calculates total cost based on duration and rate
 * 
 * @param {number} durationValue - Number of hours or days
 * @param {string} durationUnit - "hours" or "days"
 * @param {number} hourlyRate - Cost per hour
 * @param {number} dailyRate - Cost per day
 * @returns {number} - Total calculated cost
 */
export function calculateTotalCost(durationValue, durationUnit, hourlyRate, dailyRate) {
  if (durationUnit === "hours") {
    return durationValue * hourlyRate;
  } else {
    return durationValue * dailyRate;
  }
}

/**
 * Validates email format
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Requirements: minimum 6 characters, 1 uppercase, 1 lowercase
 * 
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and errors
 */
export function validatePassword(password) {
  const errors = [];
  
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Formats a date to readable string
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 * 
 * Example:
 * formatDate(new Date()) => "December 22, 2024"
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Truncates text to specified length with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Gets status badge color based on booking status
 * 
 * @param {string} status - Booking status
 * @returns {string} - Tailwind color classes
 */
export function getStatusColor(status) {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  };
  
  return colors[status] || "bg-gray-100 text-gray-800";
}
