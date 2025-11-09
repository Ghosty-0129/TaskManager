import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddTaskForm from "./add_task_form";
import TaskItem from "./task_item";

type Task = { id: string; title: string; completed: boolean };

export default async function TasksPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasksRaw, error } = await supabase
    .from("tasks")
    .select("id,title,completed,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return <pre className="p-6">Error: {error.message}</pre>;

  // ✅ Ensure non-null
  const tasks: Task[] = (tasksRaw ?? []) as Task[];

  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;
  const pct   = total ? Math.round((done / total) * 100) : 0;

  return (
    <main className="container-app py-8 space-y-6">
      <header className="card p-5 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Your Tasks</h1>
          <p className="text-sm text-gray-600">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <button className="btn-outline" type="submit">Sign out</button>
        </form>
      </header>

      <section className="card p-5 space-y-3">
        <AddTaskForm />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="badge-gray">Total: {total}</span>
            <span className="badge-green">Completed: {done}</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      {total === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-lg font-medium">No tasks yet</p>
          <p className="text-sm text-gray-600 mt-1">Add your first task above.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((t) => (
            <TaskItem key={t.id} id={t.id} title={t.title} completed={t.completed} />
          ))}
        </ul>
      )}
    </main>
  );
}
