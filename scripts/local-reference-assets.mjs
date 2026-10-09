// Deliberate publication allowlist: project-authored notes only. Original
// manuals, catalog scans, owner photos and other-year research stay local.
export const localReferenceAssets=Object.freeze([
 'references/interior-i1-reconstruction.md',
 'references/body-r12-exterior-reassessment.md',
 'references/body-r11-pillars-rear-profile.md',
]);

export function localSourceAssetPath(url){
 if(typeof url!=='string'||!url.startsWith('/'))return null;
 if(url.startsWith('//'))return null;
 const path=decodeURIComponent(url.split(/[?#]/)[0]).slice(1);
 if(path.split('/').includes('..')||path.includes('\\'))throw Error('Unsafe local source URL: '+url);
 return path;
}

export function assertPublishableReference(path){
 if(!localReferenceAssets.includes(path)||!/^references\/[A-Za-z0-9_/-]+\.(md|csv)$/.test(path))throw Error('Local reference is not approved for publication: '+path);
 return path;
}
