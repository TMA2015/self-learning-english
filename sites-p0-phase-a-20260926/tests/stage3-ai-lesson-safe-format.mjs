import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseTutorMarkdown,splitTutorBold} from '../app/english-ai-markdown.ts';
import {tutorQuestionLanguage} from '../infrastructure/browser/tutor-question-language.ts';
assert.deepEqual(parseTutorMarkdown('First **idea**\nSecond line\n\n- One\n- Two\n\n1. Step one\n2. Step two'),[
  {kind:'paragraph',lines:['First **idea**','Second line']},
  {kind:'list',ordered:false,items:['One','Two']},
  {kind:'list',ordered:true,items:['Step one','Step two']},
]);
assert.deepEqual(splitTutorBold('Safe **bold** <img src=x onerror=alert(1)>'),[
  {text:'Safe ',bold:false},{text:'bold',bold:true},{text:' <img src=x onerror=alert(1)>',bold:false},
]);
assert.equal(tutorQuestionLanguage('Giải thích ngữ pháp này cho em'),'vi');
assert.equal(tutorQuestionLanguage('giai thich cau nay giup em'),'vi');
assert.equal(tutorQuestionLanguage('Tai sao dung thi hien tai?'),'vi');
assert.equal(tutorQuestionLanguage('Why do we use the present simple?'),'en');
const tutor=readFileSync(new URL('../app/english-lesson-tutor.tsx',import.meta.url),'utf8');
const bridge=readFileSync(new URL('../infrastructure/browser/firebase-ai-browser.ts',import.meta.url),'utf8');
assert(tutor.includes('parseTutorMarkdown(answer)'));
assert(tutor.includes('splitTutorBold(text)'));
assert(!tutor.includes('<p>{answer}</p>'));
assert(!tutor.includes('innerHTML'));
assert(bridge.includes('tutorQuestionLanguage(question)'));
assert(bridge.includes('Vietnamese explanation'));
assert(bridge.includes('English examples'));
assert(bridge.includes('maxOutputTokens:850'));
console.log('PASS: safe AI text formatting, list/bold parsing and VI/EN question routing (static integration; no live Gemini/browser).');
