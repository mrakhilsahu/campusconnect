import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, ShieldCheck, GraduationCap } from "lucide-react";

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    if (!user) {
      navigate("/signup");
    } else {
      navigate(`/${user.role.toLowerCase()}`);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6">
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight"
        >
          One Platform for <br /> Your Entire Campus
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-gray-600 mt-6 text-lg"
        >
          CampusConnect helps students, teachers, and administrators manage
          events, announcements, and academic activities in one centralized,
          secure and professional system.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mt-10 flex-wrap justify-center"
        >
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 rounded-xl bg-blue-900 text-white font-medium shadow-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>

          {!user && (
            <button
              onClick={handleLogin}
              className="px-8 py-3 rounded-xl border border-gray-300 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
          )}
        </motion.div>
      </section>

      {/* ROLES SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        
        {/* Student Card */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
        >
          <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
            <GraduationCap className="text-blue-900" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            For Students
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Discover and register for approved events, stay updated with campus
            announcements, and manage your academic activities easily.
          </p>
        </motion.div>

        {/* Teacher Card */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
        >
          <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
            <Users className="text-blue-900" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            For Teachers
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Create and manage events, review submissions, and communicate
            efficiently with students from a centralized dashboard.
          </p>
        </motion.div>

        {/* Admin Card */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300"
        >
          <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-xl mb-6">
            <ShieldCheck className="text-blue-900" size={28} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-slate-900">
            For Admins
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Approve events, manage user roles, maintain platform integrity,
            and ensure trust across the entire campus ecosystem.
          </p>
        </motion.div>

      </section>
    </div>
  );
}

export default Home;