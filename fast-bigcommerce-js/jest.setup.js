// Jest doesn't support global.crypto by default (even though all major browsers do :thinking:)
// We'll "polyfill" it with @peculiar/webcrypto
import { Crypto } from "@peculiar/webcrypto";

global.crypto = new Crypto();
