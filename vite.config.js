import istanbul from 'vite-plugin-istanbul';

export default {
  envPrefix: "FRONTEND_",
  plugins: [
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: [ '.js', '.ts', '.vue' ]
    }),
  ],
  build: {
    sourcemap: true,
  },
};