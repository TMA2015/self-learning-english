import {SafeProviderError,classifyProviderFailure,emitSafeDiagnostic,type DiagnosticSink} from '../../ai/provider-diagnostics';

export type RequestClock={now():number;set(callback:()=>void,ms:number):unknown;clear(timer:unknown):void};
const clock:RequestClock={now:()=>Date.now(),set:(callback,ms)=>setTimeout(callback,ms),clear:timer=>clearTimeout(timer as ReturnType<typeof setTimeout>)};

/** A UI deadline is not cancellation. Hold the lock until the real SDK promise settles. */
export class FirebaseRequestLifecycle{
  private pending=false;
  private lastStartedAt:number|null=null;
  constructor(private readonly sink?:DiagnosticSink,private readonly timer:RequestClock=clock,private readonly timeoutMs=20_000,private readonly gapMs=1_200){}
  get inFlight(){return this.pending}
  async run<T>(start:()=>Promise<T>):Promise<T>{
    if(this.pending)throw new SafeProviderError('request-pending');
    const now=this.timer.now();
    if(this.lastStartedAt!==null&&now-this.lastStartedAt<this.gapMs)throw new SafeProviderError('cooldown');
    this.pending=true;
    this.lastStartedAt=now;
    let timedOut=false;
    // Handles synchronous initialization errors and late rejections without unhandled promises.
    const underlying=Promise.resolve().then(start);
    const tracked=underlying.then(value=>{this.pending=false;return value},error=>{
      this.pending=false;
      if(timedOut)emitSafeDiagnostic(this.sink,classifyProviderFailure(error),'settled-after-timeout');
      throw error;
    });
    let handle:unknown;
    try{return await Promise.race([tracked,new Promise<never>((_,reject)=>{
      handle=this.timer.set(()=>{timedOut=true;reject(new SafeProviderError('client-timeout'))},this.timeoutMs);
    })])}finally{if(handle!==undefined)this.timer.clear(handle)}
  }
}

