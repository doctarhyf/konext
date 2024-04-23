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

export async function sendNotification(title, body, data, bigPicUrl) {
  const url = "https://app.nativenotify.com/api/notification";

  const postData = {
    appId: 20602,
    appToken: "b4XsCQJJ9vzPICDZTpbPuy",
    title: title,
    body: body,
    dateSent: new Date().toISOString(),
    pushData: data,
    bigPictureURL: bigPicUrl,
  };

  try {
    // Make the POST request using fetch
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify(postData), // Convert postData to JSON string
    });

    // Handle the response
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON in the response
    const data = await response.json();

    // Do something with the data returned from the server
    console.log(data);
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("There was a problem with the fetch operation:", error);
  }
}
