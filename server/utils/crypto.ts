import crypto from 'node:crypto';

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const testHashBuf = Buffer.from(testHash, 'hex');
    if (hashBuf.length !== testHashBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, testHashBuf);
  } catch {
    return false;
  }
}

export function generateOTP(): string {
  // Generate random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(otp).digest('hex');
  return { hash, salt };
}

export function verifyOTP(otp: string, hash: string, salt: string): boolean {
  try {
    const testHash = crypto.createHmac('sha256', salt).update(otp).digest('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const testHashBuf = Buffer.from(testHash, 'hex');
    if (hashBuf.length !== testHashBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, testHashBuf);
  } catch {
    return false;
  }
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
