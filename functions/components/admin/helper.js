import path from "path";
import { createHmac } from 'crypto'
import { readFileSync } from "fs";

import { generate } from '../passphrase/generator.js'

const sourcePath = path.resolve(process.cwd(), "components/passphrase/files/(1) The Hunger Games.txt");
const source = readFileSync(sourcePath);

export function hashPassphrase(passphrase) {
    // * This function will return the hashed passphrase through a SHA-256
    // * 1 - encode as UTF-8

    console.log("encriptando:", passphrase)

    return createHmac('sha256', "0de8bee5d7f9c5d209f8c6fabed0ea84cb3fca1244e8ed38079a61b599a84c47")
               .update(passphrase)
               .digest('hex');
}

export async function genPassphrase(length) {
    return generate({
        wordsCount: length,
        sampleSize: 3,
        source,
    });
}