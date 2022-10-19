import React, {useEffect, useRef} from 'react'


export default function useInterval(cb, delay) {
    const savedCallBack = useRef();
  
    useEffect(() => {
      savedCallBack.current = cb;
    });
  
    useEffect(() => {
      function tick() {
        savedCallBack.current();
      }
  
      let timerId = setInterval(tick,delay)
      
      return () => clearInterval(timerId)
    }, []);
  }