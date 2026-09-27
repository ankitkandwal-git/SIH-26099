import { useEffect } from "react";
import prototypeMarkup from "./prototype.html?raw";
import { initPrototype } from "./prototype.js";
import "./styles.css";

function App() {
  useEffect(() => {
    const cleanup = initPrototype();
    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);

  return <div id="prototype-root" dangerouslySetInnerHTML={{ __html: prototypeMarkup }} />;
}

export default App;
