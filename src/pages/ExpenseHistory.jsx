import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";
import ExpenseTable from "./ExpenseTable";
import "../styles/ExpenseHistory.css";
import "../styles/Dashboard.css"; // Reuse dashboard filter styles

const ExpenseHistory = () => {
  const today = new Date();
  
  // Backend Fetch States
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Client-side Filter States
  const [filters, setFilters] = useState({ date: "", member: "" });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  // 1. Fetch Data from Backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, membersRes] = await Promise.all([
        axiosInstance.get(`api/expenses/list/`, {
          params: { month: selectedMonth, year: selectedYear }
        }),
        axiosInstance.get("api/family/members/")
      ]);
      setExpenses(historyRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  // ... inside ExpenseHistory component

// Calculate the first and last day of the selected month
const dateBoundaries = useMemo(() => {
  // Format: YYYY-MM-DD
  const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
  
  // First day of the month
  const minDate = `${selectedYear}-${monthStr}-01`;
  
  // Last day of the month (0th day of next month is last day of current)
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const maxDate = `${selectedYear}-${monthStr}-${lastDay}`;
  
  return { min: minDate, max: maxDate };
}, [selectedMonth, selectedYear]);

// ... rest of your code

  // 2. Client-side filtering logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesDate = !filters.date || exp.expense_date === filters.date;
      const matchesMember = !filters.member || exp.added_by === parseInt(filters.member);
      return matchesDate && matchesMember;
    });
  }, [expenses, filters]);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="dashboard-container"> {/* Reusing container class for consistent spacing */}
      <div className="history-header">
        <h2>Expense History</h2>
        
        {/* Month & Year Picker (Backend Trigger) */}
        <div className="glass-card filter-section">
          <div className="filter-group">
            <small className="filter-label">Select Month</small>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}>
              {months.map((name, index) => (
                <option key={name} value={index + 1}>{name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <small className="filter-label">Select Year</small>
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass-card total-summary-card" style={{ textAlign: 'center', padding: '20px' }}>
        <small style={{ color: '#aaa' }}>Total for {months[selectedMonth - 1]} {selectedYear}</small>
        <h1 style={{ color: '#00ff88', margin: '10px 0' }}>₹ {totalAmount.toLocaleString()}</h1>
      </div>

      {/* Sub-Filters (Client-side Trigger) */}
      <div className="glass-card filter-section" style={{ marginTop: '0' }}>
        <div className="filter-group">
  <small className="filter-label">Filter by Specific Date</small>
  <input 
    type="date" 
    value={filters.date}
    min={dateBoundaries.min} // Restricts the start
    max={dateBoundaries.max} // Restricts the end
    onChange={e => setFilters({...filters, date: e.target.value})} 
  />
</div>

        <div className="filter-group">
          <small className="filter-label">Filter by Member</small>
          <select 
            value={filters.member}
            onChange={e => setFilters({...filters, member: e.target.value})}
          >
            <option value="">All Members</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.fname} {m.lname}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {(filters.date || filters.member) && (
          <button 
            className="secondary-btn" 
            style={{ marginTop: '18px', padding: '8px 15px' }}
            onClick={() => setFilters({ date: "", member: "" })}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="glass-card table-container">
        {loading ? (
          <div className="loader">Updating records...</div>
        ) : (
          <ExpenseTable data={filteredExpenses} />
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;