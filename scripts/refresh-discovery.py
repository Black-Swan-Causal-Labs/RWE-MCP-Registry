"""Read-only, resumable discovery. Raw responses stay in ignored outputs/."""
import concurrent.futures, datetime, hashlib, json, pathlib, subprocess, time, urllib.parse

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATE = '2026-10-12'
SINCE = '2026-09-07T00:00:00Z'
OUT = ROOT / 'outputs' / f'{DATE}-discovery'
OUT.mkdir(parents=True, exist_ok=True)
TERMS = ['real-world evidence', 'real world data', 'HEOR', 'health economics',
         'epidemiology', 'pharmacovigilance', 'FAERS', 'openFDA', 'OMOP', 'OHDSI',
         'FHIR', 'HL7', 'SNOMED', 'RxNorm', 'LOINC', 'clinical trial', 'PubMed',
         'systematic review', 'meta-analysis', 'evidence synthesis', 'causal inference',
         'target trial', 'propensity score', 'survival analysis', 'record linkage',
         'patient cohort', 'public health', 'NHANES', 'CDC WONDER', 'CDISC',
         'cost effectiveness', 'patient reported outcomes']

def write(p, obj):
    p.write_text(json.dumps(obj, indent=2) + '\n')

def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def fetch(url, github=False):
    for attempt in range(3):
        if github:
            cmd = ['gh', 'api', url]
        else:
            cmd = ['curl', '-fLsS', '--connect-timeout', '12', '--max-time', '40', url]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0:
            try: return json.loads(r.stdout)
            except json.JSONDecodeError: pass
        if attempt < 2: time.sleep(3 * (attempt + 1))
    raise RuntimeError(r.stderr[:500] or 'Response was not JSON')

def official():
    p = OUT / 'official.json'
    log = json.loads(p.read_text()) if p.exists() else {'source': 'Official MCP Registry', 'startedAt': now(), 'pages': [], 'items': [], 'status': 'running'}
    if log['status'] == 'complete': return
    cursor = log.get('nextCursor')
    seen = {x.get('nextCursor') for x in log['pages']}
    try:
        while True:
            params = {'limit': 100, 'version': 'latest', 'updated_since': SINCE}
            if cursor: params['cursor'] = cursor
            url = 'https://registry.modelcontextprotocol.io/v0.1/servers?' + urllib.parse.urlencode(params)
            d = fetch(url)
            cursor = d.get('metadata', {}).get('nextCursor')
            log['items'].extend(d.get('servers', []))
            log['pages'].append({'url': url, 'retrievedAt': now(), 'returned': len(d.get('servers', [])), 'nextCursor': cursor})
            log['nextCursor'] = cursor
            write(p, log)
            if not cursor: break
            if cursor in seen: raise RuntimeError('Repeated pagination cursor')
            seen.add(cursor)
            if len(log['pages']) % 10 == 0: print('Official pages', len(log['pages']), flush=True)
        log['status'] = 'complete'
    except Exception as e: log.update(status='error', error=str(e))
    log['finishedAt'] = now(); write(p, log)
    print('Official', log['status'], len(log['items']), flush=True)

def github():
    for i, term in enumerate(TERMS):
        # Current corpus: no September creation-date cutoff. Date overlap catches changed older projects.
        for tech in ['mcp', 'skill']:
            q = f'{tech} "{term}" in:name,description,topics pushed:>=2026-09-07 fork:false is:public'
            p = OUT / f'github-{i:02}-{tech}.json'
            if p.exists():
                prior=json.loads(p.read_text())
                if prior['status']=='complete' and prior['query']==q: continue
                if prior.get('query')!=q: write(p.with_suffix('.prior.json'),prior)
            log = {'source': 'GitHub repositories', 'query': q, 'startedAt': now(), 'pages': [], 'items': [], 'status': 'running'}
            try:
                for page in range(1, 11):
                    time.sleep(2.2)
                    url = 'search/repositories?' + urllib.parse.urlencode({'q': q, 'per_page': 100, 'page': page})
                    d = fetch(url, github=True)
                    items = d.get('items', [])
                    log['items'].extend({k: x.get(k) for k in ['full_name', 'html_url', 'description', 'topics', 'archived', 'fork', 'created_at', 'pushed_at', 'default_branch']} for x in items)
                    log['pages'].append({'url': 'https://api.github.com/' + url, 'retrievedAt': now(), 'total': d.get('total_count'), 'returned': len(items), 'incompleteResults': d.get('incomplete_results')})
                    if len(items) < 100: break
                log['status'] = 'incomplete' if any(x['incompleteResults'] for x in log['pages']) or len(items) == 100 else 'complete'
            except Exception as e: log.update(status='error', error=str(e))
            log['finishedAt'] = now(); write(p, log)
        print('GitHub term', i + 1, term, flush=True)

def smithery_one(pair):
    i, term = pair
    p = OUT / f'smithery-{i:02}.json'
    if p.exists() and json.loads(p.read_text())['status'] == 'complete': return
    log = {'source': 'Smithery', 'query': term, 'startedAt': now(), 'pages': [], 'items': [], 'status': 'running'}
    try:
        for page in range(1, 101):
            url = 'https://api.smithery.ai/servers?' + urllib.parse.urlencode({'q': term, 'pageSize': 100, 'page': page})
            d = fetch(url)
            items = d.get('servers', [])
            log['items'].extend(items)
            log['pages'].append({'url': url, 'retrievedAt': now(), 'returned': len(items), 'pagination': d.get('pagination')})
            if len(items) < 100 and page >= d.get('pagination', {}).get('totalPages', 1): break
        log['status'] = 'incomplete' if page == 100 else 'complete'
    except Exception as e: log.update(status='error', error=str(e))
    log['finishedAt'] = now(); write(p, log)
    print('Smithery', term, log['status'], len(log['items']), flush=True)

if __name__ == '__main__':
    write(OUT / 'plan.json', {'runDate': DATE, 'startedAt': now(), 'baseline': '2026-09-08', 'overlapSince': SINCE, 'terms': TERMS, 'github': '32 concepts × MCP/skill signals; name, description, topics; pushed since overlap; terminal pages, 1000-result cap reported', 'official': 'All latest-version updates since overlap, including deletions; terminal cursor required', 'smithery': '32 current vocabulary queries with terminal pagination', 'boundary': 'Current Core relevance rules. Indexed-directory searches and primary-source dispositions logged separately. No saturation claim; no installation or runtime tests.'})
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        jobs = [pool.submit(official), pool.submit(github)]
        jobs.extend(pool.submit(smithery_one, pair) for pair in enumerate(TERMS))
        for job in concurrent.futures.as_completed(jobs): job.result()
