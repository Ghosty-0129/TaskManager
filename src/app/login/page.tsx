// app/login/page.tsx
import LoginForm from "./login_form";

export default function LoginPage() {
  return (
    <main className="min-h-screen page-bg grid place-items-center p-6">
      <div className="w-full max-w-md card-ghost p-8 space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-gray-600">Sign in or create a new account</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-gray-500">
          Next.js • Supabase • Tailwind
        </p>
      </div>
    </main>
  );
}
