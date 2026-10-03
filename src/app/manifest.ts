import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maple Consulting Engineers",
    short_name: "Maple CE",
    description:
      "Premier Civil and Structural Engineering Consultancy. High-Rise, PEB, Seismic Analysis, and Construction Supervision across Calicut, Kochi, Palakkad, and Bengaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0d",
    theme_color: "#0a0b0d",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
