import React, { useEffect, useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSBTApi } from '@/contexts/SBTApiContext';
import { useEVMSBTApi } from '@/contexts/EVMSBTApiContext';

const CertificatePage = () => {
  const router = useRouter();
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
  }, [GetTokenMetadata, getEVMSBTByOwner]);

  useEffect(() => {
    const network = params.network;
    const address = params.address;
    handleCheck(network, address);
  }, [params.network, params.address, handleCheck]);

  return (
    // Rest of the component code
  );
};

export default CertificatePage; 