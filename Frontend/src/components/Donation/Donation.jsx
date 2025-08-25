import { useState, useMemo } from "react";
import DonationCard from "./DonationCard";
import DonationForm from "./DonationForm";

// Dummy data for donation requirements
const dummyRequirements = [
  {
    id: 1,
    title: "School Supplies for Rural Children",
    organization: "Bright Future NGO",
    category: "stationary",
    description:
      "Help provide essential stationery items including notebooks, pens, pencils, and art supplies for 200 underprivileged children in rural areas.",
    itemsNeeded: ["Notebooks", "Pens", "Pencils", "Erasers", "Art Supplies"],
    urgency: "high",
    location: "Maharashtra, India",
    targetQuantity: 500,
    receivedQuantity: 200,
    unit: "items",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Winter Clothes for Homeless",
    organization: "Hope Foundation",
    category: "clothes",
    description:
      "Urgent need for warm winter clothing including jackets, sweaters, blankets, and shoes for homeless individuals during the cold season.",
    itemsNeeded: [
      "Winter Jackets",
      "Sweaters",
      "Blankets",
      "Warm Shoes",
      "Gloves",
    ],
    urgency: "urgent",
    location: "Delhi, India",
    targetQuantity: 150,
    receivedQuantity: 90,
    unit: "pieces",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Nutritious Meals for Street Children",
    organization: "Feeding Dreams Trust",
    category: "food",
    description:
      "Support our mission to provide daily nutritious meals for 150 street children. Your contribution will help us feed them healthy, balanced meals.",
    itemsNeeded: ["Rice", "Dal", "Vegetables", "Milk", "Fruits"],
    urgency: "medium",
    location: "Mumbai, India",
    targetQuantity: 1000,
    receivedQuantity: 600,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=400&h=250&fit=crop",
  },
  {
    id: 4,
    title: "Computer Lab Setup for Government School",
    organization: "Digital Education Initiative",
    category: "electronic",
    description:
      "Help us set up a computer lab with 20 computers, printers, and other accessories for a government school to bridge the digital divide.",
    itemsNeeded: ["Computers", "Monitors", "Keyboards", "Mice", "Printers"],
    urgency: "medium",
    location: "Bangalore, India",
    targetQuantity: 25,
    receivedQuantity: 10,
    unit: "devices",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68e2c77834?w=400&h=250&fit=crop",
  },
  {
    id: 5,
    title: "Classroom Furniture for New School",
    organization: "Education for All Society",
    category: "furniture",
    description:
      "We need desks, chairs, blackboards, and storage cabinets for our newly opened school serving 300+ children from low-income families.",
    itemsNeeded: [
      "Student Desks",
      "Chairs",
      "Blackboards",
      "Storage Cabinets",
      "Teacher's Table",
    ],
    urgency: "high",
    location: "Pune, India",
    targetQuantity: 80,
    receivedQuantity: 20,
    unit: "pieces",
    image:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop",
  },
  {
    id: 6,
    title: "Fresh Groceries for Elderly Care",
    organization: "Senior Citizens Welfare",
    category: "food",
    description:
      "Monthly grocery supplies for 50 senior citizens living alone. Help us provide them with fresh vegetables, grains, and essential food items.",
    itemsNeeded: ["Rice", "Wheat", "Vegetables", "Cooking Oil", "Spices"],
    urgency: "medium",
    location: "Chennai, India",
    targetQuantity: 300,
    receivedQuantity: 120,
    unit: "kg",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=250&fit=crop",
  },
  {
    id: 7,
    title: "School Uniforms for Underprivileged",
    organization: "Child Welfare Association",
    category: "clothes",
    description:
      "Provide school uniforms, shoes, and bags for 100 children from underprivileged families to ensure they can attend school with dignity.",
    itemsNeeded: [
      "School Uniforms",
      "School Shoes",
      "School Bags",
      "Socks",
      "Ties",
    ],
    urgency: "high",
    location: "Kolkata, India",
    targetQuantity: 100,
    receivedQuantity: 35,
    unit: "sets",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
  },
  {
    id: 8,
    title: "Tablets for Online Learning",
    organization: "Tech for Education",
    category: "electronic",
    description:
      "Provide tablets and internet connectivity for students who lack access to digital devices for online learning during challenging times.",
    itemsNeeded: [
      "Tablets",
      "Charging Cables",
      "Screen Protectors",
      "Cases",
      "Internet Dongles",
    ],
    urgency: "urgent",
    location: "Hyderabad, India",
    targetQuantity: 50,
    receivedQuantity: 18,
    unit: "devices",
    image:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=250&fit=crop",
  },
];

