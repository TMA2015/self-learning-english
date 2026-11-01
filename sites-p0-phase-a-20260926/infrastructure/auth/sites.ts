import type {AuthenticationAdapter,Principal} from '../../domain/identity';
/** Use only behind Sites' trusted dispatcher. Never trust these headers on a public Node origin. */
export class SitesAuthentication implements AuthenticationAdapter {
 constructor(private adminEmails:string[]=[]){ }
 authenticate(request:{headers:Headers}):Principal|null{
  const id=request.headers.get('oai-authenticated-user-id')?.trim();
  const raw=request.headers.get('oai-authenticated-user-email')?.trim().toLowerCase();
  const email=raw&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)?raw:null;
  const accountId=id?`user:${id}`:email?`email:${email}`:null;
  return accountId?{accountId,roles:email&&this.adminEmails.includes(email)?['learner','admin']:['learner']}:null;
 }
}
