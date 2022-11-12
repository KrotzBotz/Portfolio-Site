import React from "react";
import "./DotsCanvas.scss";
import BouncingDots from "./DotsController";

export default function DotsCanvas() {
  let canvasRef = React.useRef();

  React.useEffect(() => {
    let canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    BouncingDots(canvas, {});
  }, []);

  return <canvas className="fixed-fullscreen" ref={canvasRef} />;
}
