"""Reconcile discovery metadata and retain primary documentation for human review."""
import base64, concurrent.futures, importlib.util, json, re, subprocess
spec = importlib.util.spec_from_file_location('discovery', __file__.replace('prepare-refresh-review.py', 'refresh-discovery.py'))
d = importlib.util.module_from_spec(spec); spec.loader.exec_module(d)
p = d.OUT
if not (p/'baseline-urls.json').exists():
    rows=[]
    for name in ['approved-expansion.json','approved-expansion-2.json','reviewed-webmcp.json','reviewed-expansion-2026-09-07.json','reviewed-search-completion-2026-09-07.json']:
        rows.extend(json.loads((d.ROOT/'data'/name).read_text()))
    # These are registry source literals, not code from discovered candidates.
    source=(d.ROOT/'app/registry-explorer.tsx').read_text()
    literal=re.search(r'const originalCards = (\[[\s\S]*?\n\]);',source).group(1)
    rows.extend({'url':u,'name':u} for u in re.findall(r'url:\s*"([^"]+)"',literal))
    d.write(p/'baseline-urls.json',{x['url'].lower().rstrip('/'):x for x in rows})
baseline = json.loads((p / 'baseline-urls.json').read_text())
def canonical(u):
    m = re.match(r'https?://github.com/([^/]+/[^/#?]+)', u, re.I)
    return ('https://github.com/' + m[1] if m else u).lower().rstrip('/').removesuffix('.git')
known = {canonical(u) for u in baseline}
health = re.compile(r'pubmed|fhir|omop|ohdsi|heor\b|faers|openfda|pharmacovigilance|epidemiolog|clinical.trial|systematic.review|meta.analysis|causal.inference|nhanes|rxnorm|snomed|loinc|real.world.evidence|health.economic|public.health|survival.analysis|patient.cohort|cdisc|propensity.score|record.linkage', re.I)
technology = re.compile(r'\bmcp\b|fastmcp|model.context.protocol|agent.skill|claude.skill|codex.skill|claude.code|skill\.md|\bskills?\b.*(?:agent|claude|codex)', re.I)
candidate = {}
observations = []
def add(url, name, description, source):
    u = canonical(url)
    row = {'url':u, 'name':name, 'description':description or '', 'discoverySources':[source]}
    text = name+' '+(description or '')
    if u in known:
        row['disposition'] = 'Existing canonical source; no new-record claim'
    elif not health.search(text) or not technology.search(text):
        row['disposition'] = 'Metadata screen: insufficient combined health/method and agent/MCP signals'
    elif not u.startswith('https://github.com/'):
        row['disposition'] = 'Hosted/listing candidate: primary identity requires follow-up'
        candidate[u] = row
    else:
        row['disposition'] = 'Primary review required'
        if u in candidate: candidate[u]['discoverySources'].append(source)
        else: candidate[u] = row
    observations.append(row)

for f in sorted(p.glob('github-*.json')):
    if f.name == 'github-new.json' or '.prior.' in f.name: continue
    for x in json.loads(f.read_text()).get('items',[]): add(x['html_url'], x['full_name'], x['description'], f.name)
f=p/'official.json'
if f.exists():
    for x in json.loads(f.read_text())['items']:
        s=x['server']; name=s['name']; description=s.get('description','')
        if health.search(name+' '+description):
            add(s.get('repository',{}).get('url') or (s.get('remotes') or [{}])[0].get('url') or 'https://registry.modelcontextprotocol.io/?search='+name, name+' MCP', description, 'official.json')
for f in sorted(p.glob('smithery-*.json')):
    for x in json.loads(f.read_text()).get('items',[]):
        text=x.get('displayName','')+' '+x.get('description','')
        if health.search(text): add(x.get('homepage') or 'https://smithery.ai/server/'+x['qualifiedName'], x.get('displayName','')+' MCP', x.get('description',''), f.name)
# Explicit leads from retained indexed directory results; source identity is checked at primary review.
leads = ['lin-penglin/heor-mcp', 'lin-penglin/heorkit', 'SaeMind/mcp-server-for-cms-healthcare-data-tools',
         'nickjlamb/pubcrawl', 'Anubhab36/healthcare-research-mcp', 'pkotecha-eng/aria-mcp-server',
         'thaohienhomes/pho-research-tools', 'Alemusica/vaglio-mcp', 'SVerITG/Metis_PH', 'thehealthai/constat-mcp', 'Bigred97/aihw-mcp', 'rdmgator12/awesome-healthcare-mcp-servers', 'heidihelena/sourcevahti']
for slug in leads: add('https://github.com/'+slug, slug+' MCP', 'Clinical trial and PubMed research lead; primary review required', 'indexed-directory')
d.write(p/'metadata-dispositions.json', observations)
d.write(p/'primary-review-queue.json', list(candidate.values()))
def review(row):
    if not row['url'].startswith('https://github.com/'): return
    slug=row['url'].removeprefix('https://github.com/')
    f=p/'primary'/ (slug.replace('/','__')+'.json');f.parent.mkdir(exist_ok=True)
    if f.exists(): return
    result={'url':row['url'],'retrievedAt':d.now()}
    try:
        repo=d.fetch('repos/'+slug,github=True)
        rd=d.fetch('repos/'+repo['full_name']+'/readme',github=True)
        result.update(repository={k:repo.get(k) for k in ['full_name','html_url','private','archived','disabled','pushed_at','created_at','default_branch','license','description']},path=rd['path'],gitBlobSHA=rd['sha'],sourceURL=rd['html_url'],text=base64.b64decode(rd['content']).decode('utf-8',errors='replace'),status='retrieved')
    except Exception as e: result.update(status='error',error=str(e))
    d.write(f,result)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: list(pool.map(review,candidate.values()))
print(json.dumps({'observations':len(observations),'newPrimaryCandidates':len(candidate),'primaryDocuments':len(list((p/'primary').glob('*.json')))}))
