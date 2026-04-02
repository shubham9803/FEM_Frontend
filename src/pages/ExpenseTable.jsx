import React from "react";

const ExpenseTable = ({ data, onEdit, onDelete, currentUserId }) => {
  if (data.length === 0) return <p className="no-data">No expenses found for this period.</p>;

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Mode</th>
          <th>Description</th>
          <th>Actions</th> {/* New Column */}
        </tr>
      </thead>
      <tbody>
        {data.map((exp) => (
          <tr key={exp.id}>
            <td>{exp.expense_date}</td>
            <td>
              <span className={`badge ${exp.category.toLowerCase()}`}>
                {exp.category.replace("_", " ")}
              </span>
            </td>
            <td className="amount-cell">₹{parseFloat(exp.amount).toLocaleString()}</td>
            <td>{exp.payment_mode}</td>
            <td className="desc-text">{exp.description || "-"}</td>
            <td>
              {/* Only show buttons if the user added this expense */}
              {exp.added_by === currentUserId && (
                <div className="action-btns">
                  <button className="edit-icon" onClick={() => onEdit(exp)}>✏️</button>
                  <button className="delete-icon" onClick={() => onDelete(exp.id)}>🗑️</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseTable;