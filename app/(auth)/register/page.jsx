/**
 * Register Page
 *
 * Professional user registration page with modern design.
 */

"use client"

import axios from "axios"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FcGoogle } from "react-icons/fc"
import {
  FiCamera,
  FiCreditCard,
  FiLink,
  FiLock,
  FiMail,
  FiPhone,
  FiUpload,
  FiUser,
} from "react-icons/fi"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState("upload")
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    nidNo: "",
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  })

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSymbol: false,
  })

  // Check password requirements
  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setLoading(true)
    const uploadFormData = new FormData()
    uploadFormData.append("image", file)

    try {
      const { data } = await axios.post("/api/upload/image", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setFormData({ ...formData, profileImage: data.url })
      setImagePreview(data.url)
      toast.success("Image uploaded successfully!")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, profileImage: url })
    if (url) {
      setImagePreview(url)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Validate password in real-time
    if (name === "password") {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Call registration API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nidNo: formData.nidNo,
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          password: formData.password,
          profileImage: formData.profileImage,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Registration successful! Redirecting to login...")
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        toast.error(data.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast.error("Google sign-in failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <Toaster position="top-center" />

      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Care.xyz to book professional caregiving services
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* NID Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  NID Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiCreditCard className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nidNo"
                    placeholder="Enter NID"
                    value={formData.nidNo}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="contact"
                    placeholder="+880 1234-567890"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image Section - Welleden Style */}
            <div className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50/30">
              <label className="block mb-4">
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <FiCamera className="text-[#C92C5C]" />
                  Profile Picture (Optional)
                </span>
              </label>

              {/* Image Preview - Refined */}
              {imagePreview && (
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-4 border-white ring-2 ring-[#C92C5C]/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Upload Method Toggle - Burgundy Pills */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod("upload")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    uploadMethod === "upload"
                      ? "bg-[#C92C5C] text-white shadow-md"
                      : "bg-white text-[#C92C5C] border-2 border-[#C92C5C] hover:bg-[#C92C5C]/5"
                  }`}
                >
                  <FiUpload />
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("url")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    uploadMethod === "url"
                      ? "bg-[#C92C5C] text-white shadow-md"
                      : "bg-white text-[#C92C5C] border-2 border-[#C92C5C] hover:bg-[#C92C5C]/5"
                  }`}
                >
                  <FiLink />
                  URL
                </button>
              </div>

              {/* Upload from Device */}
              {uploadMethod === "upload" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C92C5C] file:text-white hover:file:bg-[#A82349] file:cursor-pointer cursor-pointer border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors"
                  disabled={loading}
                />
              )}

              {/* Paste URL */}
              {uploadMethod === "url" && (
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.profileImage}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors text-gray-900 dark:text-white placeholder-gray-400 bg-white dark:bg-gray-700 text-sm"
                />
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Max 5MB. Hosted on ImgBB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.minLength
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{passwordValidation.minLength ? "✓" : "○"}</span>
                      At least 6 characters
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasUppercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{passwordValidation.hasUppercase ? "✓" : "○"}</span>
                      One uppercase letter
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasLowercase
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{passwordValidation.hasLowercase ? "✓" : "○"}</span>
                      One lowercase letter
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasNumber
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{passwordValidation.hasNumber ? "✓" : "○"}</span>
                      One number
                    </p>
                    <p
                      className={`text-xs flex items-center gap-1 ${
                        passwordValidation.hasSymbol
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span>{passwordValidation.hasSymbol ? "✓" : "○"}</span>
                      One special symbol (!@#$%^&*...)
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      formData.password === formData.confirmPassword
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <span>
                      {formData.password === formData.confirmPassword
                        ? "✓"
                        : "✗"}
                    </span>
                    {formData.password === formData.confirmPassword
                      ? "Passwords match!"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button - Burgundy */}
            <button
              type="submit"
              className="w-full bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#C92C5C] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                OR
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            <FcGoogle size={24} />
            Sign up with Google
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#C92C5C] font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
