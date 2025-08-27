import axios from "axios";

export const toggleFavorite = async (
  backendUrl: string,
  favoriteUserId: string,
  isCurrentlyFavorite: boolean
) => {
  try {
    if (isCurrentlyFavorite) {
      await axios.delete(`${backendUrl}/api/fav/delete-favorites`, {
        data: { favoriteUserId },
      });
    } else {
      await axios.post(`${backendUrl}/api/fav/add-favorites`, {
        favoriteUserId,
      });
    }
  } catch (err) {
    console.error("Error toggling favorite:", err);
    throw err;
  }
};
