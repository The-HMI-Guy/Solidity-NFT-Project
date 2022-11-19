import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

function App() {
  const [account, setAccount] = useState(null); //State Variable - when a state variable is changes, the app will re-render
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
  useEffect(() => {
    initConnection();
  }, []);
  return (
    <div className="page">
      <div>
        <img />
        <p>123</p>
        <button onClick={initConnection}>Connect</button>
        <p>{account}</p>
      </div>
    </div>
  );
}

export default App;
