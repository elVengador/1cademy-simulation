import ReactDOM from 'react-dom'
import {
  ReactNode,
  useCallback,
  useEffect,

  useState,
} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
/* eslint-disable */ //This wrapper comments it to use react-map-interaction without types
// @ts-ignore
import { MapInteractionCSS } from "react-map-interaction";
import { Step, useInteractiveTutorial } from "./useInteractiveTutorial";
/* eslint-enable */

type Node = {
  id: string;
  title: string;
  top: number;
  left: number;
  description: string;
};

const steps: Step[] = [
  {
    id: "t-1",
    title: "step 1",
    description: "step-1",
    tooltipPos: "right",
    anchor: "portal",
  },
  {
    id: "n1",
    title: "step 2",
    description: "step-2",
    tooltipPos: "left",
    anchor: "",
  },
  {
    id: "t-2",
    title: "step 3",
    description: "step-3",
    tooltipPos: "right",
    anchor: "portal",
  },
  {
    id: "n2",
    title: "step 4",
    description: "step-4",
    tooltipPos: "top",
    anchor: "",
  },
];

const InitialNodes: Node[] = [
  {
    id: "n1",
    title: "node title 1",
    description: "node title 1",
    top: 0,
    left: 0,
  },
  {
    id: "n2",
    title: "node title 2",
    description: "node title 2",
    top: 0,
    left: 0,
  },
  {
    id: "n3",
    title: "node title 3",
    description: "node title 3",
    top: 0,
    left: 0,
  },
  {
    id: "n4",
    title: "node title 4",
    description: "node title 4",
    top: 0,
    left: 0,
  },
  {
    id: "n5",
    title: "node title 5",
    description: "node title 5",
    top: 0,
    left: 0,
  },
];

function App() {
  const [nodes, setNodes] = useState(InitialNodes);


  const {
    currentStep,
    tutorialComponent,
    setCurrentStepIdx,
    anchorTutorial
  } = useInteractiveTutorial({ steps, nodes });

  const setRandomPosition = useCallback(() => {
    const randomNodes = nodes.map((cur) => ({
      ...cur,
      left: getRandom(1000),
      top: getRandom(1000),
    }));
    setNodes(randomNodes);
  }, [nodes]);

  useEffect(() => {
    setRandomPosition();
  }, []);

  function extractNumber(string: string) {
    const match = string.match(/\d+$/);
    if (match) {
      return Number(match[0]);
    }
    return 0;
  }

  const addNode = () => {
    const lastNode = nodes.slice(-1)[0];
    const newNode: Node = {
      title: `node title ${extractNumber(lastNode?.title ?? "") + 1}`,
      id: `n${extractNumber(lastNode?.id ?? "") + 1}`,
      left: getRandom(1000),
      top: getRandom(1000),
      description: `node title ${extractNumber(lastNode?.title ?? "") + 1}`,
    };
    setNodes((prev) => {
      return [...prev, newNode];
    });
    // setObj(prevObj=>return {...prevObj,})
  };
  const removeNode = () => {
    setNodes((prev) => {
      return [...prev.slice(0, -1)];
    });
  };

  // ReactDOM.createPortal(child, container)
  const Portal = ({ anchor, children }: { anchor: string, children: ReactNode }) => {
    const el = document.getElementById(anchor)

    if (!el) return null

    return ReactDOM.createPortal(
      children,
      el
    );
  }

  return (
    <div className="App" onClick={(e)=>{
      console.log({currentStep}) 
        if(!currentStep) return;
        if(currentStep.id===e.target.id) console.log("enabled click",currentStep.id)
        
      }}>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>


      <button onClick={() => setCurrentStepIdx(0)}>start</button>
      <button onClick={setRandomPosition}>{"move"}</button>
      <button onClick={addNode}>{"Add"}</button>
      <button onClick={removeNode}>{"Remove"}</button>

      <div
        id="container"
        style={{ border: "solid 2px pink", width: "800px", height: "500px" }}
      >
        {anchorTutorial && <Portal anchor='portal' >{tutorialComponent}</Portal>}
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            width: "100px",
            backgroundColor: "#804242",
          }}
        >
          <h4 id="t-1">Lorem ipsum dolor sit amet.</h4>
          <h4 id="t-2">Lorem ipsum dolor sit amet.</h4>
          <h4 id="t-3">Lorem ipsum dolor sit amet.</h4>
          <h4 id="t-4">Lorem ipsum dolor sit amet.</h4>
        </div>
        <MapInteractionCSS>
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "100px",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "green",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "200px",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "blue",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "300px",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: "purple",
            }}
          ></div>
          {nodes.map((cur) => (
            <div
              // ref={cur.id === "n1" ? ref : null}
              key={cur.id}
              id={cur.id}
              style={{
                position: "absolute",
                top: cur.top,
                left: cur.left,
                border: "solid 2px royalBlue",
                width: "150px",

                height: "100px",
                boxSizing: "border-box",
              }}
            >
              {cur.title}
              <button onClick={()=>alert("Clicked")}>Click</button>
            </div>
          ))}
          {!anchorTutorial && tutorialComponent}
          <div id="tt" style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            bottom: "0px",
            right: "0px",
            background: "yellow",
            boxSizing: "border-box",
          }}>

            {/* <Portal anchor='tt' >{tutorialComponent}</Portal> */}
            {/* {tutorialComponent} */}
          </div>
        </MapInteractionCSS>
      </div>
    </div>
  );
}

export default App;

const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1;
