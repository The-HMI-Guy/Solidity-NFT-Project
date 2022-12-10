import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";

import Header from "./Header";
import Mint from "./Mint";

function App() {
  return (
    <div className="page">
      <div className="header">
        <Header />
      </div>
      <div className="body"></div>
      <div className="mint">
        <Mint />
      </div>
    </div>
  );
}

export default App;
