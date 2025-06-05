"use client";
import { useState, useEffect } from "react";
import Navbar2 from "../components/Navbar/Navbar2";
import Certificate from "../components/Certificate/Certificate";
import useSBTApi from "../../hooks/userSBT";
import useEVMSBTApi from "@/hooks/useEVMSBT";

export default function OwnershipChecker() {
  const { GetTokenMetadata } = useSBTApi();
  const { GetTokenMetadata: getEVMSBTByOwner } = useEVMSBTApi();
  const [owner, setOwner] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [ownership, setOwnership] = useState(null);
  const [error, setError] = useState("");
  const [formType, setFormType] = useState("owner"); // Default to the "owner" form
  const [network, setNetwork] = useState("Holesky");

  useEffect(() => {
    const savedNetwork = localStorage.getItem("selectedNetwork");
    if (savedNetwork) {
      setNetwork(savedNetwork);
    }
  }, []);

  const handleCheck = async () => {
    setError("");
    setOwnership(null);
    try {
      let response;
      if (formType === "owner") {
        if (network === "Holesky") {
          response = await getEVMSBTByOwner(owner);
        } else {
          response = await GetTokenMetadata(owner);
        }
      } else if (formType === "owner-token") {
        response = await GetTokenMetadata(owner, tokenId); // Assuming API supports both parameters
      }

      if (response.result.success) {
        // Parse the metadata string into an object
        let parsedMetadata = {};
        try {
          if (network === "Holesky") {
            parsedMetadata = {
              name: response.result.result[2][1],
              dateOfIssue: response.result.result[2][3],
            };
          } else {
            parsedMetadata = JSON.parse(response.result.result.metadata);
          }
        } catch (parseError) {
          setError("Failed to parse metadata.", parseError);
          return;
        }

        setOwnership({
          owner: response.result.result.owner,
          tokenID: response.result.result[1], 
          metadata: parsedMetadata,
          timestamp: response.timestamp,
        });
      } else {
        setError("No certificate found for this owner.");
      }
    } catch (err) {
      setError("An error occurred while checking ownership.", err);
    }
  };

  return (
    <div>
      <Navbar2 />
      <main className="flex gap-12 justify-center min-h-screen bg-gradient-to-br items-center from-gray-50 to-indigo-50">
        <div className="w-full max-w-md bg-white ml-8 py-4 px-6 rounded-xl shadow-lg">
          <form className="space-y-2">
            {/* Owner Address Input */}
            <div>
              <label className="block text-sm font-medium my-2 text-gray-700">
                Owner Wallet Address
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter owner's address"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              />
            </div>

            {/* Token ID Input (Only for owner-token form type) */}
            {formType === "owner-token" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Token ID
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter token ID"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
            )}

            {/* Toggle between Owner Address and Owner + Token ID Form */}
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() =>
                  setFormType(formType === "owner" ? "owner-token" : "owner")
                }
                className="text-blue-600 underline"
              >
                {formType === "owner"
                  ? "Use Owner Address & Token ID"
                  : "Use Owner Address Only"}
              </button>
              <button
                type="button"
                onClick={handleCheck}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Verify
              </button>
            </div>
          </form>

          {/* Display Error Message */}
          {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
        </div>

        {/* Ownership Details */}
        {ownership && (
          <Certificate
            title="College Degree"
            name={ownership.metadata.name || "Your Name"}
            date={ownership.metadata.dateOfIssue || "Date"}
            hash={ownership.tokenID || "Recipient Address"}
            college={ownership.owner || "IEM"}
          />
        )}
      </main>
    </div>
  );
}
