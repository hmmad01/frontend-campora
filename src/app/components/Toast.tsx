/**
 * @file Toast.tsx
 * @description Komponen notifikasi toast ringan untuk menampilkan pesan sukses/error
 *              di halaman admin. Auto-dismiss setelah beberapa detik.
 */

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export interface ToastMessage {
  id: number;
  type: "success" | "error";
  text: string;
}

let toastIdCounter = 0;

/**
 * Custom hook untuk mengelola daftar toast.
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error", text: string) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, text }]);
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (text: string) => addToast("success", text);
  const error = (text: string) => addToast("error", text);

  return { toasts, success, error, removeToast };
}

/**
 * Komponen container untuk menampilkan toast di pojok kanan atas.
 */
export function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: number) => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setShow(true));
  }, []);

  const handleRemove = () => {
    setShow(false);
    setTimeout(() => onRemove(toast.id), 200);
  };

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-300 min-w-[320px] max-w-[420px] ${
        show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      } ${
        isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
      ) : (
        <XCircle size={20} className="text-red-500 shrink-0" />
      )}
      <p className="text-sm font-medium flex-1">{toast.text}</p>
      <button
        onClick={handleRemove}
        className={`p-1 rounded-lg shrink-0 transition-colors ${
          isSuccess ? "hover:bg-emerald-100" : "hover:bg-red-100"
        }`}
      >
        <X size={14} className="opacity-50" />
      </button>
    </div>
  );
}
