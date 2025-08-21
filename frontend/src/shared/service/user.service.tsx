import axios from "axios";
import { toast } from "react-toastify";
import { IUser } from "../interfaces/user.interface";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

export const submitUserProfile = async (
  data: IUser,
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>,
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>,
  setShowContactForm?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { backendUrl } = useContext(AppContext);
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const res = await axios.post(
      backendUrl + "/api/update/updateProfileDetails",
      data
    );
    if (res.data.success) {
      setReloadUser(true);
      setShowForm?.(false);
      setShowContactForm?.(false);
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error("Error updating profile");
  }
};
