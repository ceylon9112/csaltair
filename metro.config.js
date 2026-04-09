// @see https://docs.expo.dev/guides/customizing-metro/
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Stable project root (helps Windows paths with spaces)
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
