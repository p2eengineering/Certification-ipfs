"use client";
// Example API hook structure

const useEVMSBTApi = () => {
  const baseURL = "https://gateway-api.kalp.studio/v1/contract/evm";
  const fixedWallet = "0xB9d3B87caF142b08FfB9cb6606710Ac84E62fEBB";
  const initialize = async (description: string) => {
    try {
      const response = await fetch(
        `${baseURL}/invoke/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "ETH",
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
      const response = await fetch(
        `${baseURL}/invoke/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/mintSBT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "ETH",
            walletAddress: fixedWallet,
            args: {
              to: recipientAddress,
              name: user_name,
              organization: organization,
              dateOfIssue: date_of_issue,
            },
          }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error minting SBT:", error);
    }
  };

  const querySBT = async (owner: string, tokenId: string) => {
    try {
      const response = await fetch(
        `${baseURL}/query/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/querySBT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "POLY",
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
        `${baseURL}/query/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/GetTokenMetadata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "ETH",
            walletAddress: fixedWallet,
            args: {
              tokenOwner: owner,
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
        `${baseURL}/query/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/getAllTokenIds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "ETH",
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
        `${baseURL}/query/0xc238Ed77b39DE77143223F242938AEb3fFeb5389/transfer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
          },
          body: JSON.stringify({
            network: "HOLESKY",
            blockchain: "ETH",
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

export default useEVMSBTApi;
