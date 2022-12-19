import { useContractRead, useContractWrite, useAccount } from "wagmi";
import contractInterface from "./abi/abi.json";
import { useEffect, useState } from "react";
import { ethers,} from "ethers";
import {
  Button,
  Container,
  Text,
  Image,
  Box,
  Link,
  Skeleton,
} from "@chakra-ui/react";

const Mint = () => {
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState();

  const CONTRACT_ADDRESS = "0x58a56731d3177eec6e395b4397c00f6e1a1436a8";
  const getOpenSeaURL = (tokenId) =>
    `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}/${tokenId}`;

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: contractInterface,
  };

  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: "mint",
  });
  const [mintLoading, setMintLoading] = useState(false);

  const onMintClick = async () => {
    try {
      const tx = await mint({
        args: [
          address,
          {
            value: ethers.utils.parseEther("0.001"),
          },
        ],
      });
      const receipt = await tx.wait();
      console.log({ receipt });
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <div>
      <Button

         disabled={!isConnected || mintLoading}
          marginTop="6"
         onClick={onMintClick}
         textColor="black"
         bg="blue.500"
         _hover={{
           bg: "blue.700",
         }}
      >
        {isConnected ? "🎉 Mint" : "🎉 Mint (Connect Wallet)"}
      </Button>

      {mintError && (
        <Text marginTop="4">⛔️ Mint unsuccessful! Error message:</Text>
      )}

      {mintError && (
        <pre style={{ marginTop: "8px", color: "red" }}>
          <code>{JSON.stringify(mintError, null, " ")}</code>
        </pre>
      )}
      {mintLoading && <Text marginTop="2">Minting... please wait</Text>}

      {mintedTokenId && (
        <Text marginTop="2">
          🥳 Mint successful! You can view your NFT{" "}
          <Link
            isExternal
            href={getOpenSeaURL(mintedTokenId)}
            color="blue"
            textDecoration="underline"
          >
            here!
          </Link>
        </Text>
      )}
    </div>
  );
};

export default Mint;
