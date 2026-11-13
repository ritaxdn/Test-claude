"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 20 }}>MESH hit an unexpected error</h1>
          <button onClick={reset} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 999, border: 0, background: "#6d28d9", color: "white" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
