import { useState, useEffect } from 'react';
import { fetchAvatar, getRandomAvatarUrl, getUsernameAvatarUrl } from '../services/avatarService';
import { updateAvatar } from '../services/socketService';

export const useAvatar = (socket, roomId) => {
  const [userAvatar, setUserAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    return savedAvatar || null;
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // Initialize avatar if not already set
  useEffect(() => {
    const initializeAvatar = async () => {
      if (!userAvatar) {
        const username = localStorage.getItem('userName');
        if (!username) return;
        try {
          setIsGeneratingAvatar(true);
          const avatarData = await fetchAvatar(getUsernameAvatarUrl(username));
          setUserAvatar(avatarData);
          localStorage.setItem('userAvatar', avatarData);
        } catch (error) {
          console.error('Failed to initialize avatar:', error);
        } finally {
          setIsGeneratingAvatar(false);
        }
      }
    };
    
    initializeAvatar();
  }, [userAvatar]);

  // Initialize preview avatar when opening avatar modal
  useEffect(() => {
    if (showAvatarOptions) {
      setPreviewAvatar(userAvatar);
    }
  }, [showAvatarOptions, userAvatar]);

  const getRandomAvatar = async () => {
    try {
      setIsGeneratingAvatar(true);
      const avatarData = await fetchAvatar(getRandomAvatarUrl());
      setPreviewAvatar(avatarData);
    } catch (error) {
      console.error('Failed to get random avatar:', error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const saveAvatar = () => {
    if (previewAvatar) {
      setUserAvatar(previewAvatar);
      localStorage.setItem('userAvatar', previewAvatar);

      // Update server with new avatar
      if (socket) {
        updateAvatar(roomId, previewAvatar);
      }
    }
    setShowAvatarOptions(false);
  };

  return {
    userAvatar,
    previewAvatar,
    showAvatarOptions,
    setShowAvatarOptions,
    getRandomAvatar,
    saveAvatar,
    isGeneratingAvatar
  };
}; 