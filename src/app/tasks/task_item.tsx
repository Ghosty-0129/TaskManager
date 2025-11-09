"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function TaskItem({
  id,
  title,
  completed,
}: {
  id: string;
  title: string;
  completed: boolean;
}) {
  const router = useRouter();

  async function toggleCompleted(next: boolean) {
    const { error } = await supabaseBrowser().from("tasks").update({ completed: next }).eq("id", id);
    if (!error) router.refresh();
  }

  async function remove() {
    const { error } = await supabaseBrowser().from("tasks").delete().eq("id", id);
    if (!error) router.refresh();
  }

  return (
    <li className="card p-3 flex items-center justify-between">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          className="chk"
          checked={completed}
          onChange={(e) => toggleCompleted(e.target.checked)}
        />
        <span className={completed ? "line-through text-gray-500" : ""}>{title}</span>
      </label>
      <button onClick={remove} className="btn-ghost text-red-600">Delete</button>
    </li>
  );
}
