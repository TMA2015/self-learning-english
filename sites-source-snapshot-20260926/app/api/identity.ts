import {SitesAuthentication} from '@/infrastructure/auth/sites';
import {runtimeConfig} from '@/infrastructure/runtime';
export function principal(request:{headers:Headers}){return new SitesAuthentication((runtimeConfig().ADMIN_EMAILS??'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean)).authenticate(request)}
export function learnerKey(request:{headers:Headers}){return principal(request)?.accountId??null}
export function isAdministrator(request:{headers:Headers}){return principal(request)?.roles.includes('admin')??false}
