import "./assets/css/App.css";

import { useState } from "react";

import { NewickLexer } from "./utils/Tree/Lexer";
import { NewickParser } from "./utils/Tree/Parser";
import { Tree } from "./utils/Tree/Node";

import SvgDimensionsProvider from "./providers/SvgDimensionsProvider";
import Phylogeny from "./components/Phylogeny";

const App = () => {
  const exampleTree =
    "(ant:17, ((bat:31, cow:22):25, dog:22):10, ((elk:33, fox:12):10, giraffe:15):11);";
  const [newick, setNewick] = useState(exampleTree);

  const [tree, setTree] = useState<Tree | null>(null);

  const parseTree = () => {
    const lexer = new NewickLexer(newick);
    const parser = new NewickParser(lexer.lex());
    const parsedTree = parser.parseTree();
    setTree(parsedTree);
    parsedTree
      ?.getAllNodes("preorder")
      .forEach((node) =>
        console.log(
          node.id,
          node.label,
          node.branchLength,
          node.isRoot(),
          node.isLeaf(),
          node.getDistanceToRoot()
        )
      );
  };
  return (
    <>
      <div>
        <div style={{ color: "white" }}>
          Enter a newick tree:{" "}
          <input
            value={newick}
            onChange={(event) => setNewick(event.target.value)}
          />
          <button onClick={parseTree}>Submit</button>
        </div>
        <div
          id="svg-container-1"
          className="svg-container"
          style={{ height: "600px", width: "100%" }}
        >
          <SvgDimensionsProvider>
            {tree ? <Phylogeny tree={tree} /> : null}
          </SvgDimensionsProvider>
        </div>
      </div>
    </>
  );
};

export default App;
