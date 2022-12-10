import { useContractRead } from "wagmi";
import contractInterface from "./abi/abi.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const Header = () => {
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
  const { data: status } = useContractRead({
    address: "0x58a56731d3177eec6e395b4397c00f6e1a1436a8",
    abi: contractInterface,
    functionName: "paused",
  });
  const { data: wlStatus } = useContractRead({
    address: "0x58a56731d3177eec6e395b4397c00f6e1a1436a8",
    abi: contractInterface,
    functionName: "whitelistMintEnabled",
  });
  return (
    <div>
      <p>Contract Status:{status.toString()}</p>
      <p>Whitelist Status:{wlStatus.toString()}</p>
      <p>Total Minted:{totalSupply.toString()}</p>
      <p>Total Supply:{MaxSupply.toString()}</p>
      <div className="btnConnect">
        <ConnectButton></ConnectButton>
      </div>
      <div className="os">
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
      </div>
    </div>
  );
};

export default Header;
