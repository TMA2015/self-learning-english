'use client';
/**
 * Reusable, no-provider learning interactions for SLE.
 * These components own NO attempt, score, answer key storage or persistence.
 * Parent courses pass their already-versioned draft and explicit check state.
 * Accessible native controls are intentionally preferred over mandatory drag/drop.
 */
export type SortCard={id:string;text:string;key:string;rationale:string};
export type PlannerField={key:string;label:string;help?:string};
export type CardSortBoardProps={
 idPrefix:string;title:string;cards:readonly SortCard[];categories:readonly string[];
 selections:Readonly<Record<string,string>>;revealed:boolean;
 onSelect:(id:string,category:string)=>void;onCheck:()=>void;
 emptyLabel?:string;checkLabel?:string;
};
export function CardSortBoard({
 idPrefix,title,cards,categories,selections,revealed,onSelect,onCheck,
 emptyLabel='Choose a category',checkLabel='Check card categories and read explanations'
}:CardSortBoardProps){
 const selected=cards.filter(card=>categories.includes(selections[card.id]??''));
 return <section className="wcv2-card" data-learning-interaction="CardSortBoard" aria-label={title}>
  <h3>{title}</h3>
  <p className="muted">Choose a category for each card using the menu. Keyboard and touch both work.
   The board below shows <strong>your choices</strong>, not the correct categories.</p>
  {cards.map(card=><div className="field" key={card.id}>
   <label htmlFor={idPrefix+card.id}><strong>{card.id} · {card.text}</strong></label>
   <select id={idPrefix+card.id} value={selections[card.id]??''}
    onChange={event=>onSelect(card.id,event.target.value)}>
    <option value="">{emptyLabel}</option>
    {categories.map(category=><option value={category} key={category}>{category}</option>)}
   </select>
   {revealed&&<p className="muted" role="status">
    {selections[card.id]===card.key?'Direct label correct. ':'Review the primary label. '}
    {card.rationale} (Key: {card.key})
   </p>}
  </div>)}
  <details className="wcv2-card" data-learning-interaction-preview="CardSortBoard">
   <summary>My category board · {selected.length}/{cards.length} placed</summary>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))',gap:'0.75rem'}}>
    {categories.map(category=><section className="wcv2-card" key={category}>
     <h4>{category}</h4>
     <ul>
      {cards.filter(card=>selections[card.id]===category).map(card=><li key={card.id}>
       <strong>{card.id}.</strong> {card.text}
      </li>)}
     </ul>
     {!cards.some(card=>selections[card.id]===category)&&<p className="muted">No cards placed here yet.</p>}
    </section>)}
   </div>
   <p className="muted">Grouping is an unscored planning aid. It does not reveal correct answers.</p>
  </details>
  <button type="button" className="secondary-button" onClick={onCheck}>{checkLabel}</button>
  <p className="muted">Only the fixed reviewed categories have answer keys. Original explanations are not automatically graded.</p>
 </section>;
}
export type ResponsePlannerProps={
 id:string;title:string;fields:readonly PlannerField[];
 values:Readonly<Record<string,string>>;onChange:(key:string,value:string)=>void;
};
export function ResponsePlanner({id,title,fields,values,onChange}:ResponsePlannerProps){
 const count=fields.filter(field=>(values[field.key]??'').trim().length>0).length;
 return <section className="wcv2-card" data-learning-interaction="ResponsePlanner" aria-label={title}>
  <h3>{title}</h3>
  <p className="muted">Build your response in stages. These are your words, not a generated answer.</p>
  <ol>
   {fields.map(field=><li key={field.key}>
    <label className="field" htmlFor={id+'-'+field.key}>
     <strong>{field.label}</strong>{field.help&&<span>{field.help}</span>}
     <textarea id={id+'-'+field.key} name={id+'-'+field.key}
      rows={2} maxLength={1500} value={values[field.key]??''}
      onChange={event=>onChange(field.key,event.target.value)}
      placeholder="Write your own words, not the example answer..."/>
    </label>
   </li>)}
  </ol>
  <details className="wcv2-card" data-learning-interaction-preview="ResponsePlanner">
   <summary>Preview my response plan · {count}/{fields.length} parts filled</summary>
   <ol>{fields.map(field=><li key={field.key}>
    <strong>{field.label}:</strong> <span style={{whiteSpace:'pre-wrap'}}>{values[field.key]?.trim()||'Not written yet'}</span>
   </li>)}</ol>
   <p className="muted">The count checks field presence only. It does not judge meaning, grammar or quality.</p>
  </details>
 </section>;
}
