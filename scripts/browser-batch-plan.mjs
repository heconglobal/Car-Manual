// Derive every batch from Playwright's actual inventory, including new files.
export function planBrowserBatches(required, passedIds = new Set(), limit = 2) {
 if (!Number.isSafeInteger(limit) || limit < 1) throw Error('Batch size must be a positive integer');
 if (new Set(required.map(s => s.id)).size !== required.length) throw Error('Duplicate inventory IDs');
 const byFile = new Map();
 for (const spec of required) {
  if (passedIds.has(spec.id)) continue;
  if (!byFile.has(spec.file)) byFile.set(spec.file, []);
  byFile.get(spec.file).push(spec);
 }
 const batches = [];
 for (const [file, pending] of byFile) {
  for (let i = 0; i < pending.length; i += limit) {
   const selected = pending.slice(i, i + limit);
   // Playwright matches the full file/suite/title string; anchor only its end.
   const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   const grep = '(?:' + selected.map(s => escape(s.title)).join('|') + ')$';
   const matched = required.filter(s => s.file === file && new RegExp(grep).test(s.title));
   if (matched.length !== selected.length || matched.some(s => !selected.some(p => p.id === s.id))) {
    throw Error('Ambiguous test titles in ' + file + '; use distinct titles before batching');
   }
   batches.push({name: file + ':' + (i / limit + 1), ids: selected.map(s => s.id), args: ['tests/' + file, '--grep', grep]});
  }
 }
 return batches;
}
