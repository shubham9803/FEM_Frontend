import { useEffect, useState, useMemo } from "react";
import axiosInstance from "../api/axios";
import "../styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { logout, user } = useAuth();
  const [formData, setFormData] = useState({
    category: "GROCERIES",
    amount: "",
    description: "",
    payment_mode: "CASH",
    expense_date: "",
  });

  const categories = [
    "CLOTHING","KITCHEN","VEGETABLES","ELECTRONICS",
    "RENT","DINING_OUT","GROCERIES","MEDICAL","TRAVEL",
    "EDUCATION","ENTERTAINMENT","UTILITIES",
    "FUEL","INTERNET","MAINTENANCE","OTHER"
  ];

  const paymentModes = ["CASH","UPI","CARD","NETBANKING"];

  const fetchDashboardData = async () => {
    try {
      const [familyRes, membersRes, expensesRes] = await Promise.all([
        axiosInstance.get("api/family/me/"),
        axiosInstance.get("api/family/members/"),
        axiosInstance.get("api/expenses/list/"),
      ]);

      setFamily(familyRes.data);
      setMembers(membersRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((exp) => {
      const expDate = new Date(exp.expense_date);
      return (
        expDate.getMonth() === now.getMonth() &&
        expDate.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  const finalFilteredExpenses = useMemo(() => {
    let filtered = currentMonthExpenses;

    if (selectedDate) {
      filtered = filtered.filter(
        (exp) => exp.expense_date === selectedDate
      );
    }

    if (selectedMember) {
      filtered = filtered.filter(
        (exp) => exp.added_by === selectedMember
      );
    }

    return filtered;
  }, [currentMonthExpenses, selectedDate, selectedMember]);

  const totalAmount = useMemo(() => {
    return finalFilteredExpenses.reduce(
      (sum, exp) => sum + parseFloat(exp.amount),
      0
    );
  }, [finalFilteredExpenses]);

  const handleCreateExpense = async () => {
    try {
      await axiosInstance.post("api/expenses/create/", formData);

      setShowModal(false);
      setFormData({
        category: "GROCERIES",
        amount: "",
        description: "",
        payment_mode: "CASH",
        expense_date: "",
      });

      fetchDashboardData();
    } catch (error) {
      console.error("Create expense error", error);
    }
  };

  if (loading)
    return <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>Loading...</div>;

  return (
    <div className="dashboard-container">

      {/* ROW 1 */}
      <div className="dashboard-row top-row">

        <div className="glass-card">
          <h3>{user.fname}</h3>
          <button className="logout-btn" onClick={logout}>
    Logout
  </button>
        </div>

        <div className="glass-card">
          <h3>Family Details</h3>
          <p><strong>Name:</strong> {family?.name}</p>
          <p><strong>Invite Code:</strong> {family?.code}</p>
        </div>

        <div className="glass-card">
          <h3>Family Members</h3>
          <div className="members-row">
            {members.map((member) => (
              <div key={member.id} className="member-pill">
                {member.fname}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ROW 2 */}
      <div className="glass-card full-width">
        <h3>Filters</h3>

        <div className="filter-row">
          <div>
            <label>Date</label><br/>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div>
            <label>Family Member</label><br/>
            <select
              value={selectedMember || ""}
              onChange={(e) =>
                setSelectedMember(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">All Members</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fname} {member.lname}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ROW 3 */}
      <div className="dashboard-row total-row">

        <div className="glass-card total-card">
          <h3>Total Expense (This Month)</h3>
          <div className="total-amount">
            ₹ {totalAmount.toFixed(2)}
          </div>
        </div>

        <div className="glass-card add-card">
          <button
            className="primary-btn"
            onClick={() => setShowModal(true)}
          >
            + Add Expense
          </button>
        </div>

      </div>

      {/* ROW 4 */}
      <div className="glass-card full-width">
        <h3>Expenses</h3>

        {finalFilteredExpenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {finalFilteredExpenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.expense_date}</td>
                  <td>{exp.category}</td>
                  <td>₹ {exp.amount}</td>
                  <td>{exp.payment_mode}</td>
                  <td>{exp.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Expense</h3>

            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />

            <input
              type="date"
              value={formData.expense_date}
              onChange={(e) =>
                setFormData({ ...formData, expense_date: e.target.value })
              }
            />

            <select
              value={formData.payment_mode}
              onChange={(e) =>
                setFormData({ ...formData, payment_mode: e.target.value })
              }
            >
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div style={{ marginTop: "15px" }}>
              <button className="primary-btn" onClick={handleCreateExpense}>
                Save
              </button>
              <button className="primary-btn"
                style={{ marginLeft: "10px" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;