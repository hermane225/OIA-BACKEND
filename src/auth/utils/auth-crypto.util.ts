import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

const PASSWORD_ALGORITHM = 'scrypt';
const PASSWORD_SALT_BYTES = 16;
const PASSWORD_KEY_LENGTH = 64;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function hashPassword(password: string): string {
  const salt = randomBytes(PASSWORD_SALT_BYTES).toString('hex');
  const derivedKey = scryptSync(password, salt, PASSWORD_KEY_LENGTH) as Buffer;

  return `${PASSWORD_ALGORITHM}$${salt}$${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [algorithm, salt, key] = storedHash.split('$');

    if (algorithm !== PASSWORD_ALGORITHM || !salt || !key) {
      return false;
    }

    const derivedKey = scryptSync(
      password,
      salt,
      PASSWORD_KEY_LENGTH,
    ) as Buffer;
    const storedKey = Buffer.from(key, 'hex');

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedKey, derivedKey);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
