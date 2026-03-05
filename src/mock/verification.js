/**
 * ProofPic PoC: simulated photo verification flow.
 * In production: real image hash, device attestation (Play Integrity / App Attest), ZK proof, zkVerify submission.
 */

/** Simulate computing image hash from file. Returns a mock hash. */
export function computeImageHash(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      // In production: actual hash (e.g. SHA-256 of pixel data or file bytes)
      const mockHash = 'H_' + btoa(String(file.size + file.lastModified)).slice(0, 24).replace(/[+/=]/g, '')
      setTimeout(() => resolve(mockHash), 400)
    }
    reader.readAsArrayBuffer(file.slice(0, 1024))
  })
}

/** Simulate device attestation: "Device certifies H was captured at T by genuine hardware." */
export function simulateAttestation(imageHash) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        attested: true,
        timestamp: Date.now(),
        deviceId: 'device_' + Math.random().toString(36).slice(2, 10),
      })
    }, 500)
  })
}

/** Simulate generating ZK proof (Groth16). */
export function simulateProofGeneration(imageHash, attestation) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        proofPayload: 'zk_proof_' + Date.now(),
        publicInputs: [imageHash],
        receiptId: null, // set after zkVerify
      })
    }, 600)
  })
}

/** Simulate submitting proof to zkVerify and getting receipt. */
export function simulateZkVerifySubmit(proof) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const receiptId = 'zkVerify_receipt_' + Date.now()
      resolve({
        valid: true,
        receiptId,
        txHash: '0x' + Math.random().toString(16).slice(2, 18),
      })
    }, 800)
  })
}

/**
 * Full flow: hash → attestation → proof → zkVerify.
 * Yields step names for UI progress.
 */
export async function runVerificationFlow(file, onStep) {
  onStep?.('hash')
  const imageHash = await computeImageHash(file)
  onStep?.('attestation')
  const attestation = await simulateAttestation(imageHash)
  onStep?.('proof')
  const proof = await simulateProofGeneration(imageHash, attestation)
  onStep?.('zkverify')
  const result = await simulateZkVerifySubmit(proof)
  return {
    imageHash,
    attestation,
    proof,
    receiptId: result.receiptId,
    txHash: result.txHash,
    verifiedAt: Date.now(),
  }
}
