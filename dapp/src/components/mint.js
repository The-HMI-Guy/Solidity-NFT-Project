import {
  ConnectWallet,
  useContract,
  useNFT,
  useAddress,
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
  const { data: name, isLoading: loadingName } = useContractRead(
    contract,
    "price"
  );

  return (
    <div>
      
      <p className="description">
        <img alt="nft gif" src={previewGIF}></img>
      </p>

      <div className="connect">
        <ConnectWallet />
      </div>
      <p>Price{contract?.name}</p>
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
      <div>
        <Web3Button
          contractAddress={contractAddress}
          action={(contract) => contract.call("mint", 1)}
          colorMode="light"
          accentColor="#F213A4"
        >
          Mint
        </Web3Button>
      </div>
    </div>
  );
};

export default Mint;
