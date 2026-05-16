import React from "react";

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  scale?: number;
  rotate?: number;
}> = ({ children, scale = 1, rotate = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
        width: 620,
        height: 1280,
        background: "#0d0d10",
        borderRadius: 64,
        boxShadow:
          "0 60px 120px rgba(0,0,0,0.55), inset 0 0 0 4px #1d1d21, inset 0 0 0 8px #2a2a30",
        padding: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 22,
          left: "50%",
          transform: "translateX(-50%)",
          width: 180,
          height: 32,
          background: "#000",
          borderRadius: 18,
          zIndex: 5,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 50,
          overflow: "hidden",
          background: "#fff",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
