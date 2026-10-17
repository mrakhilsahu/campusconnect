import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { getApprovedEvents } from "../api/events";
import eventsImage from "../assets/home-cards/events.svg";
import attendanceImage from "../assets/home-cards/attendance.svg";
import aiImage from "../assets/home-cards/ai.svg";
import approvalImage from "../assets/home-cards/approval.svg";
import communityImage from "../assets/home-cards/community.svg";
import calendarImage from "../assets/home-cards/calendar.svg";

const slides = [
  { image: eventsImage, tag: "Event management", title: "Plan events without the chaos", text: "Create, approve and discover campus events from one place." },
  { image: attendanceImage, tag: "Attendance", title: "Keep participation simple", text: "Track registrations and attendance with a clean workflow." },
  { image: aiImage, tag: "Campus AI", title: "Ask your campus assistant", text: "Get answers about your authorized events and participation." },
  { image: approvalImage, tag: "Approvals", title: "Move ideas into action", text: "Give teachers and admins a clear event approval workflow." },
  { image: communityImage, tag: "Community", title: "Bring students together", text: "Make it easier for students to discover what is happening." },
  { image: calendarImage, tag: "Campus calendar", title: "See what is coming up", text: "Keep upcoming activities visible and easy to find." },
];

const features = [
  { icon: CalendarCheck2, title: "Event management", text: "Create, approve, discover and manage campus events from one place." },
  { icon: ShieldCheck, title: "Role-based access", text: "Separate workflows for students, teachers and administrators." },
  { icon: Users, title: "Registration & attendance", text: "Handle registrations, capacity and attendance with simple workflows." },
  { icon: Sparkles, title: "Campus AI assistant", text: "Ask questions about your authorized events, registrations and attendance." },
];

const roles = [
  { icon: GraduationCap, title: "Students", text: "Discover events, register quickly and keep track of your participation." },
  { icon: LayoutDashboard, title: "Teachers", text: "Create events, manage approvals and mark attendance." },
  { icon: ShieldCheck, title: "Admins", text: "Review event requests and manage the campus event workflow." },
];

