import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const report=JSON.parse(await readFile('artifacts/reference-link-audit.json'));
const map=[['Chevrolet_60V6_Power_Manual.pdf','chevrolet-60v6-power.pdf'],['1985-86+Pontiac+Fiero.PDF','1985-86-specifications.pdf'],['1985+Fiero+Owners+Manual.pdf','1985-owners-boomtastic.pdf'],['Illustrations_CD.pdf','fiero-parts-cd.pdf'],['Illustrations_P22.pdf','fiero-22p-parts.pdf'],['1986_Fiero_Service_Manual.pdf','1986-service.pdf'],['1985_Fiero_Do_It_Yourself.pdf','1985-fiero-diy.pdf'],['1985_Fiero_6E3_Emissions_and_Drivability.pdf','1985-fiero-6e3.pdf'],['1985-Pontiac-Fiero-Cdn.pdf','1985-fiero-brochure.pdf']];
const counts=JSON.parse(execFileSync('python3',['-c',`import fitz,json,sys,hashlib,pathlib
r={}
for name in json.loads(sys.argv[1]):
 p=pathlib.Path('references')/name
 with fitz.open(p) as doc:r[name]={'pages':len(doc),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
print(json.dumps(r))`,JSON.stringify(map.map(([,file])=>file))],{encoding:'utf8'}));
const results=[];
for(const r of report.results){const file=map.find(([key])=>r.url.includes(key))?.[1];if(!file)continue;for(const fragment of r.fragments){const m=fragment.match(/^#page=(\d+)$/);if(m)results.push({url:r.url+fragment,file,page:Number(m[1]),pages:counts[file].pages,valid:Number(m[1])>=1&&Number(m[1])<=counts[file].pages});}}
const result={date:new Date().toISOString(),status:results.every(r=>r.valid)?'passed':'failed',pageLinks:results.length,documents:counts,results,limits:'Confirms that linked PDF page numbers exist in the downloaded reference edition; does not verify the content of each cited page or guarantee the remote file remains the same edition.'};
await writeFile('artifacts/reference-page-audit.json',JSON.stringify(result,null,2)+'\n');console.log({status:result.status,pageLinks:result.pageLinks,invalid:results.filter(r=>!r.valid)});if(result.status==='failed')process.exitCode=1;
