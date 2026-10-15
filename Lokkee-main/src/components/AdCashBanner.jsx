
import { useEffect, useRef } from "react";

export default function AdCashBanner() {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    const container = bannerRef.current;
    let cancelled = false;
    let script = document.getElementById("aclib");

    // Prevent duplicate banners during React re-renders
    if (container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const runBanner = () => {
      if (cancelled || !container.isConnected || !window.aclib?.runBanner) return;
      const activationScript = document.createElement("script");
      activationScript.textContent = `window.aclib.runBanner({ zoneId: "12304726" });`;
      container.appendChild(activationScript);
    };

    if (window.aclib?.runBanner) {
      runBanner();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = "aclib";
        script.src = "https://acscdn.com/script/aclib.js";
        document.head.appendChild(script);
      }
      script.addEventListener("load", runBanner, { once: true });
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", runBanner);
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
