/** Deterministic routing for short learner questions.
 * This only selects the instructional response language, never a grade.
 * Ambiguous questions default to English; learners may ask again in another language.
 */
export type TutorQuestionLanguage='vi'|'en';

export function detectTutorQuestionLanguage(question:string):TutorQuestionLanguage{
 const raw=question.trim();
 // English question openings take precedence over quoted Vietnamese examples.
 if(/^(what|why|how|when|where|which|who|whose|can you|could you|would you|please explain|please give|explain|tell me|give me|is it|does|do |should |i |i'm |i don't|we )\b/i.test(raw))return 'en';
 const normalized=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/\s+/g,' ');
 // High-confidence Vietnamese script and question patterns.
 if(/[ăâđêôơưàáảãạèéẻẽẹìíỉĩịòóỏõọùúủũụỳýỷỹỵ]/i.test(raw))return 'vi';
 if(/\b(giai thich|tai sao|vi sao|nghia la gi|co nghia|la gi|cho (em|toi|minh) (mot )?vi du|lam the nao|lam sao|cach (dung|su dung|hoc)|khi nao|o dau|cau nay|tu nay|bai nay|em khong hieu|minh khong hieu|toi khong hieu|giup (em|toi|minh)|hay giai thich|nhu the nao|co the (giai thich|cho))\b/.test(normalized))return 'vi';
 return 'en';
}
