import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";

// ADMIN
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApprovedEvents from "./pages/admin/AdminApprovedEvents";
import AdminRejectedEvents from "./pages/admin/AdminRejectedEvents";
import AdminLayout from "./pages/admin/AdminLayout";

// TEACHER
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateEvent from "./pages/teacher/CreateEvent";

// STUDENT
import MyEvents from "./pages/student/MyEvents";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />

      <Routes>
        {/*  PUBLIC */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/events" /> : <Login />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/events" /> : <Signup />}
        />

        {/*  EVENTS (ALL ROLES)  */}
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={["STUDENT", "TEACHER", "ADMIN"]}>
              <Events />
            </ProtectedRoute>
          }
        />

        {/*  ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="pending" element={<AdminDashboard />} />
            <Route path="approved" element={<AdminApprovedEvents />} />
            <Route path="rejected" element={<AdminRejectedEvents />} />
          </Route>
        </Route>

        {/*  TEACHER  */}
        <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/create" element={<CreateEvent />} />
        </Route>

        {/*  STUDENT  */}
        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/student/my-events" element={<MyEvents />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
