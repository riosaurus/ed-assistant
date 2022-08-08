import { createCipheriv, createDecipheriv } from "crypto";
import getEncryptionConfig from "../config/get-encryption-config";

/**
 * Encrypt the plaintext data
 */
export function encrypt(data: string): string {
    const config = getEncryptionConfig();
    const algorithm = config.get('algorithm', 'aes-128-cbc');
    const key = config.get('secretKey')!!;
    const iv = config.get('initializationVector')!!;
    const cipher = createCipheriv(algorithm, key, iv);
    let ciphertext = cipher.update(data, 'utf-8', 'base64');
    return ciphertext + cipher.final('base64');
}

/**
 * Decrypt the ciphertext
 */
export function decrypt(data: string): string {
    const config = getEncryptionConfig();
    const algorithm = config.get('algorithm', 'aes-128-cbc');
    const key = config.get('secretKey')!!;
    const iv = config.get('initializationVector')!!;
    const decipher = createDecipheriv(algorithm, key, iv);
    return Buffer
        .concat([
            decipher.update(data, 'base64'),
            decipher.final(),
        ])
        .toString();
}
