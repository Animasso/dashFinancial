import { db } from "../firebase";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
export const getTransactions = async (userId) => {
  try {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions :", error);
    return [];
  }
};

export const addTransaction = async ({ type, amount, category, userId }) => {
  try {
    await addDoc(collection(db, "transactions"), {
      type,
      amount: Number(amount),
      category,
      userId,
      createdAt: serverTimestamp(),
    });
    console.log("Transaction ajoutée !");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction :", error);
  }
};

export const saveBudget = async ({ amount, userId }) => {
  try {
    await addDoc(collection(db, "budget"), {
      amount: Number(amount),
      userId,
      createdAt: serverTimestamp(),
    });
    console.log("Budget sauvegardé !");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du budget :", error);
  }
};
