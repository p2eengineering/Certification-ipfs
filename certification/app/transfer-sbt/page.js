"use client";
import { useState } from "react";
import Navbar2 from "../components/Navbar/Navbar2";
import useSBTApi from "../../hooks/userSBT";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Send, ArrowRight, AlertCircle } from "lucide-react";

export default function TransferSBT() {
  const { attemptTransfer } = useSBTApi();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!from || !to || !tokenId) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await attemptTransfer(from, to, tokenId);
      console.log(response);

      if (response.status === "FAILURE") {
        const resultMessage = response.result || "";
        
        if (resultMessage.includes("soulbound tokens are not transferable")) {
          toast.error("Soulbound tokens cannot be transferred.");
        } else {
          toast.error(`Error: ${resultMessage}`);
        }
      } else if (response.result?.success) {
        toast.success("Transfer successful!");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while transferring the SBT.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <Navbar2 />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Transfer Soulbound Token
            </h1>
            <p className="text-gray-600">
              Transfer ownership of your Soulbound Token securely using blockchain technology
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleTransfer} className="space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Address
                  </label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter sender's address"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Address
                  </label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter recipient's address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token ID
                  </label>
                  <input
                    type="text"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter token ID"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition-colors inline-flex items-center space-x-2 group"
                >
                  <span>{loading ? "Processing..." : "Transfer Token"}</span>
                  <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed -z-10 top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}