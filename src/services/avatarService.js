export const fetchAvatar = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching avatar:', error);
    throw error;
  }
};

export const getRandomAvatarUrl = (timestamp = Date.now()) => {
  return `https://avatar.iran.liara.run/public?_=${timestamp}`;
};

export const getUsernameAvatarUrl = (username) => {
  return `https://avatar.iran.liara.run/username?username=${encodeURIComponent(username)}`;
}; 