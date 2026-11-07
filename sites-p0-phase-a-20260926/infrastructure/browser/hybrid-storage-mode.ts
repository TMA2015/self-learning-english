/**
 * Non-production staging switch for the IndexedDB content vault.
 *
 * The default, and all current LIVE Firebase builds, remain LEGACY.
 * Never set this to "enabled" in a learner-facing release until combined V2
 * Recovery, real Save/Resume, and owner iPad Safari gates are approved.
 */
export function hybridStorageEnabled(){
 return process.env.NEXT_PUBLIC_SLE_HYBRID_STORAGE==='enabled';
}
