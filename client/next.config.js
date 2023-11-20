/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
};

const withNextra = require("nextra")({
	theme: "nextra-theme-docs",
	themeConfig: "./theme.config.tsx",
});

module.exports = nextConfig;
module.exports = withNextra({
	// any other nextra related configuration here
	reactStrictMode: true,
});
