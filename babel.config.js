module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // TSyringe requires legacy decorator syntax. All DI registrations use
      // useFactory (see src/core/di/container.ts), so we don't depend on
      // Babel emitting TypeScript's design:paramtypes metadata — only the
      // decorator syntax itself needs to parse/transform correctly.
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
  };
};
