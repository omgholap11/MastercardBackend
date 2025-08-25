import { useState } from "react";
import axios from "axios";

function DonationForm({ requirement, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    clothes: {},
    stationary: {},
    foods: {},
    furniture: {},
    electronics: {},
    clothesImages: [],
    stationaryImages: [],
    foodsImages: [],
    furnitureImages: [],
    electronicsImages: [],
  });

  const [errors, setErrors] = useState({});

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

  // Handle item quantity changes for specific categories
  const handleItemChange = (category, item, quantity) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: Math.max(0, parseInt(quantity) || 0),
      },
    }));
  };

  // Handle category-specific image uploads
  const handleImageUpload = (category, e) => {
    const files = Array.from(e.target.files);
    const imageKey = `${category}Images`;

    if (files.length + formData[imageKey].length > 5) {
      alert("You can upload maximum 5 images per category");
      return;
    }

    const newImages = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
      newImages.push(file);
    });

    setFormData((prev) => ({
      ...prev,
      [imageKey]: [...prev[imageKey], ...newImages],
    }));
  };

  // Remove image from specific category
  const removeImage = (category, index) => {
    const imageKey = `${category}Images`;
    setFormData((prev) => ({
      ...prev,
      [imageKey]: prev[imageKey].filter((_, i) => i !== index),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Check if at least one item is selected from any category
    const categories = ['clothes', 'stationary', 'foods', 'furniture', 'electronics'];
    let totalSelectedItems = 0;

    categories.forEach(category => {
      const categoryItems = formData[category] || {};
      const categoryCount = Object.values(categoryItems).reduce((sum, qty) => sum + qty, 0);
      totalSelectedItems += categoryCount;
    });

    if (totalSelectedItems === 0) {
      newErrors.selectedItems = "Please select at least one item to donate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add the requestId (requirement id)
      formDataToSend.append('requestId', requirement._id);
      
      // Add description
      formDataToSend.append('description', formData.description);
      
      // Add category-based donation data
      const donationData = {
        clothes: formData.clothes,
        stationary: formData.stationary,
        foods: formData.foods,
        furniture: formData.furniture,
        electronics: formData.electronics,
      };
      formDataToSend.append('donationData', JSON.stringify(donationData));
      
      // Add category-specific images
      const categories = ['clothes', 'stationary', 'foods', 'furniture', 'electronics'];
      categories.forEach(category => {
        const imageKey = `${category}Images`;
        formData[imageKey].forEach((image) => {
          formDataToSend.append(imageKey, image);
        });
      });

      console.log('=== FRONTEND REQUEST DEBUG ===');
      console.log('Request ID:', requirement._id);
      console.log('Description:', formData.description);
      console.log('Donation Data:', donationData);
      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }
      console.log('===============================');

      // Send request to backend with credentials
      const response = await axios.post(
        'http://localhost:5001/donation/create',
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        alert(
          "Thank you! Your donation has been submitted successfully. The organization will contact you soon."
        );
        onClose();
      }
    } catch (error) {
      console.error('=== FRONTEND ERROR DEBUG ===');
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      console.error('=============================');
      alert(
        error.response?.data?.message || 
        `Error submitting donation: ${error.response?.status || 'Unknown'} - ${error.message}`
      );
    }
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

          {/* Item Selection by Category */}
          <div>
            <h3 className="font-semibold text-secondary mb-3">
              Select Items to Donate
            </h3>
            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add any notes about your donation..."
                rows="3"
              />
            </div>
            
            {/* Category-based item selection */}
            {['clothes', 'stationary', 'foods', 'furniture', 'electronics'].map(category => {
              const categoryItems = requirement[category] || {};
              const categoryItemsArray = Object.keys(categoryItems);
              
              if (categoryItemsArray.length === 0) return null;
              
              return (
                <div key={category} className="mb-6">
                  <h4 className="font-medium text-lg text-secondary mb-3 capitalize">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {categoryItemsArray.map((itemName) => {
                      const itemData = categoryItems[itemName];
                      const requestedCount = itemData?.count || 0;
                      
                      return (
                        <div key={itemName} className="border border-accent rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">{itemName}</span>
                            <span className="text-sm text-gray-600">
                              Needed: {requestedCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="text-sm text-gray-600">Quantity:</label>
                            <input
                              type="number"
                              min="0"
                              max={requestedCount}
                              value={formData[category][itemName] || 0}
                              onChange={(e) => handleItemChange(category, itemName, e.target.value)}
                              className="w-20 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Image upload for this category */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images for {category} (Optional)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(category, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {formData[`${category}Images`].length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData[`${category}Images`].map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`${category} ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(category, index)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {errors.selectedItems && (
              <p className="text-red-500 text-sm mt-2">
                {errors.selectedItems}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-accent">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonationForm;
