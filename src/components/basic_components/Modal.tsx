import { CloseIcon } from "../../utils/Icons";
import { ModalProps } from "../../types/Types";

const Modal = ({
  isOpen,
  onClose,
  title,
  content,
  width = "3/4",
  modalPosition = "center",
  contentPosition = "start",
}: ModalProps) => {
  if (!isOpen) return null;

  // Determine Tailwind classes for modal positioning
  const justifyClass =
    modalPosition === "start"
      ? "justify-start"
      : modalPosition === "end"
        ? "justify-end"
        : "justify-center";

  const alignClass =
    contentPosition === "start"
      ? "items-start"
      : contentPosition === "end"
        ? "items-end"
        : "items-center";

  return (
    <div
      className={`fixed inset-0 flex ${justifyClass} ${alignClass} z-20 bg-gray-500 bg-opacity-50`}
    >
      <div
        className={`bg-white relative flex flex-col h-full ${width}`}
      >
        {/* Overlay Section */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Title */}
          {title && (
            <div className="absolute top-0 left-0 w-full p-4 bg-opacity-50 bg-white text-xl font-bold">
              {title}
            </div>
          )}
          {/* Close Button */}
          <button
            className="absolute top-2 right-3 text-black z-30 p-1 bg-opacity-0 bg-white rounded-full pointer-events-auto"
            onClick={onClose}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className={`w-full h-full z-20 ${title ? "mt-10" : ""}`}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
