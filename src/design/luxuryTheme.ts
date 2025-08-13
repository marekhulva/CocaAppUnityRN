export const LuxuryTheme = {
  // Screen-specific gradient themes - Black, Silver, Gold variations
  gradients: {
    daily: {
      // Morning gold - luxurious and warm
      colors: [
        ['#0A0A0A', '#1C1C1C', '#2A2A2A'], // Deep black base
        ['#1C1C1C', '#FFD700', '#1C1C1C'], // Gold accent pulse
        ['#2A2A2A', '#C0C0C0', '#0A0A0A'], // Silver shimmer
      ],
    },
    progress: {
      // Platinum progress - sleek and professional
      colors: [
        ['#000000', '#1A1A1A', '#2D2D2D'], // Pure black gradient
        ['#1A1A1A', '#E5E4E2', '#1A1A1A'], // Platinum shine
        ['#2D2D2D', '#FFD700', '#000000'], // Gold highlight
      ],
    },
    social: {
      // Rose gold social - warm metallics
      colors: [
        ['#0D0D0D', '#1F1F1F', '#0D0D0D'], // Charcoal base
        ['#1F1F1F', '#B76E79', '#1F1F1F'], // Rose gold accent
        ['#0D0D0D', '#FFD700', '#0D0D0D'], // Gold shimmer
      ],
    },
    profile: {
      // Obsidian depth - mysterious and premium
      colors: [
        ['#000000', '#0A0A0A', '#141414'], // True black depth
        ['#0A0A0A', '#C0C0C0', '#0A0A0A'], // Silver accent
        ['#141414', '#FFD700', '#000000'], // Gold trim
      ],
    },
  },

  // Luxury color palette
  colors: {
    primary: {
      gold: '#FFD700',           // Pure Gold
      champagne: '#F7E7CE',      // Champagne Gold
      silver: '#C0C0C0',         // Pure Silver
      platinum: '#E5E4E2',       // Platinum
      gunmetal: '#2C3539',       // Gunmetal Gray
      obsidian: '#0A0A0A',       // Deep Black
      pearl: '#F8F8F8',          // Pearl White
      roseGold: '#B76E79',       // Rose Gold
    },
    
    // Glass effects with metallic tints
    glass: {
      gold: 'rgba(255, 215, 0, 0.08)',
      silver: 'rgba(192, 192, 192, 0.08)',
      platinum: 'rgba(229, 228, 226, 0.08)',
      obsidian: 'rgba(10, 10, 10, 0.3)',
      pearl: 'rgba(248, 248, 248, 0.05)',
    },

    // Metallic glows
    glow: {
      gold: 'rgba(255, 215, 0, 0.3)',
      silver: 'rgba(192, 192, 192, 0.3)',
      platinum: 'rgba(229, 228, 226, 0.4)',
      warm: 'rgba(255, 215, 0, 0.2)',
      cool: 'rgba(192, 192, 192, 0.2)',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E4E2',
      tertiary: '#C0C0C0',
      muted: '#808080',
      gold: '#FFD700',
      silver: '#C0C0C0',
    },

    // Background shades
    background: {
      primary: '#000000',
      secondary: '#0A0A0A',
      tertiary: '#141414',
      card: 'rgba(255, 255, 255, 0.03)',
      hover: 'rgba(255, 215, 0, 0.05)',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(255, 215, 0, 0.1)',
      active: 'rgba(255, 215, 0, 0.2)',
      disabled: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(192, 192, 192, 0.1)',
    },
  },

  // Component-specific styles
  components: {
    card: {
      background: 'rgba(255, 255, 255, 0.02)',
      border: 'rgba(192, 192, 192, 0.08)',
      shadow: {
        color: '#FFD700',
        opacity: 0.1,
        radius: 20,
        offset: { width: 0, height: 10 },
      },
    },
    
    button: {
      primary: {
        background: ['#FFD700', '#F7E7CE'],
        text: '#000000',
      },
      secondary: {
        background: 'rgba(192, 192, 192, 0.1)',
        border: 'rgba(192, 192, 192, 0.2)',
        text: '#FFFFFF',
      },
      luxury: {
        background: 'rgba(255, 215, 0, 0.1)',
        border: 'rgba(255, 215, 0, 0.3)',
        text: '#FFD700',
      },
    },

    tab: {
      active: {
        background: 'rgba(255, 215, 0, 0.1)',
        border: 'rgba(255, 215, 0, 0.3)',
        text: '#FFD700',
      },
      inactive: {
        background: 'rgba(255, 255, 255, 0.02)',
        border: 'rgba(192, 192, 192, 0.08)',
        text: '#C0C0C0',
      },
    },

    accent: {
      gold: {
        light: 'rgba(255, 215, 0, 0.15)',
        medium: 'rgba(255, 215, 0, 0.3)',
        strong: 'rgba(255, 215, 0, 0.5)',
      },
      silver: {
        light: 'rgba(192, 192, 192, 0.15)',
        medium: 'rgba(192, 192, 192, 0.3)',
        strong: 'rgba(192, 192, 192, 0.5)',
      },
    },
  },

  // Gradient presets
  gradientPresets: {
    goldShine: ['#FFD700', '#F7E7CE', '#FFD700'],
    silverShine: ['#C0C0C0', '#E5E4E2', '#C0C0C0'],
    blackFade: ['#000000', '#1A1A1A', '#000000'],
    luxuryMix: ['#FFD700', '#C0C0C0', '#FFD700'],
    obsidianDepth: ['#000000', '#0A0A0A', '#141414'],
  },
};