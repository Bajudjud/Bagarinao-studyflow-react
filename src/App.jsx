
import { useEffect, useMemo, useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Review React components",
    subject: "Web Development",
    due: "2026-11-12",
    priority: "High",
    done: false,
  },
  {
    id: 2,
    title: "Finish mathematics worksheet",
    subject: "Mathematics",
    due: "2026-11-13",
    priority: "Medium",
    done: false,
  },
  {
    id: 3,
    title: "Read chapter 4",
    subject: "Research",
    due: "2026-11-14",
    priority: "Low",
    done: true,
  },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("studyflow-tasks")) ||
        initialTasks
      );
    } catch {
      return initialTasks;
    }
  });

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    due: "",
    priority: "Medium",
  });

  useEffect(() => {
    localStorage.setItem("studyflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.length - completed;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Pending" && !task.done) ||
        (filter === "Completed" && task.done);

      const query = search.toLowerCase();

      return (
        matchesFilter &&
        (task.title.toLowerCase().includes(query) ||
          task.subject.toLowerCase().includes(query))
      );
    });
  }, [tasks, filter, search]);

  function resetForm() {
    setForm({
      title: "",
      subject: "",
      due: "",
      priority: "Medium",
    });

    setEditingTaskId(null);
  }

  function addTask(e) {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.due
    ) {
      return;
    }

    if (editingTaskId !== null) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...form,
                title: form.title.trim(),
                subject: form.subject.trim(),
              }
            : task
        )
      );
    } else {
      setTasks((current) => [
        {
          ...form,
          id: Date.now(),
          title: form.title.trim(),
          subject: form.subject.trim(),
          done: false,
        },
        ...current,
      ]);
    }

    resetForm();
    setShowForm(false);
    setFilter("All");
  }

  function editTask(task) {
    setEditingTaskId(task.id);

    setForm({
      title: task.title,
      subject: task.subject,
      due: task.due,
      priority: task.priority,
    });

    setShowForm(true);
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, done: !task.done }
          : task
      )
    );
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  }

  const priorityStyles = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#24243a]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[245px] flex-col border-r border-[#eceef4] bg-white p-5 md:flex">
        <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span className="grid h-[34px] w-[34px] place-items-center rounded-xl bg-[#7768e7] text-white">
            S
          </span>
          study<span className="text-[#8174e8]">flow</span>
        </div>

        <small className="mb-4 mt-14 px-2 text-[10px] font-bold tracking-[1.4px] text-gray-400">
          WORKSPACE
        </small>

        <nav className="grid gap-2">
          {["All", "Pending", "Completed"].map((item, index) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-3 text-left text-sm ${
                filter === item
                  ? "bg-[#f0efff] font-bold text-[#695bdd]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="mr-3">
                {["▦", "◷", "✓"][index]}
              </span>

              {["My tasks", "In progress", "Completed"][index]}

              {item === "All" && (
                <span className="float-right">{tasks.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border border-[#eeecff] bg-[#f6f5ff] p-4 text-xs">
          <b>✦ A little progress adds up.</b>
          <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
            Stay consistent, take breaks, and celebrate every win.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 text-xs font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e9e6ff] text-[#6558c9]">
            S
          </span>

          <div>
            Student workspace
            <small className="mt-1 block font-normal text-gray-400">
              Personal planner
            </small>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="mx-auto max-w-[1500px] px-5 pb-8 md:ml-[245px] md:px-10 lg:px-[5.2%]">
        <header className="flex h-[76px] items-center justify-between border-b border-[#eceef4] text-xs text-gray-400">
          <span>Workspace / My tasks</span>

          <span className="rounded-lg border border-[#eceef4] bg-white px-3 py-2">
            ◷{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </header>

        {/* Mobile navigation */}
        <nav className="flex gap-2 overflow-x-auto py-4 md:hidden">
          {["All", "Pending", "Completed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs ${
                filter === item
                  ? "bg-[#f0efff] font-bold text-[#695bdd]"
                  : "bg-white text-gray-500"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Welcome */}
        <section className="flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-end">
          <div>
            <small className="text-[9px] font-bold tracking-[1.5px] text-[#8174e8]">
              YOUR PERSONAL STUDY SPACE
            </small>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              Make today count
              <span className="text-[#8072e8]">.</span>
            </h1>

            <p className="mt-2 text-xs text-gray-400">
              A little progress each day adds up to big results.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="rounded-lg bg-[#7668e5] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-purple-100 transition hover:bg-[#6557d5]"
          >
            ＋ Add a task
          </button>
        </section>

        {/* Statistics */}
        <section className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            {
              label: "Total tasks",
              value: tasks.length,
              note: "Across all subjects",
            },
            {
              label: "In progress",
              value: pending,
              note: "Keep moving forward",
            },
            {
              label: "Completed",
              value: completed,
              note: "Tasks you've finished",
            },
            {
              label: "Overall progress",
              value: `${progress}%`,
              note: `${completed} of ${tasks.length} tasks`,
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="min-h-[119px] rounded-xl border border-[#eceef4] bg-white p-4 sm:p-5"
            >
              <label className="block text-[11px] text-gray-500">
                {stat.label}
              </label>

              <strong className="my-2 block text-2xl font-extrabold">
                {stat.value}
              </strong>

              {stat.label === "Overall progress" && (
                <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[#f0eff8]">
                  <div
                    className="h-full rounded-full bg-[#7c70e9] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <small className="text-[10px] text-gray-400">
                {stat.note}
              </small>
            </article>
          ))}
        </section>

        {/* Task panel */}
        <section className="overflow-hidden rounded-xl border border-[#eceef4] bg-white">
          <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-extrabold">Your tasks</h2>
              <p className="mt-1 text-[10px] text-gray-400">
                Keep track of what needs to get done.
              </p>
            </div>

            <input
              type="text"
              placeholder="⌕  Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#eceef4] px-3 py-2 text-xs outline-none focus:border-[#887ce9] sm:w-[200px]"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-5 border-b border-gray-100 px-5">
            {["All", "Pending", "Completed"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`border-b-2 py-3 text-[10px] ${
                  filter === item
                    ? "border-[#796ce5] font-bold text-[#7163dc]"
                    : "border-transparent text-gray-400"
                }`}
              >
                {item} (
                {item === "All"
                  ? tasks.length
                  : item === "Pending"
                    ? pending
                    : completed}
                )
              </button>
            ))}
          </div>

          {/* Task list */}
          {visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 border-b border-gray-100 px-3 py-4 sm:gap-4 sm:px-5"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border text-xs text-white ${
                    task.done
                      ? "border-[#7b6de7] bg-[#7b6de7]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {task.done ? "✓" : ""}
                </button>

                <div className="min-w-0 flex-1">
                  <b
                    className={`block truncate text-[11px] ${
                      task.done ? "text-gray-400 line-through" : ""
                    }`}
                  >
                    {task.title}
                  </b>

                  <small className="mt-1 block text-[10px] text-gray-400">
                    {task.subject}
                  </small>
                </div>

                <div className="hidden w-[105px] sm:block">
                  <small className="block text-[8px] tracking-wider text-gray-400">
                    DUE DATE
                  </small>

                  <b className="mt-1 block text-[10px] font-medium text-gray-500">
                    ▣ {formatDate(task.due)}
                  </b>
                </div>

                <span
                  className={`w-[65px] rounded-md px-2 py-1 text-center text-[9px] font-bold ${
                    priorityStyles[task.priority]
                  }`}
                >
                  {task.priority}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    title="Edit task"
                    onClick={() => editTask(task)}
                    className="text-sm font-semibold text-indigo-400 transition hover:text-indigo-600"
                  >
                    Edit
                  </button>

                  <button
                    title="Delete task"
                    onClick={() => deleteTask(task.id)}
                    className="text-xl text-gray-300 transition hover:text-red-400"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <b className="text-sm">✦ No tasks found</b>

              <p className="mt-2 text-xs text-gray-400">
                Try another search or add a new task.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="mt-3 text-xs font-bold text-[#7163dc]"
              >
                Clear filters
              </button>
            </div>
          )}

          <footer className="flex justify-between bg-[#fdfdfe] px-5 py-3 text-[9px] text-gray-400">
            <span>
              Showing {visibleTasks.length} of {tasks.length} tasks
            </span>

            <span>Changes are saved automatically</span>
          </footer>
        </section>

        <div className="py-6 text-center text-[10px] text-gray-400">
          Made for focused days ✦
        </div>
      </main>

      {/* Add / Edit task modal */}
      {showForm && (
        <div
          onClick={closeForm}
          className="fixed inset-0 z-50 grid place-items-center bg-[#22223b]/40 p-5"
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[470px] rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <small className="text-[9px] font-bold tracking-widest text-[#8174e8]">
                  PLAN YOUR NEXT STEP
                </small>

                <h2 className="mt-2 text-xl font-extrabold">
                  {editingTaskId !== null
                    ? "Edit task"
                    : "Add a new task"}
                </h2>
              </div>

              <button
                onClick={closeForm}
                className="grid h-8 w-8 place-items-center rounded-lg bg-gray-100 text-xl text-gray-500"
              >
                ×
              </button>
            </div>

            <form onSubmit={addTask} className="grid gap-4">
              <label className="grid gap-2 text-[11px] font-bold text-gray-600">
                Task name

                <input
                  autoFocus
                  required
                  placeholder="e.g. Prepare presentation"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="rounded-lg border border-gray-200 px-3 py-3 text-xs font-normal outline-none focus:border-[#887ce9]"
                />
              </label>

              <label className="grid gap-2 text-[11px] font-bold text-gray-600">
                Subject or category

                <input
                  required
                  placeholder="e.g. Mathematics"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="rounded-lg border border-gray-200 px-3 py-3 text-xs font-normal outline-none focus:border-[#887ce9]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-2 text-[11px] font-bold text-gray-600">
                  Due date

                  <input
                    type="date"
                    required
                    value={form.due}
                    onChange={(e) =>
                      setForm({ ...form, due: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-2 py-3 text-xs font-normal outline-none focus:border-[#887ce9]"
                  />
                </label>

                <label className="grid gap-2 text-[11px] font-bold text-gray-600">
                  Priority

                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-2 py-3 text-xs font-normal outline-none focus:border-[#887ce9]"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="mt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-gray-200 px-4 py-3 text-xs text-gray-500"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#7668e5] px-5 py-3 text-xs font-bold text-white hover:bg-[#6557d5]"
                >
                  Save task
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
