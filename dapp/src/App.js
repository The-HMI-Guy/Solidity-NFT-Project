import Header from "./Header";
import Mint from "./Mint";

function App() {
  return (
    <div className="page ">
      <div className="header ">
        <Header />
        <div className="mint">
          <Mint />
        </div>
      </div>
      <div className="body"></div>
    </div>
  );
}

export default App;
