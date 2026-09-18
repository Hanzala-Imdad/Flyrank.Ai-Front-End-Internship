import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./SettingsForm.css";

const schema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
  notifications: z.boolean().default(false),
});

function SettingsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { notifications: false },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
      <div className="field">
        <label htmlFor="fullName">Full Name</label>
        <input id="fullName" type="text" {...register("fullName")} />
        {errors.fullName && (
          <span className="error">{errors.fullName.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && (
          <span className="error">{errors.email.message}</span>
        )}
      </div>

      <div className="field">
        <label htmlFor="bio">Bio</label>
        <textarea id="bio" {...register("bio")} />
        {errors.bio && (
          <span className="error">{errors.bio.message}</span>
        )}
      </div>

      <div className="field checkbox">
        <input
          id="notifications"
          type="checkbox"
          {...register("notifications")}
        />
        <label htmlFor="notifications">Enable Notifications</label>
      </div>

      <button type="submit">Save Settings</button>
    </form>
  );
}

export default SettingsForm;