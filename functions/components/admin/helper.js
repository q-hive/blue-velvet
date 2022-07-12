export async function hashPassphrase(passphrase) {
    // * This function will return the hashed passphrase through a SHA-256
    // * 1 - encode as UTF-8
    const pssBuffer = new TextEncoder().encode(passphrase);                    
    
    // * 2 - hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', pssBuffer);

    // * 3 - convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // * 4 - convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export async function genPassphrase() {
    // TODO: Program the passphrase generation algorithm
    return "passphrase"
}