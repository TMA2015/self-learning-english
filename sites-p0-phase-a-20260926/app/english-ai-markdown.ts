/** A deliberately small, text-only Markdown subset for untrusted AI replies.
 * The renderer must create React text nodes, never HTML strings. */
export type TutorMarkdownBlock =
  | {kind:'paragraph';lines:string[]}
  | {kind:'list';ordered:boolean;items:string[]};

export function parseTutorMarkdown(input:string):TutorMarkdownBlock[]{
  const blocks:TutorMarkdownBlock[]=[];
  let paragraph:string[]=[];
  let listItems:string[]=[];
  let ordered=false;
  function flushParagraph(){if(paragraph.length){blocks.push({kind:'paragraph',lines:paragraph});paragraph=[]}}
  function flushList(){if(listItems.length){blocks.push({kind:'list',ordered,items:listItems});listItems=[]}}
  for(const raw of input.slice(0,3500).replace(/\r\n?/g,'\n').split('\n')){
    const line=raw.trim();
    if(!line){flushParagraph();flushList();continue}
    const number=line.match(/^\d{1,2}[.)]\s+(.+)$/);
    const bullet=line.match(/^[-*]\s+(.+)$/);
    if(number||bullet){
      flushParagraph();
      const nextOrdered=Boolean(number);
      if(listItems.length&&nextOrdered!==ordered)flushList();
      ordered=nextOrdered;
      listItems.push((number??bullet)![1]);
    }else{flushList();paragraph.push(line)}
  }
  flushParagraph();flushList();
  return blocks;
}

/** Only **bold** markers are interpreted; all other characters stay literal text. */
export function splitTutorBold(input:string):Array<{text:string;bold:boolean}>{
  return input.split(/(\*\*[^*\n]{1,300}\*\*)/g).filter(Boolean).map(part=>
    part.startsWith('**')&&part.endsWith('**')&&part.length>4
      ?{text:part.slice(2,-2),bold:true}:{text:part,bold:false});
}
