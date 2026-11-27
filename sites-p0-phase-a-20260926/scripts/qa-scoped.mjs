// Both lanes share the release runner. Only the registered expensive matrices
// differ; all safety and ordinary regression checks remain mandatory.
import registry from './qa-scope-registry.cjs';
registry.selfTest();
if(!process.argv.includes('--self-test')){
 registry.scope(process.env.SLE_QA_TIER,(process.env.SLE_QA_SKILLS||'').split(','));
 if(!['1','2'].includes(process.env.SLE_QA_TIER))throw Error('Explicit scoped tier required');
 process.argv.push('--scoped');
 await import('./qa-release.mjs');
}
