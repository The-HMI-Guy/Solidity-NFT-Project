import {
  ConnectWallet,
  useContract,
  ThirdwebNftMedia,
  useNFT,
  useAddress,
  useContractRead,
} from "@thirdweb-dev/react";
import "./styles/Home.css";

const contractAddress = "0x58a56731D3177eeC6e395B4397c00F6E1A1436a8";

export default function Home() {
  const address = useAddress();
  const { contract, error } = useContract(contractAddress);
  const { data: nft, isLoading } = useNFT(contract, 1);
  const { data: name, isLoading: loadingName } = useContractRead(
    contract,
    "name" // The name of the view/mapping/variable on your contract
  );

  return (
    // <div>
    //   <ConnectWallet />
    //   <p>{name}</p>
    //   {!isLoading && nft ? (
    //     <ThirdwebNftMedia metadata={nft.metadata} />
    //   ) : (
    //     <p>Loading...</p>
    //   )}
    // </div>

    <div className="container">
      <main className="main">
        <h1 className="title">
          Welcome to the Rock Paper Scissor NFT!
        </h1>

        <p className="description">
          {!isLoading && nft ? (
            <ThirdwebNftMedia metadata={nft.metadata} />
          ) : (
            <p>Loading...</p>
          )}
        </p>

        <div className="connect">
          <ConnectWallet />
        </div>

        <div className="grid">
          <a href="https://portal.thirdweb.com/" className="card">
            <h2>Portal &rarr;</h2>
            <p>
              Guides, references and resources that will help you build with
              thirdweb.
            </p>
          </a>

          <a href="https://thirdweb.com/dashboard" className="card">
            <h2>Dashboard &rarr;</h2>
            <p>
              Deploy, configure and manage your smart contracts from the
              dashboard.
            </p>
          </a>

          <a href="https://portal.thirdweb.com/templates" className="card">
            <h2>Templates &rarr;</h2>
            <p>
              Discover and clone template projects showcasing thirdweb features.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
