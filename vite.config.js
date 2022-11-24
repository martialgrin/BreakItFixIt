import { sveltekit } from "@sveltejs/kit/vite";

const config = {
	plugins: [sveltekit()],
	server: {
		port: 3000,
		host: true,
	},
};

export default config;
