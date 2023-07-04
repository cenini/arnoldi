import { generateUUID } from '../utils/uuid';

export function load({ cookies }) {
	const visited = cookies.get('visited');
	cookies.set('visited', 'true', { path: '/' });
  const userIdFallbackCookieName = 'user-id-fallback'
  if (!cookies.get(userIdFallbackCookieName)) {
    cookies.set(userIdFallbackCookieName, generateUUID(), { path: '/' });
  }
  const userIdFallback = cookies.get(userIdFallbackCookieName)

	return {
		userIdFallback
	};
}
