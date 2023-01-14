import {
  useContract,
  useContractRead,
  Web3Button,
  useAddress,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import "../styles/globals.css";
import etherscanImage from "../assets/images/etherscan.png";
import openseaImage from "../assets/images/OS-Blue.png";
import previewGIF from "../assets/images/preview.gif";
import { useEffect, useState } from "react";
import { findHexProof, verifyProof } from "merkletreejs";

const contractAddress = "0x58a56731D3177eeC6e395B4397c00F6E1A1436a8";

const Mint = () => {
  const { contract } = useContract(contractAddress);
  const address = useAddress();
  console.log("User's address:", address);
  const [hexProof, setHexProof] = useState(null);
  const [isWhitelisted, setIsWhitelisted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const hexProof = await findHexProof(address);
      setHexProof(hexProof);
      const root = await contract.getRoot();
      const isWhitelisted = await verifyProof(hexProof, root, address);
      setIsWhitelisted(isWhitelisted);
    }
    if (address) {
      fetchData();
    }
  }, [address, contract]);

  // =============================================================
  //                          CONTRACT READS
  // =============================================================
  const { data: price, isLoading: loadingPrice } = useContractRead(
    contract,
    "price"
  );
  const { data: paused, isLoading: loadingPaused } = useContractRead(
    contract,
    "paused"
  );
  const { data: wlEnabled, isLoading: loadingWlEnabled } = useContractRead(
    contract,
    "whitelistMintEnabled"
  );

  return (
    <div>
      <img alt="nft gif" src={previewGIF}></img>

      <div className="price">
        <p>
          Price:{" "}
          {price ? ethers.utils.formatEther(price.toString()) : "loading"} ETH
        </p>
      </div>
      <div className="status">
        <p>Contract Status: {paused ? "Paused" : "Live"}</p>
        <p> Whitelist Status: {wlEnabled ? "Active" : "Not Active"}</p>
      </div>
      <div className="connect">
        <Web3Button
          contractAddress={contractAddress}
          action={(contract) => contract.call("mint", 1, { value: price })}
          colorMode="dark"
          accentColor="#050505"
        >
          Mint
        </Web3Button>
      </div>

      <div class="grid-container">
        <a
          href="https://goerli.etherscan.io/address/0x58a56731D3177eeC6e395B4397c00F6E1A1436a8"
          class="card"
        >
          <h2>Contract</h2>
          <img
            width="100px"
            height="100px"
            alt="etherscan contract"
            src={etherscanImage}
          ></img>
        </a>
        <a
          href="https://testnets.opensea.io/collection/rockpaperscissors-9vlkhasx9z"
          class="card"
        >
          <h2>Opensea</h2>
          <img
            width="100px"
            height="100px"
            alt="opensea"
            src={openseaImage}
          ></img>
        </a>
      </div>
    </div>
  );
};

export default Mint;
