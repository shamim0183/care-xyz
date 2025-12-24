/**
 * Profile Settings Page
 *
 * Protected page for users to update their profile including:
 * - Profile image (upload from device via ImgBB or paste URL)
 * - Name
 * - Contact number
 *
 * Route: /profile
 */

"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { FiCamera, FiLink, FiSave, FiUpload, FiUser } from "react-icons/fi"

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState("upload") // 'upload' or 'url'
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    profileImage: "",
  })

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile")
      setFormData({
        name: data.user.name || "",
        contact: data.user.contact || "",
        profileImage: data.user.profileImage || "",
      })
      setImagePreview(data.user.profileImage)
    } catch (error) {
      console.error("Fetch profile error:", error)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    // Validate file type
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
      toast.error(error.response?.data?.error || "Failed to upload image")
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await axios.put("/api/user/profile", formData)

      // Update session with new data
      await update({
        ...session,
        user: {
          ...session.user,
          name: data.user.name,
          image: data.user.profileImage,
        },
      })

      toast.success("Profile updated successfully!")
      setTimeout(() => router.push("/"), 1500)
    } catch (error) {
      console.error("Update error:", error)
      toast.error(error.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Toaster position="top-center" />

      {/* Soft Pink Background Section - Welleden Inspired */}
      <div className="min-h-screen bg-[#FFF0F3] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Serif Heading - Professional Look */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8 flex items-center gap-3">
              <FiUser className="text-[#C92C5C]" />
              Edit Profile
            </h1>

            {/* White Card Container with Shadow */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Section */}
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <FiCamera className="text-[#C92C5C]" />
                    Profile Picture
                  </h2>

                  {/* Image Preview - Refined Circle */}
                  <div className="flex justify-center my-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white ring-2 ring-[#C92C5C]/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#C92C5C] to-[#A82349] text-white flex items-center justify-center">
                            <FiUser className="text-5xl" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload Method Toggle - Burgundy Pills */}
                  <div className="flex gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setUploadMethod("upload")}
                      className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        uploadMethod === "upload"
                          ? "bg-[#C92C5C] text-white shadow-md"
                          : "bg-white text-[#C92C5C] border-2 border-[#C92C5C] hover:bg-[#C92C5C]/5"
                      }`}
                    >
                      <FiUpload className="text-lg" />
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod("url")}
                      className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                        uploadMethod === "url"
                          ? "bg-[#C92C5C] text-white shadow-md"
                          : "bg-white text-[#C92C5C] border-2 border-[#C92C5C] hover:bg-[#C92C5C]/5"
                      }`}
                    >
                      <FiLink className="text-lg" />
                      Image URL
                    </button>
                  </div>

                  {/* Upload from Device */}
                  {uploadMethod === "upload" && (
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Choose from device
                        </span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C92C5C] file:text-white hover:file:bg-[#A82349] file:cursor-pointer cursor-pointer border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors"
                        disabled={loading}
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Max size: 5MB. Hosted on ImgBB
                      </p>
                    </div>
                  )}

                  {/* Paste URL */}
                  {uploadMethod === "url" && (
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Image URL
                        </span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={formData.profileImage}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors text-gray-900 placeholder-gray-400"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Paste a direct image URL
                      </p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Basic Information Section */}
                <div>
                  <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6">
                    Basic Information
                  </h2>

                  <div className="space-y-5">
                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Full Name
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Contact Number
                        </span>
                      </label>
                      <input
                        type="tel"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#C92C5C] transition-colors text-gray-900 placeholder-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2">
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Email (Read-only)
                        </span>
                      </label>
                      <input
                        type="email"
                        value={session.user.email}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button - Burgundy Gradient */}
                <button
                  type="submit"
                  className="w-full bg-[#C92C5C] hover:bg-[#A82349] text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-xl" />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
