import { createCipheriv, createDecipheriv, Encoding } from 'crypto';
import { getEncryptionConfiguration } from '../config';

class SecretKeyNotSetError extends Error {
    constructor() {
        super("Secret Key not set");
    }
}

class IVNotSetError extends Error {
    constructor() {
        super("Initialization Vector not set");
    }
}

export function getEncryptedBuffer(data: string, inputEncoding: Encoding): Buffer {
    const config = getEncryptionConfiguration();
    const algorithm = config.get('algorithm', 'aes-128-cbc');
    
    const secretKey = config.get('secretKey');
    if (!secretKey) {
        throw new SecretKeyNotSetError();
    }
    const initializationVector = config.get('initializationVector');
    if (!initializationVector) {
        throw new IVNotSetError();
    }

    const cipher = createCipheriv(algorithm, secretKey, initializationVector);
    return Buffer.concat([
        cipher.update(data, inputEncoding),
        cipher.final(),
    ]);
}

export function getDecryptedBuffer(data: string, inputEncoding: Encoding): Buffer {
    const config = getEncryptionConfiguration();
    const algorithm = config.get('algorithm', 'aes-128-cbc');
    
    const secretKey = config.get('secretKey');
    if (!secretKey) {
        throw new SecretKeyNotSetError();
    }
    const initializationVector = config.get('initializationVector');
    if (!initializationVector) {
        throw new IVNotSetError();
    }

    const decipher = createDecipheriv(algorithm, secretKey, initializationVector);
    return Buffer.concat([
        decipher.update(data, inputEncoding),
        decipher.final(),
    ]);
}
