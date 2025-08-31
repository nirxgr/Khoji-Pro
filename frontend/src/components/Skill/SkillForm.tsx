import { useForm } from "react-hook-form";
import { IExperience } from "../../shared/interfaces/experience.interface.tsx";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext, useEffect } from "react";

import {
  ISkill,
  SkillFormValues,
} from "../../shared/interfaces/skill.interface.tsx";

interface SkillFormProps {
  type: "add" | "edit";
  initialValues?: Partial<ISkill>;
  setReloadUser: React.Dispatch<React.SetStateAction<boolean>>;
  experiences: IExperience[];
  setShowSkillForm?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditSkill?: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel: () => void;
}

const toFormValues = (skill?: Partial<ISkill>): SkillFormValues => ({
  name: skill?.name || "",
  company: skill?.company?._id || "",
});

const SkillForm: React.FC<SkillFormProps> = ({
  type,
  initialValues,
  setReloadUser,
  setShowSkillForm,
  experiences,
  setShowEditSkill,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    defaultValues: toFormValues(initialValues),
  });

  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || "",
        company: initialValues.company?._id || "",
      });
    }
  }, [initialValues, reset]);

  const onSubmit = async (data: SkillFormValues) => {
    try {
      if (type === "add") {
        try {
          const res = await axios.post(backendUrl + "/api/sk/add-skill", data);
          if (res.data.success) {
            setReloadUser(true);
            reset();
            setShowSkillForm?.(false);
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error adding skill!");
          }
        }
      } else if (type === "edit") {
        if (!initialValues?._id)
          throw new Error("Skill ID is required for edit");

        try {
          const response = await axios.put(
            `${backendUrl}/api/sk/update-skill/${initialValues._id}`,
            {
              name: data.name,
              companyId: data.company,
            }
          );
          if (response.data.success) {
            setReloadUser(true);
            setShowEditSkill?.(false);
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error: any) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error adding skill!");
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
      <div className="input">
        <label htmlFor="name">Skill*</label>
        <input
          type="text"
          className="edit-input-field"
          id="name"
          {...register("name", {
            required: {
              value: true,
              message: "Skill name is required.",
            },
          })}
        />
        {errors.name?.message && (
          <p className="profile-error">{errors.name.message}</p>
        )}
      </div>
      {watch("name") && watch("name").trim() !== "" && (
        <>
          <div className="exp-details-addition">
            <h3>Show us where you used this skill</h3>
            <p>
              75% of hirers value skill context. Select one experience to show
              where you used this skill.
            </p>
            <h4>Experience</h4>
          </div>

          <select
            className="edit-input-field"
            id="employmentType"
            {...register("company")}
          >
            {initialValues?.company?._id ? (
              <option value=""> None</option>
            ) : (
              <option value="" disabled>
                {" "}
                Select a company
              </option>
            )}
            {experiences.map((exp) => (
              <option key={exp._id} value={exp._id}>
                {exp.company}
              </option>
            ))}
          </select>
        </>
      )}

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

export default SkillForm;
