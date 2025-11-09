"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabaseBrowser } from "@/lib/supabase/client";

type FormValues = { title: string };

export default function AddTaskForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } =
    useForm<FormValues>({ defaultValues: { title: "" } });

  async function onSubmit(values: FormValues) {
    const { error } = await supabaseBrowser().from("tasks").insert({
      title: values.title.trim(),
      completed: false, // user_id handled by DB trigger if you added it
    });
    if (error) return alert(error.message);
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        className="input flex-1"
        placeholder="Add a task…"
        {...register("title", { required: "Title is required" })}
      />
      <button disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Adding…" : "Add"}
      </button>
      {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
    </form>
  );
}
