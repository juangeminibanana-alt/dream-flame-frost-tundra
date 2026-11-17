import { useEffect, useState, type ReactElement } from "react";
import "@/studio/generate";
import { CorteRaiz } from "./corte-entry";

export function CorteApp(): ReactElement {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setListo(true);
  }, []);

  if (!listo) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#070a08",
          color: "#d7ddd8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Abriendo Corte…
      </div>
    );
  }

  return <CorteRaiz />;
}
