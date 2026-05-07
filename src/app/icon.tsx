import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: "-0.3px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        П!
      </div>
    ),
    { width: 32, height: 32 },
  );
}
