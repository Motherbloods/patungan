import { useParams } from "react-router-dom";
import { TABS } from "../config/tabs";
import { GroupHeader } from "../components/GroupHeader";
import AddExpenseForm from "../components/AddExpenseForm";
import { useState, useRef, useEffect } from "react";
import TabRingkasan from "../components/tabs/TabRingkasan";
import TabTransaksi from "../components/tabs/TabTransaksi";
import TabTransfer from "../components/tabs/TabTransfer";
import TabRiwayat from "../components/tabs/TabRiwayat";
import { useGroupDetail } from "../hooks/useGroups";
import {
  useCreateExpense,
  useDeleteExpense,
  useEditExpense,
  useGetHistory,
  useGetSettlements,
  useGetTransactions,
  useCreateSettlement,
} from "../hooks/useExpenses";
import LoadingFallback from "../components/fallback/LoadingFallback";
import ErrorFallback from "../components/fallback/ErrorFallback";
import NotFoundFallback from "../components/fallback/NotFoundFallback";
import toast from "react-hot-toast";

function GroupDetail() {
  const { id } = useParams();

  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const formRef = useRef(null);

  const {
    data: group = null,
    isLoading: isGroupLoading,
    error: groupError,
  } = useGroupDetail(id);

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useGetTransactions(id, activeTab === "transaksi");

  const {
    data: settlement = [],
    isLoading: isSettlementLoading,
    error: settlementError,
  } = useGetSettlements(id, activeTab === "transfer");

  const {
    data: history = [],
    isLoading: isHistoryLoading,
    error: historyError,
  } = useGetHistory(id, activeTab === "riwayat");

  const { mutate: createExpense } = useCreateExpense();
  const { mutate: editExpense } = useEditExpense();
  const { mutate: deleteExpense } = useDeleteExpense();
  const { mutate: createSettlement } = useCreateSettlement();

  useEffect(() => {
    if (showForm && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [showForm]);

  const handleSubmitExpense = (expenseData) => {
    setIsSubmitting(true);

    if (selectedExpense) {
      editExpense(
        { group_id: id, expense_id: selectedExpense._id, data: expenseData },
        {
          onSuccess: () => {
            setShowForm(false);
            setSelectedExpense(null);
            setIsSubmitting(false);
            toast.success("Pengeluaran berhasil diperbarui");
          },
          onError: () => {
            setIsSubmitting(false);
            toast.error("Gagal memperbarui pengeluaran");
          },
        },
      );
    } else {
      createExpense(expenseData, {
        onSuccess: () => {
          setShowForm(false);
          setIsSubmitting(false);
          toast.success("Pengeluaran berhasil ditambahkan");
        },
        onError: () => {
          setIsSubmitting(false);
          toast.error("Gagal menambahkan pengeluaran");
        },
      });
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleDelete = (expense_id) => {
    setDeletingId(expense_id);
    deleteExpense(
      { group_id: id, expense_id },
      {
        onSuccess: () => {
          setDeletingId(null);
          toast.success("Pengeluaran berhasil dihapus");
        },
        onError: () => {
          setDeletingId(null);
          toast.error("Gagal menghapus pengeluaran");
        },
      },
    );
  };

  const handleCancelExpense = () => {
    setShowForm(false);
    setSelectedExpense(null);
  };

  if (isGroupLoading)
    return <LoadingFallback message="Loading group details..." />;

  if (groupError) return <ErrorFallback message={groupError} />;
  if (!group) return <NotFoundFallback message="Group not found." />;

  const ownerMemberId = group.ownerMemberId ?? null;

  const tabIsLoading =
    (activeTab === "transaksi" && isTransactionsLoading) ||
    (activeTab === "transfer" && isSettlementLoading) ||
    (activeTab === "riwayat" && isHistoryLoading);

  const tabError =
    (activeTab === "transaksi" && transactionsError) ||
    (activeTab === "transfer" && settlementError) ||
    (activeTab === "riwayat" && historyError);

  return (
    <div className="min-h-full bg-secondary flex flex-col">
      <GroupHeader groupConfig={group} />
      <div className="flex-1 px-4 py-5 sm:px-6 max-w-2xl mx-auto w-full space-y-4">
        <div ref={formRef}>
          {showForm ? (
            <AddExpenseForm
              members={group.members}
              onCancel={handleCancelExpense}
              onSubmit={handleSubmitExpense}
              isEditing={!!selectedExpense}
              initialData={selectedExpense}
              isSubmitting={isSubmitting}
            />
          ) : (
            <button
              onClick={() => {
                setSelectedExpense(null);
                setShowForm(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary border-2 border-dashed border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-500 font-semibold text-sm py-3 rounded-2xl transition-all duration-150"
            >
              <span className="text-lg">＋</span>
              Tambah Pengeluaran
            </button>
          )}
        </div>

        <div className="bg-primary rounded-2xl shadow-sm p-1 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-bold transition-all duration-150"
              style={{
                background: activeTab === tab.id ? "#EEF2FF" : "transparent",
                color:
                  activeTab === tab.id
                    ? "#4F46E5"
                    : "var(--color-text-secondary)",
              }}
            >
              <span className="text-base">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {tabIsLoading ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-sm text-secondary">Memuat data...</p>
          </div>
        ) : tabError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-red-500">
              Gagal memuat data. Coba lagi.
            </p>
          </div>
        ) : (
          <>
            {activeTab === "ringkasan" && (
              <TabRingkasan
                members={group.members}
                balances={group.balances}
                ownerMemberId={ownerMemberId}
              />
            )}
            {activeTab === "transaksi" && (
              <TabTransaksi
                members={group.members}
                expenses={transactions.expenses}
                ownerMemberId={ownerMemberId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            )}
            {activeTab === "transfer" && (
              <TabTransfer
                members={group.members}
                settlements={settlement.settlements}
                suggestions={settlement.suggestions}
                ownerMemberId={ownerMemberId}
                onSettle={(s) => {
                  createSettlement(s, {
                    onSuccess: () => toast.success("Transfer berhasil dicatat"),
                    onError: () => toast.error("Gagal mencatat transfer"),
                  });
                }}
              />
            )}
            {activeTab === "riwayat" && (
              <TabRiwayat
                members={group.members}
                balances={group.balances}
                history={history.history}
                ownerMemberId={ownerMemberId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GroupDetail;
