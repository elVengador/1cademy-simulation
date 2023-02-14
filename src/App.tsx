import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
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
    id: "n1",
    title: "step 1",
    description: "step-1",
  },
  {
    id: "n2",
    title: "step 2",
    description: "step-2",
  },
  {
    id: "n3",
    title: "step 3",
    description: "step-3",
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
];
const DEFAULT_NUMBER_OF_TRIES = 5;
function App() {
  const [count, setCount] = useState(0);
  const [nodes, setNodes] = useState(InitialNodes);

  const [obj, setObj] = useState({ width: 0, height: 0, top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [toltipRect, setToltipRect] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  const {
    currentStepIdx: currentStep,
    nextStep,
    previousStep,
    StepComponent,
    setCurrentStepIdx: setCurrentStep,
  } = useInteractiveTutorial({ steps: nodes });

  const setRandomPosition = useCallback(() => {
    const randomNodes = nodes.map((cur) => ({
      ...cur,
      left: getRandom(500),
      top: getRandom(400),
    }));
    setNodes(randomNodes);
  }, [nodes]);

  const observeTries2 = useRef(0);

  useEffect(() => {
    if (!nodes[currentStep]) return;

    const intervalId = setInterval(() => {
      if (observeTries2.current >= DEFAULT_NUMBER_OF_TRIES) {
        observeTries2.current = 0;
        clearInterval(intervalId);
        return;
      }

      observeTries2.current += 1;
      const element = document.getElementById(nodes[currentStep].id);
      if (!element) return;

      setObj({
        width: element.clientWidth,
        height: element.clientHeight,
        top: element.offsetTop,
        left: element.offsetLeft,
      });
      observeTries2.current = 0;
      clearInterval(intervalId);
    }, 200);

    return () => {
      clearInterval(intervalId);

      return;
    };
  }, [currentStep]);

  useEffect(() => {
    setRandomPosition();
  }, []);

  useLayoutEffect(() => {
    if (!ref.current) return;

    setObj({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
      top: ref.current.offsetTop,
      left: ref.current.offsetLeft,
    });
    console.log({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
      top: ref.current,
    });
  }, [nodes]);

  function extractNumber(string: string) {
    const match = string.match(/\d+$/);
    if (match) {
      return Number(match[0]);
    }
    return 0;
  }

  const addNode = () => {
    setNodes((prev) => {
      const lastNode = prev.slice(-1)[0];
      const newNode: Node = {
        title: `node title ${extractNumber(lastNode?.title ?? "") + 1}`,
        id: `n${extractNumber(lastNode?.id ?? "") + 1}`,
        left: getRandom(1000),
        top: getRandom(1000),
        description: `node title ${extractNumber(lastNode?.title ?? "") + 1}`,
      };
      return [...prev, newNode];
    });
  };

  const handlePosition = (pos: "top" | "bottom" | "left" | "right") => {
    if (!obj || !tooltipRef.current) return;
    let top = 0;
    let left = 0;

    if (pos === "top") {
      top = 0 - tooltipRef.current.clientHeight - 16;

      left = obj.width / 2 - tooltipRef.current.clientWidth / 2;
    }
    if (pos === "bottom") {
      top = obj.height + 16;
      console.log({ top });
      left = obj.width / 2 - tooltipRef.current.clientWidth / 2;
    }
    if (pos === "left") {
      top = obj.height / 2 - tooltipRef.current.clientHeight / 2;
      left = 0 - tooltipRef.current.clientWidth - 16;
    }
    if (pos === "right") {
      top = obj.height / 2 - tooltipRef.current.clientHeight / 2;
      left = obj.width + 16;
    }
    setToltipRect({ top, left });
  };
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

      <button onClick={previousStep}>{"<<"}</button>
      <button onClick={() => setCurrentStep(0)}>start</button>
      <button onClick={nextStep}>{">>"}</button>
      <button onClick={setRandomPosition}>{"move"}</button>
      <button onClick={addNode}>{"Add"}</button>
      <button onClick={() => handlePosition("top")}>top</button>
      <button onClick={() => handlePosition("right")}>right</button>
      <button onClick={() => handlePosition("bottom")}>bottom</button>
      <button onClick={() => handlePosition("left")}>left</button>
      <div
        id="container"
        style={{ border: "solid 2px pink", width: "800px", height: "500px" }}
      >
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
          <div
            style={{
              position: "absolute",
              top: `${obj.top}px`,
              left: `${obj.left}px`,
              width: `${obj.width}px`,
              height: `${obj.height}px`,
              backgroundColor: "transparent",
              outline: "5000px solid #555555bd",
              borderRadius: "1px",
              outlineOffset: "10px",
              boxSizing: "border-box",
              zIndex: 999,
            }}
          >
            <div
              ref={tooltipRef}
              style={{
                position: "absolute",
                top: `${toltipRect.top}px`,
                left: `${toltipRect.left}px`,
                width: "200px",
                backgroundColor: "#3a3838",
                padding: "8px",
                borderRadius: "4 px",
                color: "white",
                zIndex: 9999,
              }}
            >
              <h2>{nodes[currentStep].title}</h2>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            </div>
          </div>
          {nodes.map((cur) => (
            <div
              ref={cur.id === "n1" ? ref : null}
              key={cur.id}
              id={cur.id}
              style={{
                position: "absolute",
                top: cur.top,
                left: cur.left,
                border: "solid 2px royalBlue",
                width: "300px",
                boxSizing: "border-box",
              }}
            >
              {cur.title}
            </div>
          ))}
        </MapInteractionCSS>
      </div>

      {StepComponent}
    </div>
  );
}

export default App;

const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1;
