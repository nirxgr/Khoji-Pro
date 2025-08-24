import { useForm } from "react-hook-form";
import { IUser } from "../../shared/interfaces/user.interface.tsx";
import { submitUserProfile } from "../../shared/service/user.service.tsx";
interface ContactDetailsProps {
  user: IUser;
  backendUrl: string;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowContactForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactDetailsForm: React.FC<ContactDetailsProps> = ({
  user,
  backendUrl,
  setReloadUser,
  setShowContactForm,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IUser>({ mode: "onSubmit", defaultValues: user });

  const onSubmit = async (data: IUser) => {
    await submitUserProfile(
      data,
      backendUrl,
      setReloadUser,
      setShowContactForm
    );
    reset(data);
  };
  return (
    <div className="profile-form-overlay">
      <div className="profile-form">
        <h2 className="profile-form-title">Edit Contact</h2>
        <p className="profile-form-subtitle">Edit your contact details</p>
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
          <div className="input">
            <label htmlFor="firstName">Phone Number</label>
            <input
              type="text"
              className="edit-input-field"
              id="phoneNumber"
              {...register("phoneNumber", {
                required: {
                  value: true,
                  message: "Phone number is required.",
                },
                pattern: {
                  value: /^\d{10}$/,
                  message: "Phone Number must be exactly 10 digits",
                },
              })}
            />
            {errors.phoneNumber?.message && (
              <p className="profile-error">{errors.phoneNumber.message}</p>
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowContactForm(false)}
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

export default ContactDetailsForm;
