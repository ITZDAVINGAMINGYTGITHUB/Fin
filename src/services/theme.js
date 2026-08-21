// Fin Theme System
// Design tokens and theme management

const themes = {
  'deep-sea': {
    id: 'deep-sea',
    name: 'Deep Sea',
    colors: {
      // Backgrounds
      background: '#0B1015',
      backgroundSecondary: '#111820',
      surface: '#17212A',
      surfaceElevated: '#1D2933',
      
      // Text
      textPrimary: '#E8EEF2',
      textSecondary: '#93A3AE',
      textMuted: '#5C6D7A',
      
      // Accent
      accent: '#4FA7B8',
      accentBright: '#6BC7D7',
      accentDark: '#3D8A99',
      
      // Borders
      border: '#2A3844',
      borderSubtle: '#1F2D38',
      
      // Status
      success: '#4CAF8B',
      warning: '#F5A642',
      error: '#E76B6B',
      info: '#4FA7B8',
      
      // Tab colors
      tabActive: '#17212A',
      tabInactive: '#111820',
      tabHover: '#1D2933',
      
      // Special
      highlight: 'rgba(79, 167, 184, 0.2)',
      overlay: 'rgba(11, 16, 21, 0.8)',
    },
  },
  'abyss': {
    id: 'abyss',
    name: 'Abyss',
    colors: {
      background: '#05070A',
      backgroundSecondary: '#0A0F14',
      surface: '#0F161D',
      surfaceElevated: '#141D26',
      textPrimary: '#E0E6EB',
      textSecondary: '#8A97A3',
      textMuted: '#4A5560',
      accent: '#5B7C99',
      accentBright: '#7A9BB8',
      accentDark: '#4A6580',
      border: '#1F2D3A',
      borderSubtle: '#15202A',
      success: '#4A9B8B',
      warning: '#D49542',
      error: '#C96B6B',
      info: '#5B7C99',
      tabActive: '#0F161D',
      tabInactive: '#0A0F14',
      tabHover: '#141D26',
      highlight: 'rgba(91, 124, 153, 0.2)',
      overlay: 'rgba(5, 7, 10, 0.8)',
    },
  },
  'reef': {
    id: 'reef',
    name: 'Reef',
    colors: {
      background: '#0A1214',
      backgroundSecondary: '#0F1A1C',
      surface: '#142326',
      surfaceElevated: '#1A2F33',
      textPrimary: '#E6F0F1',
      textSecondary: '#8BA3A8',
      textMuted: '#556B6F',
      accent: '#4FA79A',
      accentBright: '#6BC7B8',
      accentDark: '#3D8A7F',
      border: '#2A4044',
      borderSubtle: '#1F3033',
      success: '#4CAF8B',
      warning: '#F5A642',
      error: '#E76B6B',
      info: '#4FA79A',
      tabActive: '#142326',
      tabInactive: '#0F1A1C',
      tabHover: '#1A2F33',
      highlight: 'rgba(79, 167, 154, 0.2)',
      overlay: 'rgba(10, 18, 20, 0.8)',
    },
  },
  'arctic': {
    id: 'arctic',
    name: 'Arctic',
    colors: {
      background: '#F0F4F7',
      backgroundSecondary: '#E6ECF1',
      surface: '#DCE4EA',
      surfaceElevated: '#FFFFFF',
      textPrimary: '#1A232A',
      textSecondary: '#5C6D7A',
      textMuted: '#93A3AE',
      accent: '#4FA7B8',
      accentBright: '#6BC7D7',
      accentDark: '#3D8A99',
      border: '#C5D0D8',
      borderSubtle: '#D5DEE5',
      success: '#4CAF8B',
      warning: '#F5A642',
      error: '#E76B6B',
      info: '#4FA7B8',
      tabActive: '#FFFFFF',
      tabInactive: '#E6ECF1',
      tabHover: '#DCE4EA',
      highlight: 'rgba(79, 167, 184, 0.15)',
      overlay: 'rgba(240, 244, 247, 0.9)',
    },
  },
  'sunset': {
    id: 'sunset',
    name: 'Sunset',
    colors: {
      background: '#0B1015',
      backgroundSecondary: '#141820',
      surface: '#1D232A',
      surfaceElevated: '#252D35',
      textPrimary: '#F0ECE6',
      textSecondary: '#A89F95',
      textMuted: '#6D6359',
      accent: '#D48A5C',
      accentBright: '#E7A67A',
      accentDark: '#B8754A',
      border: '#3A3244',
      borderSubtle: '#2A2330',
      success: '#4CAF8B',
      warning: '#F5A642',
      error: '#E76B6B',
      info: '#D48A5C',
      tabActive: '#1D232A',
      tabInactive: '#141820',
      tabHover: '#252D35',
      highlight: 'rgba(212, 138, 92, 0.2)',
      overlay: 'rgba(11, 16, 21, 0.8)',
    },
  },
  'monochrome': {
    id: 'monochrome',
    name: 'Monochrome',
    colors: {
      background: '#0A0A0A',
      backgroundSecondary: '#121212',
      surface: '#1A1A1A',
      surfaceElevated: '#242424',
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textMuted: '#606060',
      accent: '#808080',
      accentBright: '#B0B0B0',
      accentDark: '#505050',
      border: '#333333',
      borderSubtle: '#222222',
      success: '#808080',
      warning: '#A0A0A0',
      error: '#A0A0A0',
      info: '#808080',
      tabActive: '#1A1A1A',
      tabInactive: '#121212',
      tabHover: '#242424',
      highlight: 'rgba(128, 128, 128, 0.2)',
      overlay: 'rgba(10, 10, 10, 0.8)',
    },
  },
};

let activeThemeId = 'deep-sea';

class ThemeManager {
  static getThemes() {
    return Object.values(themes);
  }

  static getTheme(id) {
    return themes[id] || themes['deep-sea'];
  }

  static getActiveTheme() {
    return themes[activeThemeId];
  }

  static setTheme(themeId) {
    if (themes[themeId]) {
      activeThemeId = themeId;
      return { success: true, theme: themes[themeId] };
    }
    return { success: false, error: 'Theme not found' };
  }

  static getCSSVariables(themeId) {
    const theme = this.getTheme(themeId || activeThemeId);
    const colors = theme.colors;
    
    return `
      /* Fin Theme: ${theme.name} */
      --fin-bg: ${colors.background};
      --fin-bg-secondary: ${colors.backgroundSecondary};
      --fin-surface: ${colors.surface};
      --fin-surface-elevated: ${colors.surfaceElevated};
      
      --fin-text-primary: ${colors.textPrimary};
      --fin-text-secondary: ${colors.textSecondary};
      --fin-text-muted: ${colors.textMuted};
      
      --fin-accent: ${colors.accent};
      --fin-accent-bright: ${colors.accentBright};
      --fin-accent-dark: ${colors.accentDark};
      
      --fin-border: ${colors.border};
      --fin-border-subtle: ${colors.borderSubtle};
      
      --fin-success: ${colors.success};
      --fin-warning: ${colors.warning};
      --fin-error: ${colors.error};
      --fin-info: ${colors.info};
      
      --fin-tab-active: ${colors.tabActive};
      --fin-tab-inactive: ${colors.tabInactive};
      --fin-tab-hover: ${colors.tabHover};
      
      --fin-highlight: ${colors.highlight};
      --fin-overlay: ${colors.overlay};
    `;
  }
}

module.exports = ThemeManager;
