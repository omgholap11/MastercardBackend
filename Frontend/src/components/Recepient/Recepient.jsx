import React, { useState } from "react";
import axios from "axios";

const Recipient = () => {
  const [formData, setFormData] = useState({
    description: "",
    clothes: {},
    stationary: {},
    foods: {},
    furniture: {},
    electronics: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitResponse, setSubmitResponse] = useState(null);

  const categories = ["clothes", "stationary", "foods", "furniture", "electronics"];

  // Subcategories for each category based on the schema examples
  const subcategories = {
    clothes: ["sweater", "jacket", "shirt", "pants", "dress", "shoes", "socks", "underwear", "coat", "hoodie"],
    stationary: ["notebooks", "pens", "pencils", "erasers", "rulers", "markers", "highlighters", "staplers", "scissors", "folders"],
    foods: ["rice", "wheat", "lentils", "beans", "oil", "sugar", "salt", "flour", "pasta", "canned goods"],
    furniture: ["chairs", "tables", "beds", "wardrobes", "sofas", "desks", "shelves", "cabinets", "drawers", "mattresses"],
    electronics: ["laptops", "phones", "tablets", "monitors", "keyboards", "mice", "speakers", "headphones", "chargers", "cables"]
  };

  const handleInputChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...(prev[category][field] || { count: 0 }),
          count: Number(value),
        },
      },
    }));
  };

  const handleAddItem = (category, itemName) => {
    if (itemName && !formData[category][itemName]) {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [itemName]: { count: 0 },
        },
      }));
    }
  };

  const handleRemoveItem = (category, itemName) => {
    setFormData((prev) => {
      const newCategory = { ...prev[category] };
      delete newCategory[itemName];
      return {
        ...prev,
        [category]: newCategory,
      };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setSubmitResponse(null);

    // Validate that at least one category has items
    const hasItems = Object.values(formData).some((category, index) => {
      if (index === 0) return false; // Skip description field
      return category && Object.keys(category).length > 0;
    });

    if (!hasItems) {
      setError("Please add at least one item to your request.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting request data:", formData);

      const response = await axios.post(
        "http://localhost:5001/request/create",
        {
          description: formData.description,
          clothes: formData.clothes,
          stationary: formData.stationary,
          foods: formData.foods,
          furniture: formData.furniture,
          electronics: formData.electronics,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // For authentication cookies
        }
      );

      console.log("Request submitted successfully:", response.data);
      setSuccess("Your request has been submitted successfully!");
      setSubmitResponse(response.data);

      // Reset form after successful submission
      setFormData({
        description: "",
        clothes: {},
        stationary: {},
        foods: {},
        furniture: {},
        electronics: {},
      });

    } catch (error) {
      console.error("Error submitting request:", error);
      
      if (error.response) {
        // Server responded with an error status
        const errorMessage = error.response.data?.error || error.response.data?.message || "Server error occurred";
        setError(`Failed to submit request: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error: Unable to connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        setError("An unexpected error occurred while submitting your request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Recipient Request Form
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              {success}
            </div>
            {submitResponse && (
              <div className="mt-2 text-sm">
                <strong>Request ID:</strong> {submitResponse.request?._id}
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-gray-800 font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Brief description of your needs"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Categories */}
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-semibold text-orange-500 capitalize mb-4">
                {category}
              </h2>

              <div className="flex gap-2 mb-4">
                <select
                  id={`${category}-select`}
                  className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select {category} item...</option>
                  {subcategories[category]
                    .filter(item => !formData[category][item])
                    .map((item) => (
                      <option key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const selectElement = document.getElementById(`${category}-select`);
                    if (selectElement.value) {
                      handleAddItem(category, selectElement.value);
                      selectElement.value = "";
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Add
                </button>
              </div>

              {/* Render existing items */}
              <div className="space-y-3">
                {Object.keys(formData[category]).map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 capitalize">{item}</p>
                      <input
                        type="number"
                        placeholder="Count"
                        min="0"
                        className="mt-2 p-2 border rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData[category][item].count}
                        onChange={(e) =>
                          handleInputChange(
                            category,
                            item,
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(category, item)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {Object.keys(formData[category]).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No {category} items added yet. Select items from the dropdown above.
                </p>
              )}
            </div>
          ))}

          {/* Request Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Request Summary</h3>
            {Object.entries(formData).map(([category, items]) => {
              if (category === 'description' || !items || Object.keys(items).length === 0) return null;
              
              const totalItems = Object.values(items).reduce((sum, item) => sum + (item.count || 0), 0);
              
              return (
                <div key={category} className="mb-2">
                  <span className="font-medium text-blue-700 capitalize">{category}:</span>
                  <span className="ml-2 text-blue-600">
                    {Object.entries(items).map(([itemName, itemData]) => 
                      `${itemName} (${itemData.count})`
                    ).join(', ')}
                  </span>
                  <span className="ml-2 text-sm text-blue-500">
                    Total: {totalItems} items
                  </span>
                </div>
              );
            })}
            
            {Object.values(formData).every((category, index) => 
              index === 0 || !category || Object.keys(category).length === 0
            ) && (
              <p className="text-blue-600 italic">No items added yet. Please add items to see summary.</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold shadow-md transition-all ${
                loading
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Request...
                </div>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipient;