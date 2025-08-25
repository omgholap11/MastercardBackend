import { useState } from "react";

function DonationForm({ requirement, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    selectedItems: {},
    donationDate: "",
    donationTime: "",
    pickupAddress: "",
    message: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  // Calculate progress percentage
  const progressPercentage =
    (requirement.receivedQuantity / requirement.targetQuantity) * 100;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle item quantity changes
  const handleItemChange = (item, quantity) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [item]: Math.max(0, parseInt(quantity) || 0),
      },
    }));
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      newImages.push(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          file: file,
          url: e.target.result,
          name: file.name,
        });

        if (newPreviews.length === files.length) {
          setImagePreview((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  // Remove image
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.donorName.trim()) {
      newErrors.donorName = "Name is required";
    }

    if (!formData.donorEmail.trim()) {
      newErrors.donorEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.donorEmail)) {
      newErrors.donorEmail = "Invalid email format";
    }

    if (!formData.donorPhone.trim()) {
      newErrors.donorPhone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.donorPhone.replace(/\D/g, ""))) {
      newErrors.donorPhone = "Invalid phone number";
    }

    if (!formData.donationDate) {
      newErrors.donationDate = "Donation date is required";
    }

    if (!formData.donationTime) {
      newErrors.donationTime = "Donation time is required";
    }

    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = "Pickup address is required";
    }

    const selectedItemsCount = Object.values(formData.selectedItems).reduce(
      (sum, qty) => sum + qty,
      0
    );
    if (selectedItemsCount === 0) {
      newErrors.selectedItems = "Please select at least one item to donate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create form data for submission
    const submissionData = {
      requirementId: requirement.id,
      organizationName: requirement.organization,
      requirementTitle: requirement.title,
      donor: {
        name: formData.donorName,
        email: formData.donorEmail,
        phone: formData.donorPhone,
      },
      donation: {
        selectedItems: formData.selectedItems,
        totalItems: Object.values(formData.selectedItems).reduce(
          (sum, qty) => sum + qty,
          0
        ),
        scheduledDate: formData.donationDate,
        scheduledTime: formData.donationTime,
        pickupAddress: formData.pickupAddress,
        message: formData.message,
        images: formData.images,
      },
      submissionTimestamp: new Date().toISOString(),
    };

    // Here you would typically send this data to your backend
    console.log("Donation Form Data:", submissionData);

    // Show success message
    alert(
      "Thank you! Your donation request has been submitted successfully. The organization will contact you soon."
    );

    // Reset form and close
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-accent p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-2">
              Donate to: {requirement.title}
            </h2>
            <p className="text-gray-600">
              {requirement.organization} • {requirement.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Requirement Details */}
          <div className="bg-accent p-4 rounded-lg">
            <h3 className="font-semibold text-secondary mb-3">
              Current Requirement Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {requirement.targetQuantity - requirement.receivedQuantity}
                </div>
                <div className="text-sm text-gray-600">
                  {requirement.unit} Still Needed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {requirement.receivedQuantity}
                </div>
                <div className="text-sm text-gray-600">
                  {requirement.unit} Collected
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(progressPercentage)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>

            <p className="text-sm text-gray-700">{requirement.description}</p>
          </div>

          {/* Item Selection */}
          <div>
            <h3 className="font-semibold text-secondary mb-3">
              Select Items to Donate
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirement.itemsNeeded.map((item, index) => (
                <div
                  key={index}
                  className="border border-accent rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item}</span>
                    <span className="text-sm text-gray-600">
                      Needed: Multiple
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Quantity:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.selectedItems[item] || 0}
                      onChange={(e) => handleItemChange(item, e.target.value)}
                      className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
            {errors.selectedItems && (
              <p className="text-red-500 text-sm mt-2">
                {errors.selectedItems}
              </p>
            )}
          </div>

          {/* Donor Information */}
          <div>
            <h3 className="font-semibold text-secondary mb-3">
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.donorName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.donorName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donorName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.donorEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.donorEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donorEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="donorPhone"
                  value={formData.donorPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.donorPhone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.donorPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donorPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Donation Schedule */}
          <div>
            <h3 className="font-semibold text-secondary mb-3">
              Donation Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleInputChange}
                  min={today}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.donationDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.donationDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donationDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  name="donationTime"
                  value={formData.donationTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.donationTime ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.donationTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.donationTime}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Address *
            </label>
            <textarea
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.pickupAddress ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter complete address where items can be picked up"
            />
            {errors.pickupAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickupAddress}
              </p>
            )}
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Any special instructions or message for the organization"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images of Items (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can upload up to 5 images. Maximum file size: 5MB per image.
            </p>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-accent">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Submit Donation Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonationForm;
