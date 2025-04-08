import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import RoundedLogo from "../assets/RoundedLogo.png";
import ModalForm from "../components/ModalForm";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";
import Modal from "react-modal";

Modal.setAppElement("#root");

const COLORS = ["#00C49F", "#FF8042"];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const budgetRef = doc(db, "budgets", currentUser.uid);
        const budgetSnap = await getDoc(budgetRef);
        if (budgetSnap.exists()) {
          setBudget(budgetSnap.data().amount);
        }
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      const q = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const userTransactions = querySnapshot.docs.map((doc) => doc.data());
      setTransactions(userTransactions);
    };
    fetchTransactions();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleBudgetChange = async (e) => {
    const newBudget = e.target.value;
    setBudget(newBudget);
    if (user) {
      const budgetRef = doc(db, "budgets", user.uid);
      await setDoc(budgetRef, { amount: parseFloat(newBudget) || 0 });
    }
  };

  const addTransaction = async (amount, category, type) => {
    if (!amount || !category || !user) {
      return alert("Remplis tous les champs !");
    }

    const transactionWithParsedAmount = {
      type,
      amount: parseFloat(amount),
      category,
      uid: user.uid,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "transactions"), transactionWithParsedAmount);
      setTransactions((prev) => [...prev, transactionWithParsedAmount]);
      setTransactionAmount("");
      setTransactionCategory("");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const incomeData = transactions
    .filter((t) => t.type === "income")
    .map((t) => ({ name: t.category, value: t.amount }));

  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({ name: t.category, value: t.amount }));

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const wallet = budget + totalIncome - totalExpense;
  const chartData = [
    { name: "Budget", value: parseFloat(budget) || 0 },
    { name: "In my Wallet", value: wallet },
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div
      className="flex flex-col   bg-gradient-to-r from-neutral-900 to-indigo-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <nav>
        <div className="flex items-center justify-between px-4 py-4 text-white">
          <img
            src={RoundedLogo}
            className="mt-4 w-24 object-cover rounded-full"
            alt="logo"
          />
          <button
            onClick={handleLogout}
            className="py-3 px-4 bg-pink-700 hover:bg-pink-800 rounded-2xl text-white"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <motion.h1
        className="text-3xl font-bold text-center text-white mt-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      >
        Hello, {user?.displayName || "Utilisateur"}! 👋
      </motion.h1>
      <p className="text-lg text-white mt-7 text-center">
        Bienvenue sur ton Dashboard !
      </p>

      <div className="flex flex-col items-center gap-5 mt-6">
        <input
          className="w-full max-w-sm bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Budget"
        />
        <button
          className="bg-pink-700 hover:bg-pink-800 rounded-2xl text-white  p-4 shadow-lg font-doto"
          onClick={() => setIsModalOpen(true)}
        >
          Add Transaction
        </button>

        {/* Bar Chart */}
        <div className="w-full max-w-3xl h-64 bg-white rounded-xl shadow-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h2 className="text-lg  text-white font-bold mb-2">Revenus</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={incomeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#00C49F"
                label
              >
                {incomeData.map((_, index) => (
                  <Cell
                    key={`income-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div>
            <h2 className="text-lg text-white font-bold mb-2">Dépenses</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#FF8042"
                label
              >
                {expenseData.map((_, index) => (
                  <Cell
                    key={`expense-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        {/* Transaction List */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-4 mt-4">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Liste des Transactions
          </h2>
          <ul className="space-y-2">
            {transactions.map((t, index) => (
              <li
                key={index}
                className="flex justify-between items-center px-4 py-2 bg-slate-100 rounded-lg"
              >
                <span className="text-gray-700 font-medium">{t.category}</span>
                <span
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTransaction={(amount, category, type) =>
          addTransaction(amount, category, type)
        }
      />
    </div>
  );
};

export default Dashboard;
