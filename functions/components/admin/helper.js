import path from "path";
import { createHmac } from 'crypto'
import { readFileSync } from "fs";
import adminAuth from '../../firebaseAdmin.js'
import { generate } from '../passphrase/generator.js'

import { deletePassphrase } from '../passphrase/store.js'
import { deleteOrganization } from '../organization/store.js'
import { deleteClient } from './store.js'

const sourcePath = path.resolve(process.cwd(), "components/passphrase/files/(1) The Hunger Games.txt");
const source = readFileSync(sourcePath);

export function hashPassphrase(passphrase) {
    // * This function will return the hashed passphrase through a SHA-256
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

export async function rollBackClient(params) {
    // * Go through the params to check what should be deleted
    
    // * reached untill Firebase Authentication - contains the uid
    if (params.auth) 
        await adminAuth.deleteUser(params.auth)
    
    // * reached until Passphrase - contains the passphrase ObjectId
    if (params.pass)
        await deletePassphrase(params.pass)
    
    // * reached until Organization - contains the organization ObjectId
    if (params.org)
        await deleteOrganization(params.org)

    // * reached until Client - contains the client ObjectId
    if (params.client)
        await deleteClient(params.client)
}