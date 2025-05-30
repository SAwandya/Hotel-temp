/**
 * Format a date for review display
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatReviewDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  // If less than 24 hours ago, show relative time
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  // Otherwise, show the date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Truncate text with ellipsis if too long
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * Format price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = "$") => {
  return `${currency}${price.toFixed(2)}`;
};
