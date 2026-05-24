import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          background: "#0a0a0f",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 48,
            background: "linear-gradient(135deg, #22d3ee 0%, #7c3aed 100%)",
            fontSize: 150,
            fontWeight: 800,
          }}
        >
          Z
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700 }}>Mission Control</div>
          <div style={{ fontSize: 32, color: "#9ca3af", marginTop: 8 }}>
            Zorba OS · ventures · agents · automation
          </div>
        </div>
      </div>
    ),
    size
  );
}
