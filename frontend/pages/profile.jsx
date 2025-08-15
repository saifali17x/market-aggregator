import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "../components/Layout";
import { apiService } from "../services/api";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log("🔗 Loading profile from backend...");
      const response = await apiService.getProfile();
      console.log("📊 Profile response:", response);
      
      if (response.success && response.data) {
        setProfile(response.data);
        setFormData(response.data);
        setError(null);
      } else {
        console.error("❌ Profile API returned error:", response);
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("❌ Error loading profile:", err);
      setError(`Failed to load profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await apiService.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        setError(null);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error && !profile) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Profile - SeezyMart</title>
        <meta
          name="description"
          content="Manage your profile and account settings"
        />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 py-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={
                          profile?.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-gray-500">
                        Upload a new profile picture
                      </p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address?.street || ""}
                          onChange={(e) =>
                            handleAddressChange("street", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.address?.city || ""}
                          onChange={(e) =>
                            handleAddressChange("city", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.address?.state || ""}
                          onChange={(e) =>
                            handleAddressChange("state", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          value={formData.address?.zipCode || ""}
                          onChange={(e) =>
                            handleAddressChange("zipCode", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.address?.country || ""}
                          onChange={(e) =>
                            handleAddressChange("country", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifications"
                          checked={formData.preferences?.notifications || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                notifications: e.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="notifications"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Email notifications
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="newsletter"
                          checked={formData.preferences?.newsletter || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                newsletter: e.target.checked,
                              },
                            }))
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="newsletter"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Newsletter subscription
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                      <img
                        src={
                          profile?.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profile?.name}
                      </h3>
                      <p className="text-gray-500">{profile?.email}</p>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Full Name
                        </label>
                        <p className="text-gray-900">{profile?.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <p className="text-gray-900">{profile?.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Phone
                        </label>
                        <p className="text-gray-900">
                          {profile?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-900">
                        {profile?.address?.street}
                        <br />
                        {profile?.address?.city}, {profile?.address?.state}{" "}
                        {profile?.address?.zipCode}
                        <br />
                        {profile?.address?.country}
                      </p>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Preferences
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${
                            profile?.preferences?.notifications
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-gray-700">
                          Email notifications
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-3 ${
                            profile?.preferences?.newsletter
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></span>
                        <span className="text-gray-700">
                          Newsletter subscription
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Account Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-900">
                          {profile?.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
