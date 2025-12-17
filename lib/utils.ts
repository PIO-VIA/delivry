
const DEFAULT_AVATAR = require('@/assets/images/default-avatar.png');

export function getUserAvatar(livreur: any): any {
  if (!livreur || !livreur.photo_url || livreur.photo_url === '' || livreur.photo_url === 'null' || livreur.photo_url === undefined) {
    return DEFAULT_AVATAR;
  }
  // If it's a local file uri (starts with file:// or content://) or http(s)
  return { uri: livreur.photo_url };
}
