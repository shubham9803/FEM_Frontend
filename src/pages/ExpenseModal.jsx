import { useState } from "react";
import axiosInstance from "../api/axios";

const CATEGORIES = ["GROCERIES", "VEGETABLES", "RENT", "BILL", "TRAVEL", "MEDICAL", "OTHER"];
const MODES = ["CASH", "UPI", "CARD", "NETBANKING"];

const ExpenseModal = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "GROCERIES",
    amount: "",
    description: "",
    payment_mode: "CASH",
    expense_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("api/expenses/create/", formData);
      onSave(); // Refresh dashboard data
      onClose(); // Close modal
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Inside your return statement:
  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h3>Add New Expense</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Amount (₹)</label>
            <input 
              type="number" 
              placeholder="0.00"
              required 
              value={formData.amount} 
              onChange={e => setFormData({...formData, amount: e.target.value})} 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.expense_date} onChange={e => setFormData({...formData, expense_date: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="What was this for?"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;