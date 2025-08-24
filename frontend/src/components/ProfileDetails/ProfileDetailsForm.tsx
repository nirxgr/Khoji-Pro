import { useForm } from "react-hook-form";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { submitUserProfile } from "../../shared/service/user.service.tsx";

interface ProfileDetailsProps {
  user: IUser;
  backendUrl: string;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileDetailsForm: React.FC<ProfileDetailsProps> = ({
  user,
  backendUrl,
  setReloadUser,
  setShowForm,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUser>({ mode: "onSubmit", defaultValues: user });

  const onSubmit = async (data: IUser) => {
    await submitUserProfile(data, backendUrl, setReloadUser, setShowForm);
    reset(data);
  };

  return (
    <div className="profile-form-overlay">
      <div className="profile-form">
        <h2 className="profile-form-title">Edit Profile</h2>
        <p className="profile-form-subtitle">Edit your profile details</p>
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
          <div className="input">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="edit-input-field"
              id="firstName"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "First Name is required.",
                },
              })}
            />
            {errors.firstName?.message && (
              <p className="profile-error">{errors.firstName.message}</p>
            )}
          </div>
          <div className="input">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="edit-input-field"
              id="lastName"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "Last Name is required.",
                },
              })}
            />
            {errors.lastName?.message && (
              <p className="profile-error">{errors.lastName.message}</p>
            )}
          </div>
          <div className="input">
            <label htmlFor="profession">Designation</label>
            <input
              type="text"
              className="edit-input-field"
              id="profession"
              {...register("profession", {
                required: {
                  value: true,
                  message: "Desgination is required.",
                },
              })}
            />
            {errors.profession?.message && (
              <p className="profile-error">{errors.profession.message}</p>
            )}
          </div>
          <div className="input">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              className="edit-input-field"
              id="location"
              {...register("location", {
                required: {
                  value: true,
                  message: "Location is required.",
                },
              })}
            />
            {errors.location?.message && (
              <p className="profile-error">{errors.location.message}</p>
            )}
          </div>
          <div className="input">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              {...register("bio", {
                required: {
                  value: true,
                  message: "Bio is required.",
                },
              })}
            />
            {errors.bio?.message && (
              <p className="profile-error">{errors.bio.message}</p>
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
        {isSubmitting && (
          <div className="loading-overlay">
            {" "}
            <div className="spinner"></div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
