import React, { useState } from "react";

const Recipient = () => {
  const [formData, setFormData] = useState({
    description: "",
    clothes: {},
    stationary: {},
    foods: {},
    furniture: {},
    electronics: {},
  });

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

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
    // here you can send formData to backend using axios/fetch
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Recipient Request Form
        </h1>

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

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-all"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipient;