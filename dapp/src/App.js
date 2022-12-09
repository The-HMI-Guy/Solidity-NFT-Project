import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import contractInterface from "./abi/abi.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContractRead } from "wagmi";

function App() {
  const { data: MaxSupply } = useContractRead({
    address: "0x58a56731d3177eec6e395b4397c00f6e1a1436a8",
    abi: contractInterface,
    functionName: "MAX_SUPPLY",
  });
  const { data: totalSupply } = useContractRead({
    address: "0x58a56731d3177eec6e395b4397c00f6e1a1436a8",
    abi: contractInterface,
    functionName: "totalSupply",
  });

  // const tokenName = await contract.name();
  // const tokenSymbol = await contract.symbol();
  // const maxSupply = await contract.MAX_SUPPLY();
  // const price = (await contract.price()) / 1000000000000000000;
  //console.log(price);

  useEffect(() => {}, [MaxSupply]);

  return (
    <div className="page">
      <div className="header">
        <img
          src={require(`./assets/images/ape.png`)}
          alt="hmiLogo"
          className="hmiIcon"
        />
        OpeanSea
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
        <p>Total Minted:{totalSupply.toString()}</p>
        <p>Total Supply:{MaxSupply.toString()}</p>
        <div>
          <ConnectButton></ConnectButton>
        </div>
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
