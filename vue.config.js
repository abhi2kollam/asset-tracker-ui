module.exports = {
	devServer: {
		port: 3000,
		proxy: {
			"^/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
	publicPath: process.env.NODE_ENV === "production" ? "/sakai-vue" : "/",
};
