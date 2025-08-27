import axios from "axios";
import { toast } from "react-toastify";

export const toggleFavorite = async (
  backendUrl: string,
  favoriteUserId: string,
  isCurrentlyFavorite: boolean
) => {
  try {
    if (isCurrentlyFavorite) {
      const res = await axios.delete(`${backendUrl}/api/fav/delete-favorites`, {
        data: { favoriteUserId },
      });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } else {
      const res = await axios.post(`${backendUrl}/api/fav/add-favorites`, {
        favoriteUserId,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    }
  } catch (err) {
    console.error("Error toggling favorite:", err);
    throw err;
  }
};
