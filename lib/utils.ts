import { Livreur } from './types';

const DEFAULT_AVATAR = require('@/assets/images/default-avatar.png');

export function getUserAvatar(livreur: Livreur | null): any {
  if (!livreur || !livreur.photo_url || livreur.photo_url.trim() === '') {
    return DEFAULT_AVATAR;
  }
  return { uri: livreur.photo_url };
}
