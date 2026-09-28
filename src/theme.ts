import { useColorScheme } from 'react-native';

const light = {
  bg: '#FFFFFF',
  surface: '#F4F4F5',
  text: '#111111',
  muted: '#767676',
  accent: '#3B5BFF',
  like: '#FF3B5C',
}; 

const dark: typeof light = {
  bg: '#0B0B0F',
  surface: '#17171C',
  text: '#F2F2F5',
  muted: '#9A9AA5',
  accent: '#8134AF',
  like: '#FF3B5C',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24 } as const;
export const radius = { card: 14, pill: 999 } as const;

export function useTheme() {
  const scheme = useColorScheme(); // returns 'light' | 'dark' | null
  return scheme === 'dark' ? dark : light;
}