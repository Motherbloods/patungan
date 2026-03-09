import { useParams } from "react-router-dom";
import groupList from "../config/group_list";
import { GroupHeader } from "../components/GroupHeader";
import AddExpenseForm from "../components/AddExpenseForm";
import { useState } from "react";

function GroupDetail() {
  const { id } = useParams();

  const group = groupList.find((g) => g.id === Number(id));

  const [showForm, setShowForm] = useState(false);

  const handleAddExpense = (expenseData) => {
    console.log("Adding expense:", expenseData);
  };

  const handleCancelExpense = () => {
    console.log("Expense addition cancelled");
    setShowForm(false);
  };
  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      <GroupHeader groupConfig={group} />
      <div className="flex-1 px-4 py-5 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        {showForm ? (
          <AddExpenseForm
            members={group.members}
            onCancel={handleCancelExpense}
            onSubmit={handleAddExpense}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-500 font-semibold text-sm py-3 rounded-2xl transition-all duration-150"
          >
            <span className="text-lg">＋</span>
            Tambah Pengeluaran
          </button>
        )}
      </div>
    </div>
  );
}

export default GroupDetail;
