import { X } from "lucide-react";
import Marklogo from "../../assets/icons/Dashboard.png";
const Popup = ({ visible, type = "info", message, onClose }) => {
  if (!visible) return null;

  // Colors based on type

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative w-full max-w-sm rounded-2xl p-6 shadow-lg bg-lightblue">
        <button
          className="absolute top-2 right-2 text-darkblue hover:text-darkblue/80 hover:cursor-pointer"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 font-poppins">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
            <img
              src={Marklogo}
              alt="Diarva Mark Logo"
              className="mx-auto h-20 w-auto"
            />

            <h2 className="mt-6 text-2xl font-bold text-darkblue sm:text-3xl">
              Thank You,
            </h2>

            <p className="mt-4 text-gray-600">
              Your registration has been submitted and is now pending admin
              approval.
            </p>

            <p className="mt-2 text-gray-600">
              You will receive a notification once your account is approved and
              you can log in.
            </p>
          </div>
        </div>
        <h3 className={`text-lg font-semibold  text-center`}>
          {type === "error" ? "Error" : type === "success" ? "Success" : "Info"}
        </h3>

        <p className="mt-4 text-center text-gray-700">{message}</p>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-darkblue px-4 py-2 text-white hover:bg-opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
