import { useContractRead } from "wagmi";
import contractInterface from "./abi/abi.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Card, Image } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

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
      <div className="btnConnect">
        <ConnectButton></ConnectButton>
      </div>

      <div className="card">
        <Card.Group>
          <Card>
            <Card.Content>
              <Image
                floated="right"
                size="mini"
                src={require(`./assets/images/OS-Blue.png`)}
                href="https://testnets.opensea.io/collection/rockpaperscissors-9vlkhasx9z"
                target="_blank"
                rel="noreferrer"
              />
              <Image
                floated="right"
                size="mini"
                src={require(`./assets/images/etherscan.png`)}
                href="https://goerli.etherscan.io/address/0x58a56731D3177eeC6e395B4397c00F6E1A1436a8"
                target="_blank"
                rel="noreferrer"
              />
              <Card.Header>Rock Paper Scissors NFT!</Card.Header>
              <Card.Meta>Contract Information</Card.Meta>
              <Card.Description>
                Contract Status: {status.toString()}
                <p>Whitelist Status: {wlStatus.toString()}</p>
                <p>Total Minted: {totalSupply.toString()}</p>
                Total Supply: {MaxSupply.toString()}
              </Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    </div>
  );
};

export default Header;
