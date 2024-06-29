import "./assets/css/App.css";

import { useState } from "react";

import Phylogeny from "./components/Phylogeny";

const App = () => {
  const [layout, setLayout] = useState<"squared" | "angular">("squared");

  return (
    <>
      <div>
        <button onClick={() => setLayout("squared")}>Squared Layout</button>
        <button onClick={() => setLayout("angular")}>Angular Layout</button>
      </div>
      <Phylogeny layout={layout}/>
    </>
  );
};

export default App;
