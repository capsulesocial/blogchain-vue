import { keyStores } from 'near-api-js'
import { KeyPairEd25519 } from 'near-api-js/lib/utils'
import { base_decode as baseDecode } from 'near-api-js/lib/utils/serialize'
import { crypto_sign_detached as cryptoSignDetached, ready } from 'libsodium-wrappers'
import { getNearConfig } from './config'
import { stableOrderObj, uint8ArrayToHexString } from './helpers'

const nearConfig = getNearConfig()

async function getNearPrivateKey() {
	const accountId = window.localStorage.getItem(`accountId`)
	if (!accountId) {
		throw new Error(`Account ID not found in local storage`)
	}

	const keystore = new keyStores.BrowserLocalStorageKeyStore()
	const keypair = (await keystore.getKey(nearConfig.networkId, accountId)) as KeyPairEd25519

	const privateKey = keypair.secretKey
	const privateKeyBytes = new Uint8Array(baseDecode(privateKey))

	return {
		sk: privateKeyBytes,
		pk: uint8ArrayToHexString(keypair.publicKey.data),
	}
}

export async function signContent<T>(content: T) {
	await ready
	const { sk, pk } = await getNearPrivateKey()
	const ec = new TextEncoder()
	const message = ec.encode(JSON.stringify(stableOrderObj(content)))
	return { sig: cryptoSignDetached(message, sk), publicKey: pk }
}
