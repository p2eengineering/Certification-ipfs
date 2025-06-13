"use client";
import { uploadToPinata, generateCertificateHTML } from '@/lib/pinata';
import { convertCertificateToSvg } from '@/lib/certificate-converter';

interface MintSBTArgs {
  address: string;
  name: string;
  organization: string;
  dateOfIssue: string;
  ipfsHash: string;
}

interface CertificateMetadata {
  name: string;
  dateOfIssue: string;
  image?: string;
  [key: string]: any;
}

const useSBTApi = () => {
  const baseURL = "https://gateway-api.kalp.studio/v1/contract/kalp";
  const fixedWallet = "26934b0e223100a41c2e61cdebc599702ca992a8";
  const initialize = async (description: string) => {
    try {
      const response = await fetch(
        `${baseURL}/invoke/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/Initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
            args: {
              description,
            },
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };

  const mintSBT = async (
    recipientAddress: string,
    user_name: string,
    organization: string,
    date_of_issue: string
  ) => {
    try {
      // Generate token ID
      const tokenId = crypto.randomUUID();

      // Convert certificate to SVG
      const svgCertificate = await convertCertificateToSvg({
        name: user_name,
        dateOfIssue: date_of_issue,
        recipientAddress: recipientAddress
      });

      // Upload SVG to IPFS
      const ipfsHash = await uploadToPinata(
        svgCertificate,
        `certificate-${tokenId}.svg`
      );

      // Mint SBT with IPFS hash
      const response = await fetch(
        `${baseURL}/invoke/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/MintSBT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
            args: {
              address: recipientAddress,
              name: user_name,
              organization: organization,
              dateOfIssue: date_of_issue,
              ipfsHash: ipfsHash
            } as MintSBTArgs
          }),
        }
      );

      const mintResponse = await response.json();

      // If the minting was successful, ensure ipfsHash is part of the result for frontend display
      if (mintResponse.status === "SUCCESS" && mintResponse.result) {
        if (!mintResponse.result.result) {
          mintResponse.result.result = {}; // Ensure result.result exists
        }
        mintResponse.result.result.ipfsHash = ipfsHash;
      }

      return mintResponse;
    } catch (error) {
      console.error('Error in minting process:', error);
      throw error;
    }
  };

  const querySBT = async (owner: string, tokenId: string) => {
    try {
      const response = await fetch(
        `${baseURL}/query/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/QuerySBT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
            args: {
              owner,
              tokenID: tokenId,
            },
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error querying SBT:", error);
    }
  };

  const GetTokenMetadata = async (owner: string) => {
    try {
      const response = await fetch(
        `${baseURL}/query/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/GetTokenMetadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
            args: {
              owner,
            },
          }),
        }
      );
      const result = await response.json();
      
      if (result.result.success) {
        // Parse the metadata string into an object
        let parsedMetadata: CertificateMetadata = {
          name: '',
          dateOfIssue: ''
        };
        try {
          if (result.result.result[2]) {
            // For Holesky network
            parsedMetadata = {
              name: result.result.result[2][1],
              dateOfIssue: result.result.result[2][3],
              image: `https://ipfs.io/ipfs/${result.result.result[2][4]}` // Add IPFS URL for the SVG
            };
          } else {
            // For other networks
            const rawMetadata = JSON.parse(result.result.result.metadata);
            parsedMetadata = {
              ...rawMetadata,
              image: `https://ipfs.io/ipfs/${rawMetadata.ipfsHash}`
            };
          }
        } catch (parseError) {
          console.error("Failed to parse metadata:", parseError);
          return result;
        }

        // Update the result with parsed metadata
        result.result.result.metadata = parsedMetadata;
      }
      
      return result;
    } catch (error) {
      console.error("Error getting SBT by owner:", error);
      throw error;
    }
  };

  const getAllTokenIDs = async () => {
    try {
      const response = await fetch(
        `${baseURL}/query/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/GetAllTokenIDs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error getting all token IDs:", error);
    }
  };

  const attemptTransfer = async (from: string, to: string, tokenId: string) => {
    try {
      const response = await fetch(
        `${baseURL}/query/elyxV7pvG3J19vDpU0MHQ6XORtJtiiZm1749037864224/TransferSBT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "TESTNET",
            blockchain: "KALP",
            walletAddress: fixedWallet,
            args: {
              from,
              to,
              tokenID: tokenId,
            },
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error(
        "Error attempting to transfer SBT (non-transferable):",
        error
      );
    }
  };

  return {
    initialize,
    mintSBT,
    querySBT,
    GetTokenMetadata,
    getAllTokenIDs,
    attemptTransfer,
  };
};

export default useSBTApi;
