/**
 * Feature flags for controlled rollout of visual changes
 * All flags default to false for safety
 */

interface FeatureFlags {
  ui: {
    social: {
      v1: boolean; // New visual system for social feed
      v2: boolean; // Enhanced V2 visuals (development only)
    };
  };
}

const FLAGS: FeatureFlags = {
  ui: {
    social: {
      v1: true, // Enable new social visuals (can be toggled for testing)
      v2: false, // V2 enhancements (disabled - set to true to enable)
      // v2: __DEV__ ? true : false, // V2 enhancements (enabled in development only)
    },
  },
};

export const isFeatureEnabled = (path: string): boolean => {
  const keys = path.split('.');
  let current: any = FLAGS;
  
  for (const key of keys) {
    if (current[key] === undefined) return false;
    current = current[key];
  }
  
  return current === true;
};

export const getFeatureFlags = (): FeatureFlags => FLAGS;

// Helper for social v1 features
export const useSocialV1 = () => isFeatureEnabled('ui.social.v1');

// Helper for social v2 features
export const useSocialV2 = () => isFeatureEnabled('ui.social.v2');