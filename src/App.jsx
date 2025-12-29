import { useState, useEffect } from "react";
import {
  Bar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedExpenses = localStorage.getItem("expenses");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addTask = () => {
    if (taskText.trim() === "") return;
    setTasks([...tasks, { text: taskText, done: false }]);
    setTaskText("");
  };

  const toggleTask = (i) => {
    const copy = [...tasks];
    copy[i].done = !copy[i].done;
    setTasks(copy);
  };

  const addExpense = () => {
    if (!amount || !category) return;
    setExpenses([
      ...expenses,
      {
        amount: Number(amount),
        category,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setAmount("");
    setCategory("");
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const categories = {};
  expenses.forEach(e => {
    if (categories[e.category]) categories[e.category] += e.amount;
    else categories[e.category] = e.amount;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categories),
        backgroundColor: "rgba(37, 99, 235, 0.7)",
      },
    ],
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task & Expense Tracker</h1>

      <h2>Tasks</h2>
      <input
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Enter a task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => toggleTask(i)}
            />
            {t.text}
          </li>
        ))}
      </ul>

      <h2>Expenses</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={addExpense}>Add Expense</button>

      <p>Total Expense: ₹{totalExpense}</p>
      <p>Total Entries: {expenses.length}</p>

      {expenses.length > 0 && (
        <div style={{ maxWidth: "500px" }}>
          <Bar data={data} />
        </div>
      )}
    </div>
  );
}
