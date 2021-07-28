module.exports = {
  presets: [
    "@zeit/next-typescript/babel",
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: {
          edge: "86",
          firefox: "78",
          chrome: "67",
          safari: "11",
          samsung: "11",
        },
        useBuiltIns: "entry", //This is normally usage but not sure why this failes
        corejs: "3.7.0",
      },
    ],
  ],

  plugins: [
    "@babel/proposal-class-properties",

    [
      "babel-plugin-transform-builtin-classes",
      {
        globals: ["Array", "Error", "HTMLElement"],
      },
    ],
    ["styled-components", { ssr: true }],
    "@babel/plugin-syntax-jsx",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-logical-assignment-operators",
  ],
};
