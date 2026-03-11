export const summaryData = {
  totalOwe: 125000,
  totalOwed: 310000,
  activeGroups: 0,
  totalExpenses: 14000,
};

export const recentActivity = [
  {
    id: 1,
    type: "expense",
    groupName: "Liburan Bandung",
    desc: "Makan Malam",
    amount: 150000,
    paidBy: "Alice",
    time: "2 jam lalu",
  },
  {
    id: 2,
    type: "settlement",
    groupName: "Kos Bareng",
    desc: "Transfer ke Budi",
    amount: 45000,
    paidBy: "Kamu",
    time: "Kemarin",
  },
  {
    id: 3,
    type: "expense",
    groupName: "Tim Kantor",
    desc: "Makan Siang Bareng",
    amount: 90000,
    paidBy: "Charlie",
    time: "Kemarin",
  },
  {
    id: 4,
    type: "expense",
    groupName: "Liburan Bandung",
    desc: "Bensin",
    amount: 60000,
    paidBy: "Kamu",
    time: "2 hari lalu",
  },
  {
    id: 5,
    type: "settlement",
    groupName: "Kos Bareng",
    desc: "Terima dari Dina",
    amount: 80000,
    paidBy: "Kamu",
    time: "3 hari lalu",
  },
];

export const generateGroupSummaries = (groupList) => {
  return groupList.map((g, i) => ({
    ...g,
    memberCount: [3, 4, 2, 5, 3][i % 5],
    expenseCount: [6, 3, 8, 2, 5][i % 5],
    myBalance: [70000, -45000, 0, 120000, -30000][i % 5],
    totalSpent: [450000, 300000, 150000, 820000, 200000][i % 5],
  }));
};
