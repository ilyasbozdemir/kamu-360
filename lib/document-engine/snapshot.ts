import { BelgeSnapshotKaydi } from './types'

export async function buildBelgeSnapshot(
  dosyaId: number | string,
  templateCode: string,
  templateVersion: string,
  resolvedData: any,
  operatorUsername: string
): Promise<BelgeSnapshotKaydi> {
  const jsonString = JSON.stringify(resolvedData)

  let contentHash = ''
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder()
    const data = encoder.encode(jsonString)
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    contentHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } else {
    try {
      const { createHash } = await import('crypto')
      contentHash = createHash('sha256').update(jsonString).digest('hex')
    } catch {
      contentHash = 'TEMIN-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    }
  }

  return {
    dosyaId,
    templateCode,
    templateVersion,
    snapshotJson: jsonString,
    contentHash,
    sealedBy: operatorUsername,
    sealedAt: new Date().toISOString(),
  }
}

