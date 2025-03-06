import FlipCountdown from "./components/FlipCountdown";
import { FaFacebook, FaPinterest, FaInstagram } from "react-icons/fa6";

import "./App.css";

function App() {
  return (
    <div className="app-wrapper">
      <h1>We&rsquo;re launching soon</h1>
      <FlipCountdown />

      <footer>
        <a href="/">
          <FaFacebook className="icon" />
          <span className="sr-only">Facebook</span>
        </a>

        <a href="/">
          <FaPinterest className="icon" />
          <span className="sr-only">Pinterest</span>
        </a>

        <a href="/">
          <FaInstagram className="icon" />
          <span className="sr-only">Instagram</span>
        </a>
      </footer>
    </div>
  );
}

export default App;
