module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/presentation/components',
            '@screens': './src/presentation/screens',
            '@hooks': './src/presentation/hooks',
            '@domain': './src/domain',
            '@data': './src/data',
            '@infrastructure': './src/infrastructure',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@navigation': './src/presentation/navigation',
          },
        },
      ],
    ],
  };
};