import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        <NavLink
          to="/admin/pending"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
            }`
          }
        >
          Pending
        </NavLink>

        <NavLink
          to="/admin/approved"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
            }`
          }
        >
          Approved
        </NavLink>

        <NavLink
          to="/admin/rejected"
          className={({ isActive }) =>
            `pb-2 ${
              isActive
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
            }`
          }
        >
          Rejected
        </NavLink>
      </div>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}

export default AdminLayout;
