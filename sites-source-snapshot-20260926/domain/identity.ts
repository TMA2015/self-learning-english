export type Principal={accountId:string;roles:('learner'|'admin')[]};
export interface AuthenticationAdapter {authenticate(request:{headers:Headers}):Principal|null}
