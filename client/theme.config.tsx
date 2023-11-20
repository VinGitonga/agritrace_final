import { useRouter } from "next/router";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
	docsRepositoryBase: "https://github.com/VinGitonga/agritrace_final.git",
	footer: {
		text: (
			<span>
				AgriTrace {new Date().getFullYear()} ©{" "}
				<a href="https://agritrace.vercel.app" target="_blank">
					AG
				</a>
				.
			</span>
		),
	},
	useNextSeoProps() {
		const { asPath } = useRouter();

		if (asPath !== "/") {
			return {
				titleTemplate: "%s | SaaSTain",
			};
		}
	},
	head: () => {
		const { frontMatter } = useConfig();
		return (
			<>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta property="og:title" content="Docs SaaSTain" />
				<meta property="og:description" content={frontMatter.description || "SaaSTain API Documentation"} />
			</>
		);
	},
	primaryHue: 98,
	primarySaturation: 50,
	project: {
		link: "https://github.com/VinGitonga/agritrace_final.git",
	},
};

export default config;
