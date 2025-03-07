import FlipCountdown from "./components/FlipCountdown";
import { FaFacebook, FaPinterest, FaInstagram } from "react-icons/fa6";
import { GiSoundOff } from "react-icons/gi";
import { GiSoundOn } from "react-icons/gi";
import useSound from "use-sound";
import { useEffect, useState } from "react";

import nightAmbience from "./assets/night-ambience.mp3";
import tick from "./assets/click.wav";

import "./App.css";

function App() {
  const [volume, setVolume] = useState(0);
  const [playBackground] = useSound(nightAmbience, {
    volume: 0.5 * volume,
    loop: true,
  });
  const [playTick, { stop: stopTick }] = useSound(tick, {
    volume: 0.1 * volume,
  });

  useEffect(() => {
    playBackground();
  }, [playBackground]);

  useEffect(() => {
    stopTick();
    if (volume > 0) {
      const tickID = setInterval(() => playTick(), 1000);
      return () => clearInterval(tickID);
    }
  }, [volume, playTick, stopTick]);

  return (
    <div className="app-wrapper">
      <h1>We&rsquo;re launching soon</h1>
      <FlipCountdown />
      <button onClick={() => setVolume((prev) => (prev === 0 ? 1 : 0))}>
        {volume === 0 ? (
          <GiSoundOff className="icon" />
        ) : (
          <GiSoundOn className="icon" />
        )}
        <span className="sr-only">Toggle sound on/off</span>
      </button>

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
