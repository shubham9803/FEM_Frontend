import { useState } from "react";
import axiosInstance from "../api/axios";

// Synchronized with Django TextChoices
const CATEGORIES = [
  "GROCERIES", "VEGETABLES", "RENT", "MEDICAL", "TRAVEL", 
  "CLOTHING", "KITCHEN", "ELECTRONICS", "DINING_OUT", 
  "EDUCATION", "ENTERTAINMENT", "UTILITIES", "FUEL", 
  "INTERNET", "MAINTENANCE", "OTHER"
];

const MODES = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "CARD", label: "Card" },
  { value: "NETBANKING", label: "Net Banking" }
];

const ExpenseModal = ({ onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "GROCERIES",
    amount: "",
    description: "",
    payment_mode: "CASH", // Now properly initialized
    expense_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("api/expenses/create/", formData);
      onSave();
      onClose();
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <h3>Add New Expense</h3>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Amount (₹)</label>
            <input 
              type="number" 
              step="0.01" // Important for DecimalField
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
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.expense_date} onChange={e => setFormData({...formData, expense_date: e.target.value})} />
            </div>
          </div>

          {/* NEW: Payment Mode Selection */}
          <div className="form-group">
            <label>Payment Mode</label>
            <select 
              value={formData.payment_mode} 
              onChange={e => setFormData({...formData, payment_mode: e.target.value})}
            >
              {MODES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
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