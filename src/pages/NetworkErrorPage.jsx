import { WifiOff } from "lucide-react";

const NetworkErrorPage = ({ message }) => {
  return (
    <div className="flex items-center justify-center  px-4 py-3">
      <div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-2xl p-4 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <WifiOff size={50} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Server Not Responding
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
        <p className="text-gray-500 mb-6">
          We are unable to connect to the server right now. Please check your
          internet connection or try again later.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NetworkErrorPage;
