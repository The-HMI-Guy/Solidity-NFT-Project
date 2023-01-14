import "./styles/Home.css";
import Mint from "./components/mint";


export default function Home() {
  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          <p>Welcome to the Rock Paper Scissor NFT Minting Dapp!</p>
        </h1>
        <Mint />
      </main>
    </div>
  );
}
