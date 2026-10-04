const configured=(process.env.NEXT_PUBLIC_BASE_PATH??'').trim();

function normalizeBasePath(value:string){
  if(!value||value==='/')return '';
  const withSlash=value.startsWith('/')?value:'/'+value;
  return withSlash.replace(/\/+$/,'');
}

export const PUBLIC_BASE_PATH=normalizeBasePath(configured);

export function publicPath(path:string){
  if(!path)return path;
  if(/^(?:[a-z]+:)?\/\//i.test(path)||path.startsWith('data:')||path.startsWith('blob:'))return path;
  const suffix=path.startsWith('/')?path:'/'+path;
  return PUBLIC_BASE_PATH+suffix;
}