const categoryStyle = {
  tech: "bg-blue-50 text-blue-700",
  cultural: "bg-fuchsia-50 text-fuchsia-700",
  sports: "bg-emerald-50 text-emerald-700",
  workshop: "bg-amber-50 text-amber-700",
};

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [slideStart, setSlideStart] = useState(0);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  const visibleSlides = useMemo(
    () => [0, 1, 2].map((offset) => slides[(slideStart + offset) % slides.length]),
    [slideStart]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideStart((current) => (current + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!user) return;
    setEventsLoading(true);
    getApprovedEvents()
      .then((data) => {
        const upcoming = (data.events || [])
          .filter((event) => new Date(event.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(upcoming.slice(0, 3));
      })
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  }, [user]);

  const getStarted = () => {
    if (!user) return navigate("/signup");
    if (user.role === "STUDENT") return navigate("/student");
    if (user.role === "TEACHER") return navigate("/teacher");
    return navigate("/admin/pending");
  };

  const moveSlides = (direction) => {
    setSlideStart((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="relative isolate border-b border-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_5%,rgba(37,99,235,.14),transparent_30%),radial-gradient(circle_at_10%_25%,rgba(168,85,247,.08),transparent_28%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pb-20 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                <Sparkles size={14} /> A smarter way to run campus events
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }} className="text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Your campus, <span className="text-blue-600">connected.</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .12 }} className="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg">
                Run events, registrations, approvals and attendance in one clean workspace built for college communities.
              </motion.p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={getStarted} className="group inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-blue-600">
                  {user ? "Open dashboard" : "Get started"} <ArrowRight size={17} className="transition group-hover:translate-x-0.5" />
                </button>
                {!user && <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Explore platform</button>}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Role-based workflows</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Atomic registration</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Campus AI</span>
              </div>
            </div>

            <div className="relative min-w-0">
              <div className="absolute -inset-4 rounded-[36px] bg-blue-500/[.06] blur-2xl" />
              <div className="relative rounded-[30px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_30px_90px_rgba(15,23,42,.10)] backdrop-blur-xl sm:p-4">
                <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
                  <div><p className="text-[11px] font-semibold uppercase tracking-[.18em] text-slate-400">CampusConnect</p><p className="mt-1 text-sm font-bold text-slate-800">Built around your campus</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => moveSlides(-1)} aria-label="Previous cards" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"><ArrowLeft size={15} /></button>
                    <button onClick={() => moveSlides(1)} aria-label="Next cards" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"><ArrowRight size={15} /></button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {visibleSlides.map((slide, index) => (
                    <motion.article
                      key={`${slide.title}-${slideStart}-${index}`}
                      initial={{ opacity: 0, x: index === 2 ? 20 : -8, scale: .98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: .45, ease: "easeOut" }}
                      className={`group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 ${index === 1 ? "sm:translate-y-3" : ""}`}
                    >
                      <div className="aspect-[1.08] overflow-hidden bg-slate-100">
                        <img src={slide.image} alt={slide.tag} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      </div>
                      <div className="relative -mt-10 mx-2 mb-2 rounded-[18px] border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur-xl sm:mx-2.5 sm:mb-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-blue-600">{slide.tag}</p>
                        <h2 className="mt-2 line-clamp-2 text-base font-bold leading-5 text-slate-900">{slide.title}</h2>
                        <p className="mt-2 hidden text-xs leading-5 text-slate-500 sm:block">{slide.text}</p>
                        <button onClick={getStarted} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-700 transition group-hover:text-blue-600">Explore <ArrowRight size={13} /></button>
                      </div>
                    </motion.article>
                  ))}
                </div>
                <div className="mt-4 flex justify-center gap-1.5">
                  {slides.map((_, index) => <button key={index} aria-label={`Show card set ${index + 1}`} onClick={() => setSlideStart(index)} className={`h-1.5 rounded-full transition-all ${index === slideStart ? "w-8 bg-blue-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"}`} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-semibold text-blue-600">Upcoming on campus</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s happening next?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">See the latest approved events from your campus in one quick view.</p></div>
            {user && <button onClick={() => navigate("/events")} className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-600">View all events <ArrowRight size={16} /></button>}
          </div>

          {!user ? (
            <div className="mt-8 rounded-[26px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <CalendarDays className="mx-auto text-slate-300" size={34} />
              <h3 className="mt-4 font-bold text-slate-800">Your live campus event feed is waiting</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Sign in to see upcoming approved events from your college.</p>
              <button onClick={() => navigate("/login")} className="mt-5 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">Sign in to view events</button>
            </div>
          ) : eventsLoading ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse rounded-[24px] bg-slate-100" />)}</div>
          ) : events.length === 0 ? (
            <div className="mt-8 rounded-[26px] border border-slate-200 bg-slate-50 px-6 py-12 text-center"><CalendarDays className="mx-auto text-slate-300" size={34} /><h3 className="mt-4 font-bold text-slate-800">No upcoming events yet</h3><p className="mt-2 text-sm text-slate-500">New approved campus events will appear here.</p></div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {events.map((event) => (
                <article key={event._id} className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="flex items-start justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryStyle[event.category] || "bg-slate-100 text-slate-600"}`}>{event.category || "Campus event"}</span><ArrowUpRight size={17} className="text-slate-300 transition group-hover:text-blue-500" /></div>
                  <h3 className="mt-4 line-clamp-2 text-lg font-bold text-slate-900">{event.title}</h3>
                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2"><CalendarDays size={14} className="text-blue-500" />{formatDate(event.date)}</div>
                    {event.time && <div className="flex items-center gap-2"><Clock3 size={14} className="text-blue-500" />{event.time}</div>}
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" /><span className="truncate">{event.location || "Location to be announced"}</span></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="features" className="border-y border-slate-100 bg-slate-50/70 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-sm font-semibold text-blue-600">Everything you need</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Simple workflows. Real campus utility.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => <div key={title} className="card card-hover p-6"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} /></div><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center"><p className="text-sm font-semibold text-blue-600">Built for every role</p><h2 className="mt-2 text-3xl font-bold tracking-tight">One platform, different experiences</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {roles.map(({ icon: Icon, title, text }) => <div key={title} className="card card-hover p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700"><Icon size={23} /></div><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-400"><CheckCircle2 size={14} /> Secure role-based workflow</div></div>)}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:pb-20">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[30px] bg-slate-950 px-6 py-12 text-center text-white shadow-2xl shadow-slate-900/10 sm:px-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300"><Sparkles size={22} /></div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight">Ready to connect your campus?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">Create your account and start managing campus events with a cleaner, simpler workflow.</p>
          <button onClick={getStarted} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">{user ? "Open dashboard" : "Create account"}<ArrowRight size={16} /></button>
        </div>
      </section>
    </main>
  );
}
