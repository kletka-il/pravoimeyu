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
          background: "linear-gradient(135deg, #1f4cf5 0%, #0d486b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 190, 31, 0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1f4cf5",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            П!
          </div>
          <div
            style={{
              color: "#ffbe1f",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Юридическая помощь · 24/7
          </div>
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
          }}
        >
          Что вам делать —
        </div>
        <div
          style={{
            color: "#ffbe1f",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -2,
          }}
        >
          мы знаем
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 28,
            marginTop: 32,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Опишите ситуацию своими словами — найдём готовый ответ и подберём юриста
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 22,
            marginTop: 40,
            fontWeight: 600,
          }}
        >
          pravaimeu.ru
        </div>
      </div>
    ),
    { ...size }
  );
}
