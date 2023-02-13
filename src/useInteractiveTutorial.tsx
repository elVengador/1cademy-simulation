import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

export type Step = {
    id: string,
    title: string,
    description: string
}

type UseInteractiveTutorialProps = { steps: Step[] }

const DEFAULT_NUMBER_OF_TRIES = 5

export const useInteractiveTutorial = ({ steps }: UseInteractiveTutorialProps) => {
    const [currentStepIdx, setCurrentStepIdx] = useState(0)
    const observer = useRef<ResizeObserver | null>(null);
    const observeTries = useRef(0);

    useEffect(() => {
        // height, top we need to changes
        observer.current = new ResizeObserver(entries => {
            try {
                const rr = entries[0].contentRect
                console.log({ rr })
                // const topPosition = (entries[0].target as any)?.style?.top;
                // const isSimilar = blockSize === previousHeightRef.current;
                // previousHeightRef.current = blockSize;
                // previousTopRef.current = topPosition;
                // if (isSimilar) return;

                // changeNodeHight(identifier, blockSize);
            } catch (err) {
                console.warn("invalid entry", err);
            }
        });
        console.log('observer configured')
        return () => {
            if (!observer.current) return;
            return observer.current.disconnect();
        };
    }, []);

    useEffect(() => {

        if (!observer?.current) return
        if (currentStepIdx < 0 || currentStepIdx >= steps.length) {
            return observer.current.disconnect();
        }



        const currentStep = steps[currentStepIdx]
        console.log('try to ovbser', { id: currentStep.id })

        const intervalId = setInterval(() => {
            if (observeTries.current >= DEFAULT_NUMBER_OF_TRIES) {
                observeTries.current = 0
                clearInterval(intervalId)
                return
            }

            observeTries.current += 1
            const element = document.getElementById(currentStep.id)
            if (!element) return
            if (!observer?.current) return

            observer.current.observe(element);
            console.log('observe element', { element })
            observeTries.current = 0
            clearInterval(intervalId)
        }, 200)

        return () => {
            clearInterval(intervalId)
            if (!observer.current) return;
            return observer.current.disconnect();
        };
    }, [currentStepIdx]);

    const nextStep = () => {
        if (currentStepIdx < 0) return
        if (currentStepIdx === steps.length - 1) return setCurrentStepIdx(-1)
        setCurrentStepIdx(prev => prev + 1)
    }
    const previousStep = () => {
        if (currentStepIdx <= 0) return
        setCurrentStepIdx(prev => prev - 1)
    }
    // const completeTutorial = () => setCurrentStep(-1)

    const StepComponent: ReactNode = useMemo(() => {
        if (currentStepIdx < 0) return null
        if (currentStepIdx >= steps.length) return null
        const currentStep = steps[currentStepIdx].title

        // const element = document.getElementById()

        return <div style={{ border: "solid 2px red" }}>
            <h5>{steps[currentStepIdx].title}</h5>
            <p>{steps[currentStepIdx].description}</p>
        </div>
    }, [currentStepIdx])

    return { currentStepIdx, nextStep, previousStep, setCurrentStepIdx, StepComponent }
}
