import {
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import "../styles/Home.css";
import etherscanImage from "../assets/images/etherscan.png";
import openseaImage from "../assets/images/OS-Blue.png";
import previewGIF from "../assets/images/preview.gif";

const contractAddress = "0x58a56731D3177eeC6e395B4397c00F6E1A1436a8";

const Mint = () => {
  const { contract } = useContract(contractAddress);
  const { data: price, isLoading: loadingName } = useContractRead(
    contract,
    "price"
  );

  return (
    <div>
      <img alt="nft gif" src={previewGIF}></img>

      <div className="price">
        <p>Price Per NFT: {price ? ethers.utils.formatEther(price.toString()) : 0} ETH</p>
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

      <div className="grid">
        <a
          href="https://goerli.etherscan.io/address/0x58a56731D3177eeC6e395B4397c00F6E1A1436a8"
          className="card"
        >
          <img
            width={"100px"}
            height={"100px"}
            alt="etherscan contract"
            src={etherscanImage}
          ></img>
        </a>

        <a
          href="https://testnets.opensea.io/collection/rockpaperscissors-9vlkhasx9z"
          className="card"
        >
          <img
            width={"100px"}
            height={"100px"}
            alt="opensea"
            src={openseaImage}
          ></img>
        </a>
      </div>
    </div>
  );
};

export default Mint;
