function binaryMethod(text, key) {
    let result = '';
    key = key >> 8; // Shift à direita de 8 bits
    if (key === 0) {
        return text;
    }
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key); // XOR entre o caractere e a chave
    }
    return result;
}

function encrypt(inString) {
    const StartKey = process.env.CHAVE_CRIPTOGRAFIA; // Chave inicial padrão
    console.log('StartKey', StartKey);
    return binaryMethod(inString, StartKey);
}

function decrypt(inString) {
    const StartKey = process.env.CHAVE_CRIPTOGRAFIA; // Chave inicial padrão
    return binaryMethod(inString, StartKey);
}


