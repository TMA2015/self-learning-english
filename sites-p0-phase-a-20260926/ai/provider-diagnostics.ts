/** Allowlisted, transient observations. Never pass provider exceptions or input to a sink. */
export type ProviderFailure='client-timeout'|'backend-overload'|'deadline-exceeded'|'quota-rate-limit'|'app-check-permission'|'invalid-response'|'unknown-provider-error'|'request-pending'|'cooldown'|'unavailable';
export class SafeProviderError extends Error{
  constructor(readonly classification:ProviderFailure){super(classification)}
}
export function classifyProviderFailure(error:unknown):ProviderFailure{
  if(error instanceof SafeProviderError)return error.classification;
  // Inspect locally; this string must never escape to diagnostics or persisted state.
  let text='';
  try{if(error&&typeof error==='object'){
    const e=error as {code?:unknown;message?:unknown};
    text=[e.code,e.message].filter(v=>typeof v==='string').join(' ').toLowerCase();
  }}catch{return 'unknown-provider-error'}
  if(/app.?check|permission.denied|unauthenticated|\b403\b/.test(text))return 'app-check-permission';
  if(/resource.exhausted|quota|rate.limit|\b429\b/.test(text))return 'quota-rate-limit';
  if(/deadline.exceeded/.test(text))return 'deadline-exceeded';
  if(/internal|overload|high demand/.test(text))return 'backend-overload';
  return 'unknown-provider-error';
}
export type ProviderDiagnostic={provider:'firebase-ai-logic';classification:ProviderFailure;phase:'fallback'|'settled-after-timeout'};
export type DiagnosticSink=(diagnostic:ProviderDiagnostic)=>void;
export function emitSafeDiagnostic(sink:DiagnosticSink|undefined,classification:ProviderFailure,phase:ProviderDiagnostic['phase']='fallback'){
  try{sink?.({provider:'firebase-ai-logic',classification,phase})}catch{/* observability cannot break fallback */}
}

