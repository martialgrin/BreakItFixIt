import { sveltekit } from "@sveltejs/kit/vite";

const config = {
	plugins: [sveltekit()],
	server: {
		host: true,
	},
};

export default config;
