import React from "react";

const ExpenseTable = ({ data }) => {
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
        </tr>
      </thead>
      <tbody>
        {data.map((exp) => (
          <tr key={exp.id}>
            <td data-label="Date">{exp.expense_date}</td>
            <td data-label="Category">
              <span className={`badge ${exp.category.toLowerCase()}`}>
                {exp.category.replace("_", " ")}
              </span>
            </td>
            <td data-label="Amount" className="amount-cell">
              ₹{parseFloat(exp.amount).toLocaleString()}
            </td>
            <td data-label="Mode">{exp.payment_mode}</td>
            <td data-label="Description" className="desc-text">{exp.description || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExpenseTable;