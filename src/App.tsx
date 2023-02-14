import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
/* eslint-disable */ //This wrapper comments it to use react-map-interaction without types
// @ts-ignore
import { MapInteractionCSS } from "react-map-interaction";
import { MemoizedNode } from './components/Node';
import { useRefState } from './useRefState';
/* eslint-enable */

type Node = {
  id: string,
  title: string,
  top: number,
  left: number
}

const InitialNodes: Node[] = [
  { id: 'n1', title: "node title 1", top: 0, left: 0 },
  { id: 'n2', title: "node title 2", top: 0, left: 0 },
  { id: 'n3', title: "node title 3", top: 0, left: 0 },
]

function App() {
  console.log("Notebook re-render");

  const [nodes, setNodes] = useState(InitialNodes);
  const [chosingNode, setChosingNode] = useState<boolean>(false);
  const { ref: selectedNodeRef, state: selectedNode, setRefState: setSelectedNode } = useRefState()



  const setRandomPosition = useCallback(() => {
    const randomNodes = nodes.map(cur => ({ ...cur, left: getRandom(500), top: getRandom(400) }))
    setNodes(randomNodes)
  }, [nodes])

  useEffect(() => {
    setRandomPosition()
  }, [])


  const onChosingNode = useCallback((nodeId: string) => {
    if (!selectedNodeRef.current) return
    console.log("--> choseNode", { nodeId, selectedNodeRef: selectedNodeRef.current });
  }, [])

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div style={{ border: "solid 2px pink", width: "800px", height: "500px" }}>
        <button onClick={setRandomPosition}>{"move"}</button>
        {!chosingNode && <h3>Start Chosing Node (Tag, Child, Parent, Reference)</h3>}
        <h4>selectedNode: {selectedNode}</h4>
        <MapInteractionCSS >
          {nodes.map(cur => {
            return <MemoizedNode
              selectedNode={selectedNode}
              onChoseNode={onChosingNode}
              setChosingNode={setChosingNode}
              setSelectedNode={setSelectedNode}
              id={cur.id}
              left={cur.left}
              top={cur.top}
              title={cur.title}
              key={cur.id}
            />
          })}
        </MapInteractionCSS>
      </div>
    </div>
  )
}

export default App


const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1.