import { useState, useEffect } from 'react';
import { THEME_COLORS } from '../constants/pokingPokerConstants';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('pokerTheme');
    return savedTheme ? JSON.parse(savedTheme) : THEME_COLORS[0];
  });
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pokerTheme', JSON.stringify(theme));
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    setShowThemePicker(false);
  };

  return {
    theme,
    showThemePicker,
    setShowThemePicker,
    changeTheme,
  };
}; 