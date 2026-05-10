/**
 * Expo config plugin to work around Windows filesystem corruption in the android build folder.
 *
 * Three things are patched:
 *  1. Project-level Gradle cache (.gradle/9.0.0/fileHashes) is redirected to .gradle_cache
 *  2. Gradle BUILD CACHE is disabled (was unpacking into corrupted build/intermediates paths)
 *  3. The app module buildDir is redirected to C:/GradleBuild/Tazeeq (outside the corrupted drive)
 */
const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins');

// Step 1 & 2: Fix gradle.properties
const withGradleProps = (config) => {
  return withGradleProperties(config, (config) => {
    const props = config.modResults;
    const keysToSet = ['org.gradle.projectcachedir', 'org.gradle.caching'];
    const filtered = props.filter(
      (item) => !(item.type === 'property' && keysToSet.includes(item.key))
    );
    filtered.push({ type: 'property', key: 'org.gradle.projectcachedir', value: '.gradle_cache' });
    filtered.push({ type: 'property', key: 'org.gradle.caching', value: 'false' });
    config.modResults = filtered;
    return config;
  });
};

// Step 3: Redirect app buildDir to a clean location outside the project
const withRedirectedBuildDir = (config) => {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    const redirectLine = `\nbuildDir = "C:/GradleBuild/Tazeeq"\n`;

    // Only add if not already present
    if (!buildGradle.includes('C:/GradleBuild/Tazeeq')) {
      // Insert at the very top of the file
      config.modResults.contents = redirectLine + buildGradle;
    }

    return config;
  });
};

const withGradleCache = (config) => {
  config = withGradleProps(config);
  config = withRedirectedBuildDir(config);
  return config;
};

module.exports = withGradleCache;
