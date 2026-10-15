
import { useEffect, useRef } from "react";

export default function AdCashBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const container = bannerRef.current;

    // Prevent duplicate banners during React re-renders
    if (container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `
      aclib.runBanner({
        zoneId: "12304726",
      });
    `;

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
        minHeight: "250px",
        margin: "24px auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    />
  );
}
