import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Dummy data for urgent requirements
const urgentRequirements = [
  {
    id: 1,
    organization: "Children's Hope Foundation",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&h=300&fit=crop",
    title: "School Supplies for 200 Children",
    description:
      "We urgently need notebooks, pens, pencils, and textbooks for 200 underprivileged children starting their new academic year.",
    category: "Stationery",
    needTillDate: "2025-09-15",
    priority: "High",
    targetQuantity: 200,
    receivedQuantity: 45,
  },
  {
    id: 2,
    organization: "Mumbai Food Bank",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&h=300&fit=crop",
    title: "Emergency Food Packages",
    description:
      "Seeking donations of rice, dal, oil, and essential groceries for 150 families affected by recent floods.",
    category: "Food",
    needTillDate: "2025-08-30",
    priority: "Critical",
    targetQuantity: 150,
    receivedQuantity: 30,
  },
  {
    id: 3,
    organization: "Senior Care Home",
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=300&fit=crop",
    title: "Winter Clothing Drive",
    description:
      "We need warm clothes, blankets, and sweaters for 80 senior citizens to help them stay comfortable during winter.",
    category: "Clothes",
    needTillDate: "2025-10-01",
    priority: "High",
    targetQuantity: 80,
    receivedQuantity: 25,
  },
  {
    id: 4,
    organization: "Digital Learning Center",
    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e1b6eb00?w=500&h=300&fit=crop",
    title: "Computers for Rural School",
    description:
      "Seeking working computers and laptops to establish a computer lab for students in a remote village school.",
    category: "Electronics",
    needTillDate: "2025-09-30",
    priority: "Medium",
    targetQuantity: 20,
    receivedQuantity: 5,
  },
  {
    id: 5,
    organization: "Homeless Shelter",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop",
    title: "Furniture for New Shelter",
    description:
      "We need beds, mattresses, tables, and chairs for our newly opened shelter accommodating 50 homeless individuals.",
    category: "Furniture",
    needTillDate: "2025-09-10",
    priority: "High",
    targetQuantity: 50,
    receivedQuantity: 12,
  },
];

// Urgent Requirements Slider Component
const UrgentRequirements = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % urgentRequirements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % urgentRequirements.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + urgentRequirements.length) % urgentRequirements.length
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-600 bg-red-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateProgress = (received, target) => {
    return Math.round((received / target) * 100);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Urgent Requirements
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us fulfill these critical needs from organizations in our
            community
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl bg-white shadow-2xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {urgentRequirements.map((requirement) => (
              <div key={requirement.id} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-64 lg:h-96">
                    <img
                      src={requirement.image}
                      alt={requirement.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                          requirement.priority
                        )}`}
                      >
                        {requirement.priority} Priority
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {requirement.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-primary">
                          {requirement.organization}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Need till: {formatDate(requirement.needTillDate)}
                        </div>
                      </div>

                      <h4 className="text-xl lg:text-2xl font-bold text-secondary mb-3">
                        {requirement.title}
                      </h4>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {requirement.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {requirement.receivedQuantity} /{" "}
                            {requirement.targetQuantity} items
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary to-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${calculateProgress(
                                requirement.receivedQuantity,
                                requirement.targetQuantity
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm font-medium text-primary">
                            {calculateProgress(
                              requirement.receivedQuantity,
                              requirement.targetQuantity
                            )}
                            % Complete
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/donation"
                        className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                      >
                        Donate Now
                      </Link>
                      <button className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 z-10"
          >
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-300 z-10"
          >
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {urgentRequirements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Critical Priority</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold text-primary">5</div>
            <div className="text-sm text-gray-600">Active Requests</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="text-2xl font-bold text-green-600">117</div>
            <div className="text-sm text-gray-600">Items Donated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Hero Component
const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Together, We Can Make a Difference
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Your generosity has the power to transform lives. Every donation, no
          matter how small, creates ripples of positive change in our community.
        </p>
        <Link
          to="/donation"
          className="bg-white text-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-accent transition duration-300 inline-block"
        >
          Start Donating
        </Link>
      </div>
    </div>
  );
};

// Statistics Component
const Statistics = () => {
  return (
    <div className="bg-accent py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-secondary text-center mb-12">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-white shadow-lg">
            <div className="text-4xl font-bold text-primary mb-2">2.5K+</div>
            <div className="text-xl text-secondary">Items Donated</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-white shadow-lg">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-xl text-secondary">Lives Improved</div>
          </div>
          <div className="text-center p-6 rounded-lg bg-white shadow-lg">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-xl text-secondary">Organizations Helped</div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-secondary text-center mb-8">
            Featured Organizations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Children's Education Trust", donations: "250+ items" },
              { name: "Senior Care Foundation", donations: "180+ items" },
              { name: "Community Food Bank", donations: "300+ items" },
              { name: "Youth Development Center", donations: "120+ items" },
            ].map((org, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-md"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {org.name.charAt(0)}
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-secondary text-sm">
                    {org.name}
                  </h4>
                  <p className="text-primary text-sm">{org.donations}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// How It Works Section
const HowItWorks = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to make your donation count
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-white shadow-lg border border-accent">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              Browse Needs
            </h3>
            <p className="text-gray-600">
              Explore various categories and find causes you care about
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-white shadow-lg border border-accent">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              Choose to Help
            </h3>
            <p className="text-gray-600">
              Select the organizations and items you want to donate
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-white shadow-lg border border-accent">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-2">
              Make Impact
            </h3>
            <p className="text-gray-600">
              Your contribution directly helps those in need
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Home Component
function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <UrgentRequirements />
      <Statistics />
      <HowItWorks />
    </div>
  );
}

export default Home;
