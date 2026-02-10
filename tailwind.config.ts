import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;