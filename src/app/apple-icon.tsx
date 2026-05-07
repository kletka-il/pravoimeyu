import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 76,
          fontWeight: 900,
          letterSpacing: "-2px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        П!
      </div>
    ),
    { width: 180, height: 180 },
  );
}
