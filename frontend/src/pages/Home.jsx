import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Calendar,
  Bell,
  BarChart3,
} from "lucide-react";

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
    <div className="bg-white text-slate-900 overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">

        {/* BACKGROUND */}
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-200 rounded-full blur-3xl opacity-40"></div>

        {/* BADGE */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium"
        >
          🚀 Smart Campus Management System
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          One Platform for <br />
          <span className="text-blue-900">Your Entire Campus</span>
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl text-gray-600 mt-6 text-lg"
        >
          Manage events, announcements, and academic workflows with a modern system.
        </motion.p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-8 flex-wrap justify-center">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 rounded-xl bg-blue-900 text-white hover:scale-105 transition"
          >
            Get Started
          </button>

          {!user && (
            <button
              onClick={handleLogin}
              className="px-8 py-3 rounded-xl border hover:scale-105 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* TRUST */}
        <div className="flex gap-8 mt-10 text-sm text-gray-500 flex-wrap justify-center">
          <span> Built for Modern Campuses</span>
          <span> Secure & Scalable</span>
          <span> Early Access Platform</span>
        </div>

        {/* 🔥 ULTRA SMOOTH AUTO SLIDER */}
        <div className="mt-16 w-full overflow-hidden">
          <div className="flex w-max gap-8 animate-scroll">

            {[...Array(2)].flatMap(() => [
              {
                title: "Hackathon 2026",
                image: "https://images.unsplash.com/photo-1551818255-e6e10975cd17",
                bg: "bg-blue-100",
              },
              {
                title: "Tech Fest",
                image: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe",
                bg: "bg-purple-100",
              },
              {
                title: "Cultural Night",
                image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
                bg: "bg-pink-100",
              },
              {
                title: "Startup Meetup",
                image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
                bg: "bg-green-100",
              },
              {
                title: "Coding Contest",
                image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
                bg: "bg-yellow-100",
              },
              {
                title: "Sports Meet",
                image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
                bg: "bg-red-100",
              },
              {
                title: "Workshop Series",
                image: "https://images.unsplash.com/photo-1558403194-611308249627",
                bg: "bg-indigo-100",
              },
              {
                title: "Seminar Talks",
                image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
                bg: "bg-orange-100",
              },
            ]).map((item, i) => (

              <div
                key={i}
                className={`min-w-[300px] rounded-3xl p-4 ${item.bg} shadow-md`}
              >
                <div className="h-56 rounded-2xl overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-white rounded-2xl p-5 mt-4 flex justify-between items-center shadow">
                  <h3 className="font-semibold text-slate-800 text-lg">
                    {item.title}
                  </h3>
                  <span className="text-xl font-bold">→</span>
                </div>
              </div>

            ))}

          </div>
        </div>

      </section>

      {/* FEATURES */}
    {/* ================= FEATURES ================= */}
<section className="relative py-24 px-6 bg-gradient-to-b from-white to-slate-50">
  
  {/* HEADER */}
  <div className="text-center mb-16">
    <h2 className="text-4xl font-extrabold text-slate-900">
      Powerful Features
    </h2>
    <p className="text-gray-600 mt-4 max-w-xl mx-auto">
      Everything you need to manage and scale your campus digitally
    </p>
  </div>

  {/* CARDS */}
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

    {[
      {
        icon: <Calendar size={28} />,
        title: "Event Management",
        desc: "Create, manage and track all campus events in one place",
        color: "from-blue-500 to-indigo-500",
      },
      {
        icon: <Bell size={28} />,
        title: "Announcements",
        desc: "Send instant updates and notifications to everyone",
        color: "from-purple-500 to-pink-500",
      },
      {
        icon: <BarChart3 size={28} />,
        title: "Analytics",
        desc: "Get insights on participation and engagement",
        color: "from-green-500 to-emerald-500",
      },
    ].map((item, i) => (

      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/70 border border-white/40 shadow-lg hover:shadow-2xl transition"
      >

        {/* ICON */}
        <div
          className={`w-14 h-14 flex items-center justify-center rounded-xl text-white mb-6 bg-gradient-to-br ${item.color} shadow-md`}
        >
          {item.icon}
        </div>

        {/* TEXT */}
        <h3 className="text-xl font-bold text-slate-900">
          {item.title}
        </h3>

        <p className="text-gray-600 mt-3 text-sm leading-relaxed">
          {item.desc}
        </p>

        {/* HOVER GLOW */}
        <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition bg-gradient-to-br from-blue-100 to-purple-100 blur-2xl -z-10"></div>

      </motion.div>

    ))}

  </div>
</section>


{/* ================= ROLES ================= */}
<section className="py-24 px-6 bg-slate-50">

  {/* HEADER */}
  <div className="text-center mb-16">
    <h2 className="text-4xl font-extrabold text-slate-900">
      Built for Everyone
    </h2>
    <p className="text-gray-600 mt-4">
      Designed for students, faculty and administrators
    </p>
  </div>

  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

    {[
      {
        icon: <GraduationCap size={30} />,
        title: "Students",
        desc: "Explore events, register instantly and stay updated",
      },
      {
        icon: <Users size={30} />,
        title: "Teachers",
        desc: "Organize activities and communicate with students",
      },
      {
        icon: <ShieldCheck size={30} />,
        title: "Admins",
        desc: "Control, monitor and manage the entire system",
      },
    ].map((role, i) => (

      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.2 }}
        whileHover={{ y: -10 }}
        className="relative p-10 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition border"
      >

        {/* ICON */}
        <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-100 text-blue-900 mb-6">
          {role.icon}
        </div>

        {/* TEXT */}
        <h3 className="text-xl font-bold text-slate-900">
          {role.title}
        </h3>

        <p className="text-gray-600 mt-3 text-sm">
          {role.desc}
        </p>

        {/* DECOR */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-30"></div>

      </motion.div>

    ))}

  </div>
</section>

{/* ================= CTA ================= */}
<section className="relative py-28 px-6 text-center overflow-hidden">

  {/* 🔥 SOFT ANIMATED GRADIENT BACKGROUND */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 animate-gradient-x"></div>

  {/* 🌈 SOFT GLOW (lighter + smoother) */}
  <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-blue-300 rounded-full blur-[140px] opacity-40"></div>
  <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] bg-purple-300 rounded-full blur-[140px] opacity-40"></div>
  <div className="absolute top-1/2 left-1/2 w-[250px] h-[250px] bg-indigo-300 rounded-full blur-[120px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>

  {/* ✨ GRID OVERLAY (softer visibility) */}
  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] [background-size:22px_22px]"></div>

  {/* 💎 CONTENT */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="relative z-10 text-white max-w-2xl mx-auto"
  >

    {/* TITLE */}
    <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
      Ready to Transform <br />
      <span className="bg-gradient-to-r from-blue-100 to-purple-200 text-transparent bg-clip-text">
        Your Campus?
      </span>
    </h2>

    {/* DESC */}
    <p className="mt-6 text-white/90 text-lg">
      Bring events, announcements, and collaboration into one seamless smart platform.
    </p>

    {/* BUTTON (softer gradient) */}
    <button
      onClick={handleGetStarted}
      className="mt-10 px-10 py-4 rounded-xl font-semibold text-white 
      bg-gradient-to-r from-blue-400 to-purple-400 
      shadow-lg hover:shadow-2xl hover:scale-105 
      transition duration-300"
    >
      Get Started Now 
    </button>

  </motion.div>

  {/* 🎬 ANIMATION */}
  <style jsx>{`
    @keyframes gradient-x {
      0%, 100% { background-position: left center; }
      50% { background-position: right center; }
    }
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 10s ease infinite;
    }
  `}</style>

</section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-bold mb-4">CampusConnect</h3>
            <p className="text-gray-400 text-sm">
              Smart platform to manage events, students, and campus life.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Events</li>
              <li>Announcements</li>
              <li>Analytics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Support</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Follow</h4>
            <p className="text-gray-400 text-sm">Stay connected </p>
          </div>

        </div>

        <div className="text-center text-gray-500 text-sm mt-10">
          © 2026 CampusConnect. All rights reserved.
        </div>
      </footer>

      {/* 🔥 SCROLL ANIMATION */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>

    </div>
  );
}

export default Home;