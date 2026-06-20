import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8">
          {[
            { name: "Pending", path: "/admin/pending" },
            { name: "Approved", path: "/admin/approved" },
            { name: "Rejected", path: "/admin/rejected" },
          ].map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.path}
              className={({ isActive }) =>
                `pb-3 text-sm transition ${
                  isActive
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
