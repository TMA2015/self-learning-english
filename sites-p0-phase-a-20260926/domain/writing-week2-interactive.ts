/**
 * Week 2 interactive view helpers.
 * The four existing WeekWork.fields remain canonical; no alternate saved state.
 * Never parse/rewrite complex historical text automatically.
 */
export type IdeaLines = {safe: true; lines: string[]} | {safe: false; lines: string[]};

export function readIdeaLines(raw: string): IdeaLines {
  if (raw === '') return {safe: true, lines: []};
  const lines = raw.split('\n');
  if (
    raw.includes('\r') ||
    lines.some(line => !line || line !== line.trim() || line.includes('\t'))
  ) return {safe: false, lines: []};
  return {safe: true, lines};
}

function safeLines(raw: string): string[] {
  const parsed = readIdeaLines(raw);
  if (!parsed.safe) throw new Error('Keep complex or legacy notes in the original text field.');
  return parsed.lines;
}
function safeNote(value: string): string {
  if (value !== value.trim() || !value || /[\r\n]/.test(value)) {
    throw new Error('Enter one non-empty idea per card. For multiline notes, use the original text field.');
  }
  return value;
}
export function addWeek2Idea(raw: string, idea: string): string {
  const text = safeNote(idea.trim());
  // Appends without touching any existing character in old drafts, even when complex.
  return raw === '' ? text : raw + (raw.endsWith('\n') ? '' : '\n') + text;
}
export function editWeek2Idea(raw: string, index: number, idea: string): string {
  const lines = safeLines(raw);
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) throw new Error('Invalid idea.');
  lines[index] = safeNote(idea.trim());
  return lines.join('\n');
}
export function removeWeek2Idea(raw: string, index: number): string {
  const lines = safeLines(raw);
  if (!Number.isInteger(index) || index < 0 || index >= lines.length) throw new Error('Invalid idea.');
  lines.splice(index, 1);
  return lines.join('\n');
}
export function moveWeek2Idea(raw: string, index: number, delta: -1 | 1): string {
  const lines = safeLines(raw);
  const next = index + delta;
  if (!Number.isInteger(index) || index < 0 || index >= lines.length || next < 0 || next >= lines.length) {
    throw new Error('This idea cannot move further.');
  }
  [lines[index], lines[next]] = [lines[next], lines[index]];
  return lines.join('\n');
}
