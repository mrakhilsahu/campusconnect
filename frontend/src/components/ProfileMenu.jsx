import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { LogOut, LayoutDashboard } from "lucide-react";

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const letter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const handleDashboard = () => {
    setOpen(false);
    if (user?.role === "STUDENT") navigate("/student");
    else if (user?.role === "TEACHER") navigate("/teacher");
    else if (user?.role === "ADMIN") navigate("/admin/pending");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {letter}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-gray-800 font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm mt-0.5">{user.role}</p>
          </div>

          <button
            onClick={handleDashboard}
            className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

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
