import { useCallback, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
/* eslint-disable */ //This wrapper comments it to use react-map-interaction without types
// @ts-ignore
import { MapInteractionCSS } from "react-map-interaction";
import { Step, useInteractiveTutorial } from './useInteractiveTutorial';
import { MemoizedNode } from './components/Node';
/* eslint-enable */

type Node = {
  id: string,
  title: string,
  top: number,
  left: number
}

const steps: Step[] = [
  {
    id: "n1",
    title: "step 1",
    description: "step-1"
  }, {
    id: "n2",
    title: "step 2",
    description: "step-2"
  }, {
    id: "n3",
    title: "step 3",
    description: "step-3"
  }
]

const InitialNodes: Node[] = [
  { id: 'n1', title: "node title 1", top: 0, left: 0 },
  { id: 'n2', title: "node title 2", top: 0, left: 0 },
  { id: 'n3', title: "node title 3", top: 0, left: 0 },
]

function App() {
  console.log("Notebook re-render");

  const [count, setCount] = useState(0)
  const [nodes, setNodes] = useState(InitialNodes);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [chosingNode, setChosingNode] = useState<boolean>(false);

  const { currentStepIdx: currentStep, nextStep, previousStep, StepComponent, setCurrentStepIdx: setCurrentStep } = useInteractiveTutorial({ steps })

  const setRandomPosition = useCallback(() => {
    const randomNodes = nodes.map(cur => ({ ...cur, left: getRandom(500), top: getRandom(400) }))
    setNodes(randomNodes)
  }, [nodes])

  useEffect(() => {
    setRandomPosition()
  }, [])

  const onChoseNode = useCallback((chosenNode: string, selectedNode: string) => {
    console.log("choseNode", {chosenNode, selectedNode});
  }, []);

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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>

      <div style={{ border: "solid 2px pink", width: "800px", height: "500px" }}>
        <button onClick={setRandomPosition}>{"move"}</button>
        <MapInteractionCSS >
          {nodes.map(cur => {
            return <MemoizedNode
              chosingNode={chosingNode}
              selectedNode={selectedNode}
              onChoseNode={onChoseNode}
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



      {StepComponent}

    </div>
  )
}

export default App


const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1.