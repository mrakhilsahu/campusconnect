import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Frontend error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="grid min-h-[calc(100vh-72px)] place-items-center bg-slate-50 px-4 py-12">
        <div className="card w-full max-w-md p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle size={26} />
          </div>
          <h1 className="mt-5 text-xl font-black text-slate-900">Something went wrong</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This page encountered an unexpected error. Refresh and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <RefreshCw size={16} /> Refresh page
          </button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
