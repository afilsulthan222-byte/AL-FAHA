import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#080808",
          900: "#0F0F0F",
          850: "#141414",
          800: "#1C1C1C",
          700: "#2B2B2B",
          600: "#3D3D3D",
        },
        gold: {
          100: "#FDF8E8",
          200: "#F9EEC6",
          300: "#F1DD97",
          400: "#E3C669",
          500: "#D4AF37", // Metallic Gold
          600: "#C5A059",
          700: "#9E7B2B",
          800: "#75591C",
          900: "#4D380E",
        },
        ivory: {
          50: "#FCFCFA",
          100: "#FDFBF7",
          200: "#F7F3E9",
          300: "#EFE8D8",
          400: "#E0D5BE",
          500: "#C7B99D",
        },
        sand: {
          50: "#FAF7F2",
          100: "#F3EDE2",
          200: "#E8DC melt",
        },
        emeraldRoyal: "#0C2E24",
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        arabic: ["Amiri", "Traditional Arabic", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #ECCB7B 0%, #D4AF37 50%, #B88E28 100%)",
        "gold-shimmer": "linear-gradient(90deg, #B88E28 0%, #F5DE88 50%, #B88E28 100%)",
        "dark-radial": "radial-gradient(circle at 50% 0%, #1F1B14 0%, #0B0B0B 75%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 45px rgba(212, 175, 55, 0.35)",
        "luxury-dark": "0 20px 50px rgba(0, 0, 0, 0.7)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
