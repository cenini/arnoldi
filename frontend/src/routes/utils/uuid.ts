import { v4 as uuidv4 } from 'uuid';
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    return uuidv4();
  }
}