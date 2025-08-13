import { useState } from "react";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Building,
} from "lucide-react";

export default function SellerOnboard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sellerName: "",
    contactEmail: "",
    contactPhone: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    listingId: "",
    listingTitle: "",
    listingDescription: "",
    listingPrice: "",
    listingCurrency: "USD",
    listingCondition: "new",
    proofImage: null,
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.sellerName.trim()) {
      newErrors.sellerName = "Seller name is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State/Province is required";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (!formData.listingTitle.trim()) {
      newErrors.listingTitle = "Listing title is required";
    }

    if (!formData.listingDescription.trim()) {
      newErrors.listingDescription = "Listing description is required";
    }

    if (!formData.listingPrice || parseFloat(formData.listingPrice) <= 0) {
      newErrors.listingPrice = "Valid listing price is required";
    }

    if (!formData.proofImage) {
      newErrors.proofImage = "Proof image is required";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "proofImage" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== "proofImage") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/sellers/claim", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            "Your listing claim has been submitted successfully! We'll review it and get back to you within 24-48 hours.",
          claimId: data.claimId,
        });

        // Reset form after successful submission
        setFormData({
          sellerName: "",
          contactEmail: "",
          contactPhone: "",
          businessName: "",
          address: "",
          city: "",
          state: "",
          country: "",
          listingId: "",
          listingTitle: "",
          listingDescription: "",
          listingPrice: "",
          listingCurrency: "USD",
          listingCondition: "new",
          proofImage: null,
          termsAccepted: false,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit claim. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          proofImage: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          proofImage: "Image file size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        proofImage: file,
      }));

      // Clear error
      if (errors.proofImage) {
        setErrors((prev) => ({
          ...prev,
          proofImage: "",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Seller Onboarding
            </h1>
            <p className="text-lg text-gray-600">
              Claim your listing or submit a new one for verification
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {submitStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              )}
              <div>
                <p
                  className={`font-medium ${
                    submitStatus.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </p>
                {submitStatus.claimId && (
                  <p className="text-sm text-green-700 mt-1">
                    Claim ID: {submitStatus.claimId}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seller Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Seller Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Name *
                  </label>
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.sellerName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.sellerName && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.sellerName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company or business name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contactEmail
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.contactPhone
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.contactPhone && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.state ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.country ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Listing Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Listing Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Listing ID
                  </label>
                  <input
                    type="text"
                    name="listingId"
                    value={formData.listingId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave blank for new listings"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If you're claiming an existing listing, enter its ID here
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    name="listingTitle"
                    value={formData.listingTitle}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.listingTitle ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Product title"
                  />
                  {errors.listingTitle && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.listingTitle}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Listing Description *
                  </label>
                  <textarea
                    name="listingDescription"
                    value={formData.listingDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.listingDescription
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Describe your product or service..."
                  />
                  {errors.listingDescription && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.listingDescription}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="listingPrice"
                      value={formData.listingPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.listingPrice
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    <select
                      name="listingCurrency"
                      value={formData.listingCurrency}
                      onChange={handleInputChange}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-100 border-0 text-sm px-2 py-1 rounded"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                  {errors.listingPrice && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.listingPrice}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    name="listingCondition"
                    value={formData.listingCondition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="for-parts">For Parts</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Proof Image */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Proof of Ownership
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Proof Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="proofImage"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="proofImage"
                  />
                  <label htmlFor="proofImage" className="cursor-pointer">
                    {formData.proofImage ? (
                      <div>
                        <img
                          src={URL.createObjectURL(formData.proofImage)}
                          alt="Proof image preview"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                        />
                        <p className="text-sm text-gray-600">
                          {formData.proofImage.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.proofImage && (
                  <p className="text-red-600 text-sm mt-2">
                    {errors.proofImage}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image that proves you own or have rights to sell
                  this item (e.g., receipt, ownership document, product photo)
                </p>
              </div>
            </div>

            {/* Terms and Submit */}
            <div>
              <div className="flex items-start mb-6">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Privacy Policy
                  </a>
                  . I confirm that I have the right to sell this item and the
                  information provided is accurate.
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-600 text-sm mb-4">
                  {errors.termsAccepted}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Claim"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            What Happens Next?
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>• We'll review your submission within 24-48 hours</p>
            <p>• You'll receive an email confirmation with your claim ID</p>
            <p>• Our team will verify the proof of ownership</p>
            <p>
              • Once approved, your listing will be published on our marketplace
            </p>
            <p>• We may contact you for additional verification if needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
