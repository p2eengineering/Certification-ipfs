"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Certificate from "../../../components/Certificate/Certificate";
import useSBTApi from "../../../../hooks/userSBT";
import useEVMSBTApi from "@/hooks/useEVMSBT";

export default function OwnershipChecker() {
  const params = useParams();
  const { GetTokenMetadata } = useSBTApi();
  const { GetTokenMetadata: getEVMSBTByOwner } = useEVMSBTApi();
  const [ownership, setOwnership] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = useCallback(async (network, owner) => {
    setOwnership(null);
    try {
      let response;
      if (network === "Holesky") {
        response = await getEVMSBTByOwner(owner);
      } else {
        response = await GetTokenMetadata(owner);
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_parseError) {
          setError("Failed to parse metadata.");
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setError("An error occurred while checking ownership.");
    }
  }, [GetTokenMetadata, getEVMSBTByOwner]);

  useEffect(() => {
    const network = params.network;
    const address = params.address;
    handleCheck(network, address);
  }, [params.network, params.address, handleCheck]);

  return (
    <div>
      <main className="flex gap-12 justify-center min-h-screen bg-gradient-to-br items-center from-gray-50 to-indigo-50">
        {/* Ownership Details */}
        {ownership && (
          <Certificate
            title="College Degree"
            name={ownership.metadata.name || "Your Name"}
            date={ownership.metadata.dateOfIssue || "Date"}
            hash={ownership.tokenID || "Recipient Address"}
            college={ownership.owner || "IIT"}
          />
        )}
        
        {/* Error Message */}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </main>
    </div>
  );
}
