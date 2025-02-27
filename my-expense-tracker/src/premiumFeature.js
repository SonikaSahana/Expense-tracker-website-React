import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, activateDarkMode } from "../src/store/themeSlice";

const PremiumFeature = ({ expenses }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const isPremiumActivated = useSelector((state) => state.theme.isPremiumActivated);
  const totalAmount = useSelector((state) => state.expenses.totalAmount);

  const handleDownloadCSV = () => {
    const csvRows = [
      ["ID", "Amount", "Description", "Category", "Date"],
      ...expenses.map((exp) => [exp.id, exp.amount, exp.description, exp.category, exp.createdAt]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center mt-4">
     {totalAmount > 10000 && !isPremiumActivated && (
        <button className="btn btn-dark btn-lg mb-3" onClick={() => dispatch(activateDarkMode())}>
          🚀 Activate Premium 
        </button>
      )}

      <button className="btn btn-primary me-2" onClick={() => dispatch(toggleTheme())}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <button className="btn btn-success" onClick={handleDownloadCSV}>
        📂 Download Expenses (CSV)
      </button>
    </div>
  );
};

export default PremiumFeature;
