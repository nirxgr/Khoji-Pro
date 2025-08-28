import axios from "axios";
import { toast } from "react-toastify";
import { IUser } from "../interfaces/user.interface";

export const submitUserProfile = async (
  data: IUser,
  backendUrl: string,
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>,
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>,
  setShowContactForm?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
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
