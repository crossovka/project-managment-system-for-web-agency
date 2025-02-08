import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	sassOptions: {
		silenceDeprecations: ['legacy-js-api'],
		quietDeps: true, // Подавляет предупреждения о зависимостях
	},
};

export default nextConfig;
