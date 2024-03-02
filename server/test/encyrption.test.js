const { encrypt, decrypt, decryptRequest } = require('../middleware/encryptionMiddleware');
const httpMocks = require('node-mocks-http'); // To mock Express request and response

describe('Encryption and Decryption', () => {
    test('encrypt and decrypt should return original text', () => {
        const text = 'Hello, world!';
        const encrypted = encrypt(text);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(text);
    });

    test('decryptRequest middleware should parse encrypted request body', (done) => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/test',
            body: {
                data: encrypt(JSON.stringify({ message: 'Hello, world!' }))
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        decryptRequest(req, res, next);

        expect(req.body).toEqual({ message: 'Hello, world!' });
        expect(next).toHaveBeenCalled();
        done();
    });

    test('decryptRequest middleware should handle decryption failure', (done) => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/test',
            body: {
                data: 'invalid encrypted data'
            }
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        decryptRequest(req, res, next);

        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({ message: 'Decryption failed' });
        expect(next).not.toHaveBeenCalled();
        done();
    });
});
