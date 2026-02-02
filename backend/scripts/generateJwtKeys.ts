import fs from 'node:fs';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
    options: {
        force: {
            type: 'boolean',
            default: false
        }
    }
});

const force = values.force;

function main(): void {

    const basePath = path.resolve('config/jwt');
    const privatePath = path.join(basePath, 'private.pem');
    const publicPath = path.join(basePath, 'public.pem');

    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    const keysAlreadyExists = fs.existsSync(privatePath) && fs.existsSync(publicPath);
    if (keysAlreadyExists && !force) {
        console.log('JWT keys already exist');
        return;
    }

    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
    });

    fs.writeFileSync(privatePath, privateKey);
    fs.writeFileSync(publicPath, publicKey);

    console.log('JWT keys generated');
}

main();

