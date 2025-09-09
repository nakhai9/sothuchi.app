import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex justify-center items-center p-4 min-h-full">
        <div className="relative bg-white shadow-xl rounded-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 px-6">
            <div className="flex flex-col">
              <h3 className="font-semibold text-slate-700 text-lg">{title}</h3>
              {description && (
                <p className="text-slate-500 text-sm">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
