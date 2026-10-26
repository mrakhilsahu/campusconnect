import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, CalendarDays, MapPin, ShieldCheck, XCircle } from "lucide-react";
import { verifyCertificate } from "../api/certificates";

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyCertificate(certificateId)
      .then(setData)
      .catch((error) => setData(error.response?.data || { valid: false, message: "Certificate could not be verified" }))
      .finally(() => setLoading(false));
  }, [certificateId]);

  return (
    <main className="page-shell grid place-items-center bg-[radial-gradient(circle_at_top,_rgba(37,99,235,.12),_transparent_35%),#f8fafc] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-7 text-center">
          <Link to="/" className="text-lg font-black tracking-tight text-slate-950">Campus<span className="text-blue-600">Connect</span></Link>
          <p className="mt-2 text-sm text-slate-500">Certificate verification</p>
        </div>

        {loading ? (
          <div className="card animate-pulse p-10 text-center text-sm text-slate-400">Verifying certificate...</div>
        ) : data?.valid ? (
          <div className="overflow-hidden rounded-[30px] border border-emerald-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,.10)]">
            <div className="bg-slate-950 px-6 py-10 text-center text-white sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300"><BadgeCheck size={34} /></div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-emerald-300">Verified certificate</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Certificate of Participation</h1>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-center text-sm text-slate-500">This certificate was issued to</p>
              <p className="mt-2 text-center text-3xl font-black tracking-tight text-slate-950">{data.certificate.student.name}</p>
              <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-6 text-slate-500">for verified participation in <strong className="text-slate-700">{data.certificate.event.title}</strong>.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400"><CalendarDays size={14} /> Event date</div><p className="mt-2 text-sm font-semibold text-slate-800">{formatDate(data.certificate.event.date)}</p></div>
                <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400"><MapPin size={14} /> Location</div><p className="mt-2 text-sm font-semibold text-slate-800">{data.certificate.event.location || "Campus"}</p></div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificate ID</p><p className="mt-1 font-mono text-sm font-bold text-slate-800">{data.certificate.certificateId}</p></div>
                <ShieldCheck className="shrink-0 text-emerald-500" size={24} />
              </div>
              <p className="mt-5 text-center text-xs text-slate-400">Issued {formatDate(data.certificate.issuedAt)} · Verified by CampusConnect</p>
            </div>
          </div>
        ) : (
          <div className="card p-10 text-center">
            <XCircle className="mx-auto text-red-400" size={42} />
            <h1 className="mt-5 text-xl font-bold text-slate-900">Certificate not verified</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{data?.message || "This certificate ID does not exist."}</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">Go to CampusConnect</Link>
          </div>
        )}
      </div>
    </main>
  );
}
