export function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let interval in intervals) {
    const value = Math.floor(seconds / intervals[interval]);
    if (value >= 1) {
      return `${value}${interval.charAt(0)} ago`;
    }
  }
  return "Just now";
}

// Usage example:
const date = new Date("2024-04-10T12:00:00"); // Date you want to parse
console.log(timeAgo(date)); // Output: '1d ago' (if current date is 2024-04-11)
