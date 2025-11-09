"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

type FormValues = { email: string; password: string };

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ defaultValues: { email: "", password: "" } });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(values: FormValues) {
    setMessage(null);
    const supabase = supabaseBrowser();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp(values);
      if (error) return setMessage(error.message);
      setMessage("Check your email to confirm your account.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) return setMessage(error.message);

    router.push("/tasks");
    router.refresh();
  }

  return (
    <div className="card p-6 space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            className="input"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button disabled={isSubmitting} className="btn-primary w-full" type="submit">
          {isSubmitting ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <div className="text-center">
        {mode === "signin" ? (
          <button className="btn-ghost w-full" onClick={() => setMode("signup")}>
            Need an account? Sign up
          </button>
        ) : (
          <button className="btn-ghost w-full" onClick={() => setMode("signin")}>
            Have an account? Sign in
          </button>
        )}
      </div>

      {message && <p className="text-center text-sm text-blue-600">{message}</p>}
    </div>
  );
}
