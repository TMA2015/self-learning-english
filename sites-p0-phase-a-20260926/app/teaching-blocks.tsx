import {Fragment,type ReactNode} from 'react';
// Deliberately small, text-only Markdown subset. No HTML, links or executable content.
export function Inline({text}:{text:string}){
 const parts=text.split(/(\*\*[^*]+\*\*|\*(?:\*\*[^*]+\*\*|[^*])+\*)/g);
 return <>{parts.map((part,i)=>part.startsWith('**')?<strong key={i}>{part.slice(2,-2)}</strong>:part.startsWith('*')?<em key={i}><Inline text={part.slice(1,-1)}/></em>:part)}</>;
}
export function TeachingBlocks({text}:{text:string}){
 const lines=text.replace(/\r\n?/g,'\n').split('\n');const blocks:ReactNode[]=[];
 for(let i=0;i<lines.length;){
  if(!lines[i].trim()){i++;continue}
  if(lines[i].startsWith('|')){
   const rows:string[][]=[];while(i<lines.length&&lines[i].startsWith('|')){const row=lines[i++].split('|').slice(1,-1).map(s=>s.trim());if(!row.every(c=>/^:?-+:?$/.test(c)))rows.push(row)}
   blocks.push(<div className="gdp-table-scroll" tabIndex={0} role="region" aria-label="Lesson comparison table" key={i}><table><thead><tr>{rows[0]?.map((c,k)=><th scope="col" key={k}><Inline text={c}/></th>)}</tr></thead><tbody>{rows.slice(1).map((row,j)=><tr key={j}>{row.map((c,k)=><td key={k}><Inline text={c}/></td>)}</tr>)}</tbody></table></div>);continue;
  }
  if(/^[-*] /.test(lines[i])){
   const items:string[]=[];while(i<lines.length&&/^[-*] /.test(lines[i]))items.push(lines[i++].slice(2));
   blocks.push(<ul className="gdp-items" key={i}>{items.map((item,j)=><li key={j}><Inline text={item}/></li>)}</ul>);continue;
  }
  if(/^\d{1,2}[.)] /.test(lines[i])){
   const items:string[]=[];while(i<lines.length&&/^\d{1,2}[.)] /.test(lines[i]))items.push(lines[i++].replace(/^\d{1,2}[.)] /,''));
   blocks.push(<ol className="gdp-items" key={i}>{items.map((item,j)=><li key={j}><Inline text={item}/></li>)}</ol>);continue;
  }
  const paragraph:string[]=[];while(i<lines.length&&lines[i].trim()&&!lines[i].startsWith('|')&&!/^[-*] |^\d{1,2}[.)] /.test(lines[i]))paragraph.push(lines[i++]);
  blocks.push(<p key={i}>{paragraph.map((line,j)=><Fragment key={j}>{j>0&&<br/>}<Inline text={line}/></Fragment>)}</p>);
 }
 return <>{blocks}</>;
}
