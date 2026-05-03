import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Право имею — юридическая помощь онлайн";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#11142a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            color: "#c9a84c",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          Юридическая помощь онлайн
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Право имею
        </div>
        <div
          style={{
            color: "#9499b8",
            fontSize: 30,
            marginTop: 28,
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          Умный поиск по правовой базе, подсказки на жизненные ситуации и
          проверенные юристы
        </div>
        <div
          style={{
            color: "#c9a84c",
            fontSize: 24,
            marginTop: 48,
            borderTop: "1px solid #2a2d4a",
            paddingTop: 24,
            width: "100%",
          }}
        >
          pravaimei.ru
        </div>
      </div>
    ),
    { ...size }
  );
}
