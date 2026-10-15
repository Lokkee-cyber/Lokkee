
import { useEffect, useRef } from "react";

export default function AdCashBanner({ zoneId = "12304726" }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const container = bannerRef.current;

    // Prevent duplicate banners during React re-renders
    if (container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `window.aclib?.runBanner?.({ zoneId: ${JSON.stringify(zoneId)} });`;

    container.appendChild(script);

    return () => {
      container.replaceChildren();
      delete container.dataset.loaded;
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "12px auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    />
  );
}
