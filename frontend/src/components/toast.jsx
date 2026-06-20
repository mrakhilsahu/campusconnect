import { useEffect } from "react";

// Simple toast component
// Usage: <Toast message="Done!" type="success" onClose={() => setToast(null)} />
// type can be: "success" | "error" | "info"

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-500",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-white shadow-lg text-sm ${colors[type]}`}
    >
      {message}
    </div>
  );
}

export default Toast;
