import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          CampusConnect
        </Link>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          
          <Link
            to="/events"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Events
          </Link>

          {user?.role === "STUDENT" && (
            <Link
              to="/student/my-events"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              My Events
            </Link>
          )}

          {user?.role === "TEACHER" && (
            <>
              <Link
                to="/teacher"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/teacher/create"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Create Event
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/admin/pending"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Pending
              </Link>
              <Link
                to="/admin/approved"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Approved
              </Link>
              <Link
                to="/admin/rejected"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Rejected
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <ProfileMenu />
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 pb-6 space-y-4 text-sm font-medium shadow-md">
          
          <Link
            to="/events"
            onClick={() => setOpen(false)}
            className="block text-gray-700 hover:text-blue-600"
          >
            Events
          </Link>

          {user?.role === "STUDENT" && (
            <Link
              to="/student/my-events"
              onClick={() => setOpen(false)}
              className="block text-gray-700 hover:text-blue-600"
            >
              My Events
            </Link>
          )}

          {user?.role === "TEACHER" && (
            <>
              <Link
                to="/teacher"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                to="/teacher/create"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Create Event
              </Link>
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/admin/pending"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Pending
              </Link>
              <Link
                to="/admin/approved"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Approved
              </Link>
              <Link
                to="/admin/rejected"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Rejected
              </Link>
            </>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="block bg-blue-600 text-white text-center py-2 rounded-xl"
              >
                Signup
              </Link>
            </>
          ) : (
            <ProfileMenu />
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;