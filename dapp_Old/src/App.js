import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import abi from "./abi/abi.json";


function App() {
  const [account, setAccount] = useState(""); //State Variable - when a state variable is changes, the app will re-render
  const [totalSup, setTotalSup] = useState("");
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    maxSupply: "-",
    mintPrice: "-",
  });

  const totalSupply = async () => {
    const contract = new ethers.Contract(
      "0x58a56731d3177eec6e395b4397c00f6e1a1436a8",
      abi,
      provider
    );
    const tempTotalSupply = await contract.totalSupply();
    setTotalSup(tempTotalSupply);

    const tokenName = await contract.name();
    const tokenSymbol = await contract.symbol();
    const maxSupply = await contract.MAX_SUPPLY();
    const price = (await contract.price()) / 1000000000000000000;
    //console.log(price);

    setContractInfo({
      address: "",
      tokenName,
      tokenSymbol,
      maxSupply,
      price,
    });
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
    } else {
      console.log("Please Install Metamask.");
    }
  };
  const mintNFTs = () => {
    let cost = contractInfo.price;
    //add gas
  };
  useEffect(() => {
    initConnection();
  }, []);
  useEffect(() => {
    totalSupply();
  }, []);

  return (
    <div className="page">
    <div className="header">
      <img
        src={require(`./assets/images/ape.png`)}
        alt="hmiLogo"
        className="hmiIcon"
      />
      <a
        href="https://testnets.opensea.io/collection/rockpaperscissors-9vlkhasx9z"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={require(`./assets/images/OS-Blue.png`)}
          alt="OpenSea"
          className="osIcon"
        />
      </a>

      <p>
        Total Supply {totalSup.toString()} /{" "}
        {contractInfo.maxSupply.toString()}
      </p>
      <p>
        Price {contractInfo.price}
        <span>
          <FaEthereum style={{ marginLeft: "5px" }} />
        </span>
      </p>
      {account === "" ? ( //ternary operator
        <button onClick={initConnection} className="button">
          Connect
        </button>
      ) : (
        <p>
          {account.slice(0, 5)}...{account.substring(account.length - 4)}
        </p>
      )}
    </div>
    <div>
      <button
        style={{
          backgroundColor: "red",
          color: "white",
          fontSize: 16,
          padding: "10px 20px",
          borderRadius: 4,
        }}
      >
        Mint!
      </button>
    </div>
  </div> 
  );
}

export default App;

