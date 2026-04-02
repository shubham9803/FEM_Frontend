import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";
import ExpenseTable from "./ExpenseTable";
import ExpenseModal from "./ExpenseModal";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({ date: "", member: null });

  const fetchData = async () => {
    try {
      const [mRes, eRes] = await Promise.all([
        axiosInstance.get("api/family/members/"),
        axiosInstance.get("api/expenses/list/"),
      ]);
      setMembers(mRes.data);
      setExpenses(eRes.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(exp => {
      const d = new Date(exp.expense_date);
      const isMonth = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      const matchesDate = !filters.date || exp.expense_date === filters.date;
      const matchesMember = !filters.member || exp.added_by === filters.member;
      return isMonth && matchesDate && matchesMember;
    });
  }, [expenses, filters]);

  const total = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="glass-card total-card">
          <small>Monthly Spending</small>
          <h1 className="total-amount">₹ {total.toLocaleString()}</h1>
        </div>
        <button className="primary-btn" onClick={() => setShowModal(true)}>
          <span>+</span> Add Expense
        </button>
      </div>
      
<div className="glass-card filter-section">
  <div className="filter-group">
    <small style={{ color: "#888", display: "block", marginBottom: "5px" }}>Filter by Date</small>
    <input 
      type="date" 
      onChange={e => setFilters({...filters, date: e.target.value})} 
    />
  </div>

  <div className="filter-group">
    <small style={{ color: "#888", display: "block", marginBottom: "5px" }}>Filter by Member</small>
    <select onChange={e => setFilters({...filters, member: e.target.value ? parseInt(e.target.value) : null})}>
      <option value="">All Members</option>
      {members.map(m => <option key={m.id} value={m.id}>{m.fname}</option>)}
    </select>
  </div>
</div>

      <div className="glass-card table-container">
        <ExpenseTable data={filteredExpenses} />
      </div>

      {showModal && <ExpenseModal onClose={() => setShowModal(false)} onSave={fetchData} />}
    </div>
  );
};

export default Dashboard;