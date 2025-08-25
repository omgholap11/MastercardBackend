/**
 * Safely formats items object into a readable string
 * @param {Object} items - The items object with category structure
 * @returns {string} - Formatted items string or fallback message
 */
export const formatItems = (items) => {
  if (!items || typeof items !== 'object') {
    return 'No items';
  }
  
  const itemList = [];
  Object.entries(items).forEach(([category, categoryItems]) => {
    if (categoryItems && typeof categoryItems === 'object') {
      Object.entries(categoryItems).forEach(([item, details]) => {
        if (details && details.count > 0) {
          itemList.push(`${details.count} ${item}`);
        }
      });
    }
  });
  return itemList.length > 0 ? itemList.join(', ') : 'No items';
};

/**
 * Safely formats date string into readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Gets appropriate status color classes for Tailwind CSS
 * @param {string} status - The status string
 * @returns {string} - Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'delivered':
    case 'fulfilled':
      return 'bg-green-100 text-green-800';
    case 'matched':
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'pending_pickup':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in_transit':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
