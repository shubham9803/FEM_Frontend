import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";
import ExpenseTable from "./ExpenseTable";
import ExpenseModal from "./ExpenseModal"; // Added for editing
import { useAuth } from "../context/AuthContext"; // Added for ownership check
import "../styles/ExpenseHistory.css";
import "../styles/Dashboard.css"; 

const ExpenseHistory = () => {
  const { user } = useAuth(); // Get current user ID
  const today = new Date();
  
  // Backend Fetch States
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  // Edit State
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Client-side Filter States
  const [filters, setFilters] = useState({ date: "", member: "" });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

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

  // Handle Edit/Delete Logic
  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense from history?")) {
      try {
        await axiosInstance.delete(`api/expenses/${id}/`);
        fetchData(); // Refresh history list
      } catch (err) {
        alert("Failed to delete the expense.");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  const dateBoundaries = useMemo(() => {
    const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    const minDate = `${selectedYear}-${monthStr}-01`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const maxDate = `${selectedYear}-${monthStr}-${lastDay}`;
    return { min: minDate, max: maxDate };
  }, [selectedMonth, selectedYear]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesDate = !filters.date || exp.expense_date === filters.date;
      const matchesMember = !filters.member || exp.added_by === parseInt(filters.member);
      return matchesDate && matchesMember;
    });
  }, [expenses, filters]);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  return (
    <div className="dashboard-container">
      <div className="history-header">
        <h2>Expense History</h2>
        
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

      <div className="glass-card total-summary-card" style={{ textAlign: 'center', padding: '20px' }}>
        <small style={{ color: '#aaa' }}>Total for {months[selectedMonth - 1]} {selectedYear}</small>
        <h1 style={{ color: '#00ff88', margin: '10px 0' }}>₹ {totalAmount.toLocaleString()}</h1>
      </div>

      <div className="glass-card filter-section" style={{ marginTop: '0' }}>
        <div className="filter-group">
          <small className="filter-label">Filter by Specific Date</small>
          <input 
            type="date" 
            value={filters.date}
            min={dateBoundaries.min} 
            max={dateBoundaries.max} 
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

      <div className="glass-card table-container">
        {loading ? (
          <div className="loader">Updating records...</div>
        ) : (
          <ExpenseTable 
            data={filteredExpenses} 
            currentUserId={user?.id}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showModal && (
        <ExpenseModal 
          onClose={handleCloseModal} 
          onSave={fetchData} 
          editData={selectedExpense} 
        />
      )}
    </div>
  );
};

export default ExpenseHistory;