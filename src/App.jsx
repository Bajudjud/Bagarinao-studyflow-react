import { useEffect, useMemo, useState } from "react";

const initialTasks = [
  { id: 1, title: "Review React components", subject: "Web Development", due: "2026-11-12", priority: "High", done: false },
  { id: 2, title: "Finish mathematics worksheet", subject: "Mathematics", due: "2026-11-13", priority: "Medium", done: false },
  { id: 3, title: "Read chapter 4", subject: "Research", due: "2026-11-14", priority: "Low", done: true }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("studyflow-tasks")) || initialTasks; }
    catch { return initialTasks; }
  });
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", due: "", priority: "Medium" });

  useEffect(() => localStorage.setItem("studyflow-tasks", JSON.stringify(tasks)), [tasks]);

  const completed = tasks.filter(t => t.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  const visibleTasks = useMemo(() => tasks.filter(task => {
    const matchesFilter = filter === "All" ||
      (filter === "Pending" && !task.done) ||
      (filter === "Completed" && task.done);
    const query = search.toLowerCase();
    return matchesFilter && (task.title.toLowerCase().includes(query) || task.subject.toLowerCase().includes(query));
  }), [tasks, filter, search]);

  function addTask(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.subject.trim() || !form.due) return;
    setTasks(current => [{ ...form, id: Date.now(), title: form.title.trim(), subject: form.subject.trim(), done: false }, ...current]);
    setForm({ title: "", subject: "", due: "", priority: "Medium" });
    setShowForm(false);
    setFilter("All");
  }

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand"><b>S</b> study<span>flow</span></div>
        <small className="side-title">WORKSPACE</small>
        <nav>
          {["All", "Pending", "Completed"].map((item, index) =>
            <button key={item} className={filter === item ? "nav active" : "nav"} onClick={() => setFilter(item)}>
              <i>{["▦", "◷", "✓"][index]}</i>{["My tasks", "In progress", "Completed"][index]}
              {item === "All" && <em>{tasks.length}</em>}
            </button>
          )}
        </nav>
        <div className="tip"><b>✦ A little progress adds up.</b><p>Stay consistent, take breaks, and celebrate every win.</p></div>
        <div className="profile"><b>S</b><div>Student workspace<small>Personal planner</small></div></div>
      </aside>

      <main>
        <header>
          <span>Workspace　/　My tasks</span>
          <label>◷　{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</label>
        </header>

        <section className="welcome">
          <div><small>YOUR PERSONAL STUDY SPACE</small><h1>Make today count<span>.</span></h1><p>A little progress each day adds up to big results.</p></div>
          <button className="add" onClick={() => setShowForm(true)}>＋ Add a task</button>
        </section>

        <section className="stats">
          <article><label>Total tasks</label><strong>{tasks.length}</strong><small>Across all subjects</small></article>
          <article><label>In progress</label><strong>{pending}</strong><small>Keep moving forward</small></article>
          <article><label>Completed</label><strong>{completed}</strong><small>Tasks you've finished</small></article>
          <article><label>Overall progress</label><strong>{progress}%</strong><div className="track"><div style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} tasks</small></article>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div><h2>Your tasks</h2><p>Keep track of what needs to get done.</p></div>
            <input className="search" placeholder="⌕  Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="tabs">
            {["All", "Pending", "Completed"].map(item =>
              <button key={item} className={filter === item ? "chosen" : ""} onClick={() => setFilter(item)}>
                {item} ({item === "All" ? tasks.length : item === "Pending" ? pending : completed})
              </button>
            )}
          </div>
          {visibleTasks.length ? visibleTasks.map(task =>
            <div className={`task ${task.done ? "done" : ""}`} key={task.id}>
              <button className={`check ${task.done ? "yes" : ""}`} onClick={() => setTasks(current => current.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}>{task.done ? "✓" : ""}</button>
              <div className="task-name"><b>{task.title}</b><small>{task.subject}</small></div>
              <div className="due"><small>DUE DATE</small><b>▣ {formatDate(task.due)}</b></div>
              <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <button className="delete" title="Delete task" onClick={() => setTasks(current => current.filter(t => t.id !== task.id))}>×</button>
            </div>
          ) : <div className="empty"><b>✦ No tasks found</b><p>Try another search or add a new task.</p><button onClick={() => { setSearch(""); setFilter("All"); }}>Clear filters</button></div>}
          <footer>Showing {visibleTasks.length} of {tasks.length} tasks <span>Changes are saved automatically</span></footer>
        </section>
        <div className="footnote">Made for focused days　✦</div>
      </main>

      {showForm && <div className="shade" onClick={() => setShowForm(false)}>
        <section className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-top"><div><small>PLAN YOUR NEXT STEP</small><h2>Add a new task</h2></div><button onClick={() => setShowForm(false)}>×</button></div>
          <form onSubmit={addTask}>
            <label>Task name<input autoFocus required placeholder="e.g. Prepare presentation" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
            <label>Subject or category<input required placeholder="e.g. Mathematics" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></label>
            <div className="form-row">
              <label>Due date<input type="date" required value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} /></label>
              <label>Priority<select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
            </div>
            <div className="actions"><button type="button" className="cancel" onClick={() => setShowForm(false)}>Cancel</button><button className="add">Save task</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}
