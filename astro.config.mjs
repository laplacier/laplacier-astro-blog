import { defineConfig, sharpImageService } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	experimental: {
		assets: true,
		redirects: true
	},
	image: {
		service: sharpImageService(),
	},
	integrations: [mdx(), sitemap()],
	redirects: {
		'/blog': '/blog/search/1'
	}
});
