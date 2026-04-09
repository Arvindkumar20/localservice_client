const ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_ACCESS_KEY;

export const getImageByTitle = async (title) => {
  try {
    if (!title) return null;

    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(title)}&orientation=landscape&content_filter=high&client_id=${ACCESS_KEY}`
    );

    const data = await res.json();
console.log(data.urls.regular)
    return data?.urls?.regular || null;
  } catch (error) {
    console.error("Image fetch error:", error);
    return null;
  }
};