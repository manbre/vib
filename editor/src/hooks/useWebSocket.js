import { useState, useEffect, useRef } from "react";

const useWebSocket = () => {
  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000");

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (e) => {
      let arr = JSON.parse(e.data).data;
      let newData = "";
      arr.forEach((element) => {
        newData += String.fromCharCode(element);
      });
      let json = JSON.parse(newData);
      setVal(json);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // bind is needed to make sure "send" references correct "this"
  return [isReady, val, ws.current?.send.bind(ws.current)];
};

export default useWebSocket;
