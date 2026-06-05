import { FormEvent, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/account" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not continue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-card flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-md bg-background border p-8 md:p-10 rounded-sm shadow-sm">
        <Link to="/" className="font-display text-3xl font-semibold">Ethio</Link>
        <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mt-8">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>
        <h1 className="font-display text-4xl font-semibold mt-2">{mode === "login" ? "Sign in" : "Join Ethio"}</h1>
        <form onSubmit={submit} className="space-y-4 mt-8">
          {mode === "register" && (
            <label className="block font-body text-sm">Name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2.5" />
            </label>
          )}
          <label className="block font-body text-sm">Email
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2.5" />
          </label>
          <label className="block font-body text-sm">Password
            <input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full border bg-background rounded-sm px-3 py-2.5" />
          </label>
          {error && <p className="font-body text-sm text-destructive">{error}</p>}
          <button disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground rounded-sm font-body uppercase tracking-wider text-sm disabled:opacity-60">
            {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-6 font-body text-sm text-primary underline">
          {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
};

export default AuthPage;
