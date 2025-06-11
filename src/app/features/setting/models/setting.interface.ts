// Setting interfaces for type safety
export interface NotificationSettings {
  email: {
    security: boolean;
    election: boolean;
    results: boolean;
  };
  inApp: {
    sound: boolean;
    popup: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  // Removed loginHistory array - feature not implemented
}

export interface SettingTabType {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface UISettings {
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
  animations: {
    pageTransition: boolean;
    hover: boolean;
  };
}
