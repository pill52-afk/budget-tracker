import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  async function fetchExpenses() {
    let { data } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false });
    setExpenses(data || []);
  }

  async function addExpense(e) {
    e.preventDefault();
    if (!amount) return;
    await supabase.from("expenses").insert([
      { amount: parseFloat(amount), category, note, date: new Date() }
    ]);
    setAmount("");
    setNote("");
    fetchExpenses();
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial", padding: 20 }}>
      <h2>💰 Budget Tracker</h2>
      <form onSubmit={addExpense} style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginRight: 10 }}>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button type="submit">Add</button>
      </form>

      <h3>📊 Expenses</h3>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            ₹{exp.amount} — {exp.category} {exp.note ? `(${exp.note})` : ""}  
            <small> — {new Date(exp.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
