"use client";
import { uploadToPinata, generateCertificateHTML } from '@/lib/pinata';

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
      // Validate inputs
      if (!recipientAddress || !user_name || !organization || !date_of_issue) {
        throw new Error("Missing required parameters");
      }

      console.log('Starting SBT minting process...', {
        recipientAddress,
        user_name,
        organization,
        date_of_issue
      });

      // First, generate a unique token ID
      const tokenId = crypto.randomUUID();
      console.log('Generated token ID:', tokenId);
      
      // Generate HTML certificate
      const certificateHTML = generateCertificateHTML(
        user_name,
        organization,
        date_of_issue,
        tokenId
      );
      console.log('Certificate HTML generated');

      // Upload to Pinata
      console.log('Uploading to Pinata...');
      const ipfsHash = await uploadToPinata(
        certificateHTML,
        `certificate-${tokenId}.html`
      );
      console.log('Pinata upload successful, IPFS hash:', ipfsHash);

      // Mint SBT with IPFS hash
      console.log('Minting SBT...');
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
            }
          }),
        }
      );

      console.log('Mint response status:', response.status);
      const responseData = await response.json();
      console.log('Mint response data:', responseData);

      if (!response.ok) {
        throw new Error(`API Error: ${responseData.message || 'Failed to mint SBT'}`);
      }

      if (responseData.status === "FAILURE") {
        throw new Error(`Minting failed: ${responseData.error || 'Unknown error'}`);
      }

      if (!responseData.result) {
        throw new Error('Invalid response format: missing result');
      }

      // Add the IPFS hash to the response
      if (responseData.result && responseData.result.result) {
        responseData.result.result.ipfsHash = ipfsHash;
      }
      
      return responseData;
    } catch (error: unknown) {
      console.error('Error in mintSBT:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        cause: error instanceof Error ? error.cause : undefined,
        response: error instanceof Error && 'response' in error ? error.response : undefined
      });

      // Enhance the error with more context
      const enhancedError = new Error(
        `Failed to mint SBT: ${error instanceof Error ? error.message : String(error)}`
      );
      if (error instanceof Error) {
        enhancedError.cause = error;
      }
      throw enhancedError;
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
      return await response.json();
    } catch (error) {
      console.error("Error getting SBT by owner:", error);
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
