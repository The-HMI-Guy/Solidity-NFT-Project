import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FaEthereum} from "react-icons/fa";

function App() {
  const [account, setAccount] = useState(""); //State Variable - when a state variable is changes, the app will re-render
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
      <div className="header">
        <img
          src={require(`./assets/images/OS-Blue.png`)}
          alt="OpenSea"
          className="osIcon"
        />
        <p>
          123{" "}
          <span>
            <FaEthereum style={{marginLeft: "5px"}}/>
          </span>
        </p>
        {account === "" ? ( //ternary operator
          <button onClick={initConnection} className="button">
            Connect
          </button>
        ) : (
          <p>...{account.substring(account.length - 7)}</p>
        )}
      </div>
    </div>
  );
}

export default App;
