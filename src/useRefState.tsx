import React, { useCallback, useRef, useState } from 'react'

export const useRefState = () => {

    const [state, setState] = useState(null)
    const ref = useRef(null)

    const setRefState = useCallback((value: any) => {
        console.log('is ref  updated')
        setState(value)
        ref.current = value
    }, [])
    return { state, ref, setRefState }
}
