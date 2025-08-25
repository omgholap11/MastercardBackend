function DonationCard({ requirement, onOpenDonationForm }) {
  const progressPercentage =
    (requirement.receivedQuantity / requirement.targetQuantity) * 100;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      food: "🍽️",
      clothes: "👕",
      stationary: "📚",
      furniture: "🪑",
      electronic: "💻",
    };
    return icons[category] || "📦";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-accent hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-accent">
        <img
          src={requirement.image}
          alt={requirement.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop`;
          }}
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(
              requirement.urgency
            )}`}
          >
            {requirement.urgency.charAt(0).toUpperCase() +
              requirement.urgency.slice(1)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-lg">
            {getCategoryIcon(requirement.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-secondary mb-2 line-clamp-2">
            {requirement.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h6m-6 4h6m-2 4h2"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{requirement.organization}</span>
              {requirement.organizationType && (
                <span className="text-xs text-gray-500">
                  {requirement.organizationType}
                </span>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          {(requirement.contactEmail || requirement.contactNumber) && (
            <div className="text-xs text-gray-600 mb-2 space-y-1">
              {requirement.contactEmail && (
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{requirement.contactEmail}</span>
                </div>
              )}
              {requirement.contactNumber && (
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{requirement.contactNumber}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {requirement.location}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {requirement.description}
        </p>

        {/* Items Needed */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-secondary mb-2">
            Items Needed:
          </h4>
          <div className="flex flex-wrap gap-1">
            {requirement.itemsNeeded.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-accent text-xs text-gray-700 rounded"
              >
                {item}
              </span>
            ))}
            {requirement.itemsNeeded.length > 3 && (
              <span className="px-2 py-1 bg-gray-200 text-xs text-gray-600 rounded">
                +{requirement.itemsNeeded.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Collection Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-secondary">
              Collection Progress
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>
              {requirement.receivedQuantity} {requirement.unit}
            </span>
            <span>
              {requirement.targetQuantity} {requirement.unit}
            </span>
          </div>
          <div className="text-center mt-1 text-xs text-gray-500">
            <span className="font-medium text-secondary">
              {requirement.targetQuantity - requirement.receivedQuantity}{" "}
              {requirement.unit} still needed
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onOpenDonationForm(requirement)}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
        >
          Contribute Items
        </button>
      </div>
    </div>
  );
}

export default DonationCard;
