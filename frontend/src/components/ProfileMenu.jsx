import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { LogOut, Settings } from "lucide-react";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  const letter =
    user.name?.charAt(0).toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button (Circle Only) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {letter}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">

          {/* User Info */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-gray-800 font-semibold">
              {user.name}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {user.role}
            </p>
          </div>

          {/* Profile */}
          <button
            onClick={handleProfile}
            className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            <Settings size={18} />
            Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;