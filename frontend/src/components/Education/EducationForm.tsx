import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { IEducation } from "../../shared/interfaces/education.interface.tsx";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext } from "react";

interface EducationFormProps {
  type: "add" | "edit";
  initialValues?: Partial<IEducation>;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEduForm: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditEdu: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  type,
  initialValues,
  onCancel,
  setReloadUser,
  setShowEduForm,
  setShowEditEdu,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IEducation>({
    defaultValues: initialValues || {
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      grade: "",
      activities: "",
    },
  });
  const { backendUrl } = useContext(AppContext);
  const onSubmit = async (data: IEducation) => {
    try {
      if (type === "add") {
        try {
          const res = await axios.post(
            backendUrl + "/api/edu/add-education",
            data
          );
          if (res.data.success) {
            setReloadUser(true);
            setShowEduForm(false);
            reset();
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        } catch (error) {
          toast.error("Error adding education!");
        }
      } else if (type === "edit") {
        if (!initialValues?._id)
          throw new Error("Experience ID is required for edit");
        try {
          const response = await axios.put(
            `${backendUrl}/api/edu/update-education/${initialValues._id}`,
            data
          );

          if (response.data.success) {
            setReloadUser(true);
            setShowEditEdu(false);
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
        <label htmlFor="school">School</label>
        <input
          type="text"
          className="edit-input-field"
          id="school"
          {...register("school", {
            required: {
              value: true,
              message: "School name is required.",
            },
          })}
        />
        {errors.school?.message && (
          <p className="profile-error">{errors.school.message}</p>
        )}
      </div>
      <div className="input">
        <label htmlFor="degree">Degree</label>
        <input
          type="text"
          className="edit-input-field"
          id="degree"
          {...register("degree", {
            required: {
              value: true,
              message: "Degree name is required.",
            },
          })}
        />
        {errors.degree?.message && (
          <p className="profile-error">{errors.degree.message}</p>
        )}
      </div>
      <div className="input">
        <label htmlFor="fieldOfStudy">Field of Study</label>
        <input
          type="text"
          className="edit-input-field"
          id="fieldOfStudy"
          {...register("fieldOfStudy", {
            required: {
              value: true,
              message: "Field of Study is required.",
            },
          })}
        />
        {errors.fieldOfStudy?.message && (
          <p className="profile-error">{errors.fieldOfStudy.message}</p>
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
          {...register("endDate", {
            required: {
              value: true,
              message: "End Date is required.",
            },
          })}
        />
        {errors.endDate?.message && (
          <p className="profile-error">{errors.endDate.message}</p>
        )}
      </div>

      <div className="input">
        <label htmlFor="grade">Grade</label>
        <input
          type="text"
          className="edit-input-field"
          placeholder="(Optional)"
          id="grade"
          {...register("grade")}
        />
        {errors.grade?.message && (
          <p className="profile-error">{errors.grade.message}</p>
        )}
      </div>

      <div className="input">
        <label htmlFor="activities">Activities</label>
        <textarea
          id="activities"
          placeholder="Write the activites you did here (Optional)."
          {...register("activities")}
        />
        {errors.activities?.message && (
          <p className="profile-error">{errors.activities.message}</p>
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

export default EducationForm;
