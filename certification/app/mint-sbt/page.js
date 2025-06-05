"use client";
import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar/Navbar2";
import Certificate from "../components/Certificate/Certificate";
import { Wallet, Lock } from "lucide-react";
import useSBTApi from "@/hooks/userSBT";
import useEVMSBTApi from "@/hooks/useEVMSBT";
import { sendNotification } from "@/lib/notification";
import Link from "next/link";

const MintSbt = () => {
  const { mintSBT } = useSBTApi();
  const { mintSBT: mintEVMSBT } = useEVMSBTApi();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [dateOfIssue, setDateOfIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ status: "", message: "", hash: "", ipfsUrl: "" });
  const [network, setNetwork] = useState("Holesky");

  const FIXED_WALLET =
    network === "Holesky"
      ? process.env.NEXT_PUBLIC_HOLESKY_WALLET
      : process.env.NEXT_PUBLIC_KALP_WALLET;

  const ExplorerLink = network === "Holesky"
    ? "https://holesky.etherscan.io/tx/"
    : "https://kalpscan.io/transactions?transactionId="

  useEffect(() => {
    const savedNetwork = localStorage.getItem("selectedNetwork");
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  const handleSendNotification = async (transactionHash, ipfsUrl) => {
    try {
      await sendNotification(
        {
          name: userName,
          transactionHash: `${ExplorerLink}${transactionHash}`,
          view_link: `${window.location.origin}/certificate/${network}/${recipientAddress}`,
          ipfsUrl: ipfsUrl
        },
        {
          userId: recipientAddress,
          email: userEmail
        }
      );
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleMint = async () => {
    if (!recipientAddress || !userName || !organization || !dateOfIssue) {
      setResult({
        status: "error",
        message: "All fields are required. Please fill in the form completely.",
        hash: "",
        ipfsUrl: ""
      });
      return;
    }

    setLoading(true);
    setResult({ status: "", message: "", hash: "", ipfsUrl: "" });

    try {
      let response;
      
      // Mint the SBT (this will handle IPFS upload internally)
      if (network === "Holesky") {
        console.log('Minting on Holesky network...', {
          recipientAddress,
          userName,
          organization,
          dateOfIssue
        });
        response = await mintEVMSBT(
          recipientAddress,
          userName,
          organization,
          dateOfIssue
        );
        console.log('Holesky mint response:', response);
      } else {
        console.log('Minting on Kalp network...', {
          recipientAddress,
          userName,
          organization,
          dateOfIssue
        });
        response = await mintSBT(
          recipientAddress,
          userName,
          organization,
          dateOfIssue
        );
        console.log('Kalp mint response:', response);
      }

      // Log the full response for debugging
      console.log('Full mint response:', JSON.stringify(response, null, 2));

      if (!response) {
        throw new Error("No response received from minting function");
      }

      if (response.status === "FAILURE") {
        throw new Error(response.error || "Failed to mint certification");
      }

      // Check for specific error cases
      if (response.error) {
        throw new Error(response.error);
      }

      let transactionHash = null;
      if (network === "Holesky") {
        transactionHash = response.result?.result?.transactionHash 
          || response.result?.transaction?.txHash 
          || response.result?.transactionHash 
          || response.result?.txHash;
      } else {
        transactionHash = response.result?.transaction?.txHash 
          || response.result?.transactionId 
          || response.result?.txHash;
      }

      if (!transactionHash) {
        console.warn("No transaction hash received in the response. Proceeding without it.");
      }

      const ipfsUrl = response.result?.result?.ipfsHash 
        ? `https://ipfs.io/ipfs/${response.result.result.ipfsHash}`
        : null;
      
      console.log('IPFS URL:', ipfsUrl);

      // Send notification with both transaction hash and IPFS URL
      await handleSendNotification(transactionHash, ipfsUrl);

      setResult({
        status: "success",
        message: "Certification SBT minted successfully! Your achievement is now permanently recorded on the blockchain.",
        hash: transactionHash,
        ipfsUrl: ipfsUrl
      });

      // Clear form
      setRecipientAddress("");
      setUserName("");
      setOrganization("");
      setDateOfIssue("");
    } catch (error) {
      // Enhanced error logging
      console.error("Mint error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response,
        cause: error.cause,
        code: error.code
      });

      // Set a more descriptive error message
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        // Check if it's an API error
        if (error.message.includes('API Error:')) {
          errorMessage = error.message.replace('API Error:', '').trim();
        } else if (error.message.includes('Minting failed:')) {
          errorMessage = error.message.replace('Minting failed:', '').trim();
        } else if (error.message.includes('Failed to mint SBT:')) {
          errorMessage = error.message.replace('Failed to mint SBT:', '').trim();
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = error.message || JSON.stringify(error);
      }

      setResult({
        status: "error",
        message: errorMessage,
        hash: "",
        ipfsUrl: ""
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar2 />
      <div className="flex gap-8 h-[100vh] bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-4">
        <div className="w-1/3 ml-16">
          <div className="bg-white rounded-2xl shadow-xl py-4 px-8">
            {/* User Name Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-black">
                User Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* User Email Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-black">
                User Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Enter user email"
                value={userEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Organization Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-black">
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Kalp Studio"
                value={organization}
                onChange={() => setOrganization("Kalp Studio")}
              />
            </div>

            {/* Date of Issue Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-black">
                Date of Issue <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                value={dateOfIssue}
                onChange={(e) => setDateOfIssue(e.target.value)}
              />
            </div>

            {/* Recipient Address Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-black">
                Student's Wallet Address (Recipent){" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 h-5 w-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  placeholder="Enter recipient's wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>
              <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="font-medium text-gray-700">
                    Wallet Address (Issuer)
                  </h3>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <code className="text-sm text-gray-600 break-all">
                    {FIXED_WALLET}
                  </code>
                </div>
              </div>
            </div>

            {/* Mint Button */}
            <button
              onClick={handleMint}
              disabled={
                !recipientAddress ||
                !userName ||
                !organization ||
                !dateOfIssue ||
                loading
              }
              className={`mt-8 w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium ${
                !recipientAddress ||
                !userName ||
                !organization ||
                !dateOfIssue ||
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 transition-colors"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Minting Certificate...</span>
                </div>
              ) : (
                <span>Issue Certification</span>
              )}
            </button>

            {/* Result Alert */}
            {result.status && (
              <div className="mt-6">
                <p
                  className={`${
                    result.status === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {result.message}
                  {result.hash && (
                    <>
                      <span className="text-black">Link to verify:</span>
                      <Link href={`${ExplorerLink}${result.hash}`} target="_blank">
                        <span className="text-blue-600">Click here</span>
                      </Link>
                    </>
                  )}
                  {result.ipfsUrl && (
                    <>
                      <br />
                      <span className="text-black">IPFS Certificate:</span>
                      <Link href={result.ipfsUrl} target="_blank">
                        <span className="text-blue-600">View Certificate</span>
                      </Link>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <Certificate
          title="College Degree"
          name={userName || "Your Name"}
          date={dateOfIssue || "Date"}
          hash={recipientAddress || "Recipient Address"}
          college={organization || "IEM"}
        />
      </div>
    </div>
  );
};

export default MintSbt;
