import Modal from "react-modal";
import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
Modal.setAppElement("#root");
const ModalForm = ({ isOpen, onClose, addTransaction }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("income");

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || category.trim() === "") {
      alert("Tous les champs sont requis !");
      return;
    }

    addTransaction(amount, category, type);
    setAmount("");
    setCategory("");
    setType("income");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      aria-label="Close the modal"
      onRequestClose={onClose}
      contentLabel="Add a transaction"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          padding: "50px",
          borderRadius: "10px",
          width: "400px",
          fontFamily: "Doto, sans-serif",
          fontSize: "20px",
          color: "#333",
          lineHeight: "1.5",
          marginBottom: "5px",
        },
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          fontSize: "20px",
        }}
      >
        <IoMdCloseCircle />
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className=" mb-3 text-3xl">Add a Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Amount :</label>
            <input
              className=" mb-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-blue-500 focus:border-blue-500"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              required
            />
          </div>
          <div>
            <label>Category :</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="ml-2 mb-3"
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Rent">Rent</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bill">Bill</option>
              <option value="Unexpected">Unexpected</option>
            </select>
          </div>
          <div>
            <label>Type :</label>
            <select
              value={type}
              className=" mb-3"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className=" mt-7 flex justify-center text-center">
            <button
              className=" hover:bg-slate-500 w-3/4 bg-gray-700 rounded-lg py-4 px-4 shadow-lg font-sans text-base text-white"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default ModalForm;
