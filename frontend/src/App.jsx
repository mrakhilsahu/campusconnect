import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AIAssistant from "./components/AIAssistant";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events";
import VerifyCertificate from "./pages/VerifyCertificate";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyEvents from "./pages/student/MyEvents";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateEvent from "./pages/teacher/CreateEvent";
import AttendancePage from "./pages/teacher/AttendancePage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminApprovedEvents from "./pages/admin/AdminApprovedEvents";
import AdminRejectedEvents from "./pages/admin/AdminRejectedEvents";

function RoleDashboardRedirect() {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "STUDENT") return <Navigate to="/student" replace />;
  if (user.role === "TEACHER") return <Navigate to="/teacher" replace />;
  return <Navigate to="/admin/pending" replace />;
}

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        <Route path="/login" element={user ? <RoleDashboardRedirect /> : <Login />} />
        <Route path="/signup" element={user ? <RoleDashboardRedirect /> : <Signup />} />

        <Route element={<ProtectedRoute allowedRoles={["STUDENT", "TEACHER", "ADMIN"]} />}>
          <Route path="/events" element={<Events />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="pending" element={<AdminDashboard />} />
            <Route path="approved" element={<AdminApprovedEvents />} />
            <Route path="rejected" element={<AdminRejectedEvents />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/create" element={<CreateEvent />} />
          <Route path="/teacher/attendance/:eventId" element={<AttendancePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/my-events" element={<MyEvents />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AIAssistant />
    </ErrorBoundary>
  );
}

export default App;
