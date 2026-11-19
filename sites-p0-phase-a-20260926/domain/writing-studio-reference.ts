/** Writing Studio optional formative reference; never a learner proficiency diagnosis.
 * Academic reference: Council of Europe CEFR Companion volume (2020),
 * Written production and communicative language competence scales.
 * Source: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume-and-its-language-versions
 */
export const CEFR_WRITING_LEVELS=['A1','A2','B1','B2','C1','C2'] as const;
export type CEFRWritingLevel=(typeof CEFR_WRITING_LEVELS)[number];
export const WRITING_STUDIO_CEFR_RUBRIC_VERSION='cefr-written-production-2020-scored-v2' as const;

export type WritingStudioReference=
  |{kind:'general'}
  |{kind:'cefr';level:CEFRWritingLevel};

export const GENERAL_WRITING_REFERENCE:WritingStudioReference={kind:'general'};

export function validCEFRWritingLevel(value:unknown):value is CEFRWritingLevel{
 return typeof value==='string'&&(CEFR_WRITING_LEVELS as readonly string[]).includes(value);
}

export function normalizeWritingStudioReference(value:unknown):WritingStudioReference{
 if(!value||typeof value!=='object'||Array.isArray(value))return GENERAL_WRITING_REFERENCE;
 const item=value as Record<string,unknown>;
 return item.kind==='cefr'&&validCEFRWritingLevel(item.level)?{kind:'cefr',level:item.level}:GENERAL_WRITING_REFERENCE;
}

/** Six project-defined criterion IDs. Scores are for the submitted text against the chosen target only. No inferred learner level. */
export const CEFR_WRITING_CRITERIA=[
 {id:'task-response',name:'Task response & purpose'},
 {id:'ideas-and-support',name:'Ideas & support'},
 {id:'organization',name:'Organization & cohesion'},
 {id:'vocabulary',name:'Vocabulary range & precision'},
 {id:'grammar-and-mechanics',name:'Grammar, spelling & punctuation'},
 {id:'register-and-tone',name:'Register & appropriateness'},
] as const;

export type CEFRWritingCriterionId=(typeof CEFR_WRITING_CRITERIA)[number]['id'];
export type CEFRWritingCriterionFeedback={
 criterion:CEFRWritingCriterionId;
 score?:number;
 observation:string;
 evidence:string;
 nextStep:string;
};

export const CEFR_TARGET_GUIDANCE:Record<CEFRWritingLevel,string>={
 A1:'Focus on simple phrases and sentences about familiar, personal topics. Do not require multi-paragraph arguments.',
 A2:'Focus on short, simple connected sentences about everyday needs and familiar activities.',
 B1:'Focus on straightforward connected writing about familiar topics, reasons, experiences and opinions.',
 B2:'Focus on clear, detailed writing, coherent arguments and relevant supporting details when the task requires them.',
 C1:'Focus on well-structured, detailed text, nuanced points and appropriate style for the intended reader.',
 C2:'Focus on lucid, smoothly flowing, sophisticated text with flexible style and effective logical structure.',
};
