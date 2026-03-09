import { useParams } from "react-router-dom";
import { TABS } from "../config/tabs";
import { GroupHeader } from "../components/GroupHeader";
import AddExpenseForm from "../components/AddExpenseForm";
import { useState } from "react";
import TabRingkasan from "../components/tabs/TabRingkasan";
import TabTransaksi from "../components/tabs/TabTransaksi";
import TabTransfer from "../components/tabs/TabTransfer";
import TabRiwayat from "../components/tabs/TabRiwayat";
import useGroupDetail from "../hooks/useGroupDetail";
import LoadingFallback from "../components/fallback/LoadingFallback";
import ErrorFallback from "../components/fallback/ErrorFallback";
import NotFoundFallback from "../components/fallback/NotFoundFallback";

function GroupDetail() {
  const { id } = useParams();

  const { loading, error, group } = useGroupDetail(id);

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("ringkasan");

  const handleAddExpense = (expenseData) => {
    console.log("Adding expense:", expenseData);
  };

  const handleCancelExpense = () => {
    console.log("Expense addition cancelled");
    setShowForm(false);
  };

  if (loading) return <LoadingFallback message="Loading group details..." />;
  if (error) return <ErrorFallback message={error} />;
  if (!group) return <NotFoundFallback message="Group not found." />;

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

        <div className="bg-white rounded-2xl shadow-sm p-1 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-150"
              style={{
                background: activeTab === tab.id ? "#EEF2FF" : "transparent",
                color: activeTab === tab.id ? "#4F46E5" : "#9CA3AF",
              }}
            >
              <span className="text-base">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "ringkasan" && (
          <TabRingkasan members={group.members} balances={group.balances} />
        )}
        {activeTab === "transaksi" && (
          <TabTransaksi members={group.members} expenses={group.expenses} />
        )}
        {activeTab === "transfer" && (
          <TabTransfer
            members={group.members}
            settlements={group.settlements}
          />
        )}
        {activeTab === "riwayat" && (
          <TabRiwayat
            members={group.members}
            balances={group.balances}
            history={group.history}
          />
        )}
      </div>
    </div>
  );
}

export default GroupDetail;
