import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./tooltip.css";
export type Step = {
  id: string;
  title: string;
  description: string;
  tooltipPos: "top" | "bottom" | "left" | "right";
};
type Node = {
  id: string;
  title: string;
  top: number;
  left: number;
  description: string;
};

type UseInteractiveTutorialProps = { steps: Step[]; nodes: Node[] };

const DEFAULT_NUMBER_OF_TRIES = 5;

export const useInteractiveTutorial = ({
  steps,
  nodes,
}: UseInteractiveTutorialProps) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [obj, setObj] = useState({ width: 0, height: 0, top: 0, left: 0 });

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const observeTries2 = useRef(0);

  useLayoutEffect(() => {
    if (!nodes[currentStepIdx]) return;

    const intervalId = setInterval(() => {
      if (observeTries2.current >= DEFAULT_NUMBER_OF_TRIES) {
        observeTries2.current = 0;
        clearInterval(intervalId);
        return;
      }

      observeTries2.current += 1;
      const element = document.getElementById(nodes[currentStepIdx].id);
      console.log({ element, id: nodes[currentStepIdx].id });
      if (!element) return;

      console.log("not reached");

      setObj({
        width: element.clientWidth,
        height: element.clientHeight,
        top: element.offsetTop,
        left: element.offsetLeft,
      });
      observeTries2.current = 0;
      clearInterval(intervalId);
    }, 500);

    return () => {
      clearInterval(intervalId);

      return;
    };
  }, [currentStepIdx, nodes]);

  const nextStep = () => {
    if (currentStepIdx < 0) return;
    if (currentStepIdx === steps.length - 1) return setCurrentStepIdx(-1);

    setCurrentStepIdx((prev) => prev + 1);
  };
  const previousStep = () => {
    if (currentStepIdx <= 0) return;
    setCurrentStepIdx((prev) => prev - 1);
  };
  // const completeTutorial = () => setCurrentStep(-1)

  const tooltipClientRect = useMemo(() => {
    if (!tooltipRef.current) return { top: 0, left: 0 };
    let top = 0;
    let left = 0;

    const pos = steps[currentStepIdx].tooltipPos;

    if (pos === "top") {
      top = 0 - tooltipRef.current.clientHeight - 16;
      left = obj.width / 2 - tooltipRef.current.clientWidth / 2;
    }
    if (pos === "bottom") {
      top = obj.height + 16;
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
    return { top, left };
  }, [obj]);

  const tutorialComponent = useMemo(() => {
    return (
      <div
        style={{
          position: "absolute",
          top: `${obj.top}px`,
          left: `${obj.left}px`,
          width: `${obj.width}px`,
          height: `${obj.height}px`,
          backgroundColor: "transparent",
          outline: "5000px solid #555555cc",
          transition: "top 1s ease-out,left 1s ease-out",
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
            top: `${tooltipClientRect.top}px`,
            left: `${tooltipClientRect.left}px`,
            transition: "top 1s ease-out,left 1s ease-out",
            width: "200px",
            backgroundColor: "#3a3838",
            padding: "8px",
            borderRadius: "8px",
            color: "white",
            zIndex: 9999,
          }}
        >
          <h2>{nodes[currentStepIdx]?.title}</h2>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
          <button onClick={previousStep}>{"<<"}</button>

          {currentStepIdx < steps.length - 1 && (
            <button onClick={nextStep}>{">>"}</button>
          )}
          {currentStepIdx === steps.length - 1 && (
            <button onClick={nextStep}>{"Finalize"}</button>
          )}
        </div>
      </div>
    );
  }, [obj]);
  const StepComponent: ReactNode = useMemo(() => {
    if (currentStepIdx < 0) return null;
    if (currentStepIdx >= steps.length) return null;

    return (
      <div style={{ border: "solid 2px red" }}>
        <h5>{steps[currentStepIdx].title}</h5>
        <p>{steps[currentStepIdx].description}</p>
      </div>
    );
  }, [currentStepIdx]);

  return {
    currentStepIdx,
    nextStep,
    previousStep,
    setCurrentStepIdx,
    StepComponent,
    tutorialComponent,
  };
};
