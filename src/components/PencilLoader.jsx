import React from "react";

const PencilLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="pencil text-indigo-600"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" rx="5" ry="5" />
          </clipPath>
        </defs>

        <circle
          r="70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="439.82 439.82"
          strokeDashoffset="439.82"
          transform="rotate(-113,100,100)"
          className="pencil__stroke"
        />

        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle
              r="64"
              strokeWidth="30"
              stroke="hsl(223,90%,50%)"
              strokeDasharray="402.12 402.12"
              strokeDashoffset="402"
              transform="rotate(-90)"
              className="pencil__body1"
            />
            <circle
              r="74"
              strokeWidth="10"
              stroke="hsl(223,90%,60%)"
              strokeDasharray="464.96 464.96"
              strokeDashoffset="465"
              transform="rotate(-90)"
              className="pencil__body2"
            />
            <circle
              r="54"
              strokeWidth="10"
              stroke="hsl(223,90%,40%)"
              strokeDasharray="339.29 339.29"
              strokeDashoffset="339"
              transform="rotate(-90)"
              className="pencil__body3"
            />
          </g>

          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect width="30" height="30" rx="5" ry="5" fill="hsl(223,90%,70%)" />
              <rect width="5" height="30" fill="hsl(223,90%,60%)" clipPath="url(#pencil-eraser)" />
              <rect width="30" height="20" fill="hsl(223,10%,90%)" />
              <rect width="15" height="20" fill="hsl(223,10%,70%)" />
              <rect width="5" height="20" fill="hsl(223,10%,80%)" />
              <rect y="6" width="30" height="2" fill="hsla(223,10%,10%,0.2)" />
              <rect y="13" width="30" height="2" fill="hsla(223,10%,10%,0.2)" />
            </g>
          </g>

          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)" />
            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)" />
            <polygon points="15 0,20 10,10 10" fill="hsl(223,10%,10%)" />
          </g>
        </g>
      </svg>

      {/* Component-scoped CSS */}
      <style>{`
        .pencil {
          width: 10rem;
          height: 10rem;
          display: block;
        }

        .pencil__body1,
        .pencil__body2,
        .pencil__body3,
        .pencil__eraser,
        .pencil__eraser-skew,
        .pencil__point,
        .pencil__rotate,
        .pencil__stroke {
          animation-duration: 3s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .pencil__body1 { animation-name: pencilBody1; }
        .pencil__body2 { animation-name: pencilBody2; }
        .pencil__body3 { animation-name: pencilBody3; }
        .pencil__eraser { animation-name: pencilEraser; }
        .pencil__eraser-skew { animation-name: pencilEraserSkew; }
        .pencil__point { animation-name: pencilPoint; }
        .pencil__rotate { animation-name: pencilRotate; }
        .pencil__stroke { animation-name: pencilStroke; }

        @keyframes pencilBody1 {
          from, to { stroke-dashoffset: 351.86; transform: rotate(-90deg); }
          50% { stroke-dashoffset: 150.8; transform: rotate(-225deg); }
        }

        @keyframes pencilBody2 {
          from, to { stroke-dashoffset: 406.84; transform: rotate(-90deg); }
          50% { stroke-dashoffset: 174.36; transform: rotate(-225deg); }
        }

        @keyframes pencilBody3 {
          from, to { stroke-dashoffset: 296.88; transform: rotate(-90deg); }
          50% { stroke-dashoffset: 127.23; transform: rotate(-225deg); }
        }

        @keyframes pencilEraser {
          from, to { transform: rotate(-45deg) translate(49px,0); }
          50% { transform: rotate(0deg) translate(49px,0); }
        }

        @keyframes pencilEraserSkew {
          from, to { transform: skewX(0); }
          50% { transform: skewX(-15deg); }
        }

        @keyframes pencilPoint {
          from, to { transform: rotate(-90deg) translate(49px,-30px); }
          50% { transform: rotate(-225deg) translate(49px,-30px); }
        }

        @keyframes pencilRotate {
          from { transform: translate(100px,100px) rotate(0); }
          to { transform: translate(100px,100px) rotate(720deg); }
        }

        @keyframes pencilStroke {
          from { stroke-dashoffset: 439.82; }
          50% { stroke-dashoffset: 164.93; }
          to { stroke-dashoffset: 439.82; }
        }
      `}</style>
    </div>
  );
};

export default PencilLoader;
