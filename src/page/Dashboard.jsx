import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RoundedLogo from "../assets/RoundedLogo.png";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="flex flex-col  h-screen bg-gradient-to-r from-neutral-900 to-indigo-600">
      <nav>
        <div className="flex items-center justify-between px-4 py- text-white">
          <img
            src={RoundedLogo}
            className=" mt-4 w-24 object-cover"
            alt="logo"
          />
          <button
            onClick={handleLogout}
            className=" py-3 px-2 bg-pink-700 hover:bg-pink-800 rounded-2xl text-white"
          >
            Déconnexion
          </button>
        </div>
      </nav>
      <h1 className="text-3xl font-bold text-center text-white mt-4">
        Hello, {user?.displayName || "Utilisateur"}! 👋
      </h1>
      <p className="text-lg text-white mt-7">Bienvenue sur ton Dashboard !</p>
    </div>
  );
};

export default Dashboard;
