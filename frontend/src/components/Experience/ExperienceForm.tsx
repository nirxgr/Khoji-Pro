import { useForm, SubmitHandler } from "react-hook-form";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

interface ExperienceFormProps {
  type: "add" | "edit";
  initialValues?: Partial<IExperience>;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowExpForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  type,
  initialValues,
  onCancel,
  setReloadUser,
  setShowExpForm,
  setShowEditPopup,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IExperience>({
    defaultValues: initialValues || {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      employmentType: "",
      description: "",
    },
  });

  const { backendUrl } = useContext(AppContext);
  const onSubmit = async (data: IExperience) => {
    try {
      if (type === "add") {
        try {
          const res = await axios.post(
            backendUrl + "/api/exp/add-experience",
            data
          );
          if (res.data.success) {
            setReloadUser(true);
            setShowExpForm(false);
            reset();
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          toast.error("Error adding experience!");
        }
      } else if (type === "edit") {
        if (!initialValues?._id)
          throw new Error("Experience ID is required for edit");

        try {
          const response = await axios.put(
            `${backendUrl}/api/exp/update-experience/${initialValues._id}`,
            data
          );

          if (response.data.success) {
            setReloadUser(true);
            setShowEditPopup(false);
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Update failed:", error);
        }
      }
    } catch (err) {
      console.error("Error submitting experience:", err);
    }
  };

  return (
    <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
      <div className="input">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          className="edit-input-field"
          id="company"
          {...register("company", {
            required: {
              value: true,
              message: "Company name is required.",
            },
          })}
        />
        {errors.company?.message && (
          <p className="profile-error">{errors.company.message}</p>
        )}
      </div>
      <div className="input">
        <label htmlFor="position">Position</label>
        <input
          type="text"
          className="edit-input-field"
          id="position"
          {...register("position", {
            required: {
              value: true,
              message: "Position is required.",
            },
          })}
        />
        {errors.position?.message && (
          <p className="profile-error">{errors.position.message}</p>
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
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          className="edit-input-field"
          id="startDate"
          {...register("startDate", {
            required: {
              value: true,
              message: "Start Date is required.",
            },
          })}
        />
        {errors.startDate?.message && (
          <p className="profile-error">{errors.startDate.message}</p>
        )}
      </div>
      <div className="input">
        <label htmlFor="endDate">End Date</label>

        <input
          type="date"
          className="edit-input-field"
          id="endDate"
          {...register("endDate")}
        />
      </div>

      <div className="input">
        <label htmlFor="employmentType">Employment Type</label>

        <select
          className="edit-input-field"
          id="employmentType"
          defaultValue=""
          {...register("employmentType", {
            required: {
              value: true,
              message: "Employment type is required.",
            },
          })}
        >
          <option value="" disabled>
            Select type
          </option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Freelance">Freelance</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
        {errors.employmentType?.message && (
          <p className="profile-error">{errors.employmentType.message}</p>
        )}
      </div>

      <div className="input">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Write a description of your experience (Optional)."
          {...register("description")}
        />
        {errors.description?.message && (
          <p className="profile-error">{errors.description.message}</p>
        )}
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn-save">
          Save
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </form>
  );
};

export default ExperienceForm;
