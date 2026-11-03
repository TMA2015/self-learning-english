const fs=require('node:fs'),{execFileSync}=require('node:child_process');
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','domain/learning-model.ts','domain/assessment-inspector.ts','domain/portable-data.ts','application/learning-service.ts','application/export-learner.ts','application/restore-learner.ts','application/writing-tutor.ts','application/assisted-review.ts','domain/content-model.ts','ai/service.ts','infrastructure/ai/openai-http.ts','infrastructure/auth/sites.ts','--outDir','.sites-runtime/portable-tests','--module','commonjs','--target','es2022','--resolveJsonModule','--esModuleInterop','--skipLibCheck'],{stdio:'inherit'});
fs.writeFileSync('.sites-runtime/portable-tests/package.json','{"type":"commonjs"}\n');
require('./core-engine.cjs');require('./portability.cjs');

require('./writing-tutor.cjs');

require('./assisted-review.cjs');
