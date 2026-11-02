/** Heuristic for the learner's question, not a CEFR or language proficiency test. */
export function tutorQuestionLanguage(question:string):'vi'|'en'{
  const original=question.trim();
  if(/[ăâđêôơưĂÂĐÊÔƠƯ]|[àáạảãèéẹẻẽìíịỉĩòóọỏõùúụủũỳýỵỷỹ]/i.test(original))return 'vi';
  const plain=original.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').trim();
  if(/\b(giai thich|vi sao|tai sao|la gi|nghia la gi|cho vi du|cach dung|cach doc|bai nay|cau nay|tu nay|ngu phap|tieng anh|khong hieu|giup em|giup minh|giup toi)\b/.test(plain))return 'vi';
  return 'en';
}