const categories = [
  { id: "all", name: "All Categories", icon: "🌟" },
  { id: "food", name: "Food", icon: "🍽️" },
  { id: "clothes", name: "Clothes", icon: "👕" },
  { id: "stationary", name: "Stationery", icon: "📚" },
  { id: "furniture", name: "Furniture", icon: "🪑" },
  { id: "electronic", name: "Electronics", icon: "💻" },
];

function Donation() {
  const [selectedCategories, setSelectedCategories] = useState(["all"]);
  const [sortBy, setSortBy] = useState("urgency");
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isDonationFormOpen, setIsDonationFormOpen] = useState(false);

  // Filter requirements based on selected categories
  const filteredRequirements = useMemo(() => {
    let filtered = dummyRequirements;

    if (!selectedCategories.includes("all")) {
      filtered = dummyRequirements.filter((req) =>
        selectedCategories.includes(req.category)
      );
    }

    // Sort the filtered results
    return filtered.sort((a, b) => {
      if (sortBy === "urgency") {
        const urgencyOrder = { urgent: 3, high: 2, medium: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      } else if (sortBy === "progress") {
        const progressA = (a.receivedQuantity / a.targetQuantity) * 100;
        const progressB = (b.receivedQuantity / b.targetQuantity) * 100;
        return progressA - progressB;
      }
      return 0;
    });
  }, [selectedCategories, sortBy]);

  const handleCategoryChange = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategories(["all"]);
    } else {
      const updatedCategories = selectedCategories.includes("all")
        ? [categoryId]
        : selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories.filter((id) => id !== "all"), categoryId];

      setSelectedCategories(
        updatedCategories.length === 0 ? ["all"] : updatedCategories
      );
    }
  };

  const handleOpenDonationForm = (requirement) => {
    setSelectedRequirement(requirement);
    setIsDonationFormOpen(true);
  };

  const handleCloseDonationForm = () => {
    setIsDonationFormOpen(false);
    setSelectedRequirement(null);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Support Those in Need
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from various categories and make a meaningful impact in
            someone's life
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-accent p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Category Filters */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary mb-4">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center gap-2 ${
                      selectedCategories.includes(category.id)
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-secondary border-gray-300 hover:border-primary hover:text-primary"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="lg:w-64">
              <label className="block text-lg font-semibold text-secondary mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="urgency">Urgency</option>
                <option value="progress">Collection Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-secondary">
              {filteredRequirements.length}
            </span>{" "}
            donation requests
            {!selectedCategories.includes("all") && (
              <span>
                {" "}
                in{" "}
                {selectedCategories
                  .map((id) => categories.find((cat) => cat.id === id)?.name)
                  .join(", ")}
              </span>
            )}
          </p>
        </div>

        {/* Donation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequirements.map((requirement) => (
            <DonationCard
              key={requirement.id}
              requirement={requirement}
              onOpenDonationForm={handleOpenDonationForm}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredRequirements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No donation requests found
            </h3>
            <p className="text-gray-600">
              Try selecting different categories or check back later.
            </p>
          </div>
        )}

        {/* Donation Form Modal */}
        {selectedRequirement && (
          <DonationForm
            requirement={selectedRequirement}
            isOpen={isDonationFormOpen}
            onClose={handleCloseDonationForm}
          />
        )}
      </div>
    </div>
  );
}

export default Donation;
