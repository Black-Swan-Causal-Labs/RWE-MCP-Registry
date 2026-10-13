"""Publish only explicitly adjudicated refresh cards; retain historical data unchanged."""
import collections, hashlib, importlib.util, json, pathlib, re, shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'outputs/2026-10-12-discovery'
def read(p): return json.loads(p.read_text())
def write(p,v): p.write_text(json.dumps(v,indent=2,ensure_ascii=False)+'\n')
baseline=read(OUT/'baseline-urls.json')
history=read(ROOT/'data/historical-relevance.json')
old=read(ROOT/'data/reviewed-search-completion-2026-09-07.json')
existing_ids={*history,*[x['id'] for x in old]}
next_id=max(int(x.split('-')[1]) for x in existing_ids)+1
editorial=read(ROOT/'data/refresh-editorial-2026-10-12.json')
public_checks={r['url'].lower():r for r in read(OUT/'public-eligibility.json')}
cards=[]
for i,(slug,name,kind,category,summary,limitation) in enumerate(editorial):
    doc=read(OUT/'primary'/(slug.lower().replace('/','__')+'.json'))
    assert doc['status']=='retrieved',slug
    repo=doc['repository'];url=repo['html_url']
    assert public_checks[url.lower()]['public'] and not public_checks[url.lower()]['archived'],slug
    assert url.lower().rstrip('/') not in baseline,slug
    assert not repo['archived'] and not repo['disabled'],slug
    rid=f'RWE-{next_id+i:04}'
    assert rid not in existing_ids
    source=doc['sourceURL'];tags=[category, 'Documentation reviewed']
    rationale=f'{name}: {summary} Inclusion is limited to this documented health-research, evidence-synthesis or specific statistical-method function.'
    cards.append(dict(id=rid,name=name,kind=kind,category=category,summary=summary,tags=tags,
        added='Oct 12, 2026',checked='Oct 12, 2026',status='Static documentation reviewed · scoped capability',runtime='Not independently runtime tested',
        repository=repo['full_name'],website='GitHub',packages='Only the documented components described in this card were reviewed.',workflowFit=[category],
        capabilities=[summary],limitation=limitation+' Static documentation review only; candidate code was not installed or executed.',url=url,
        primarySourceURLs=[source],primaryBlobSHA=doc['gitBlobSHA'],primaryRetrievedAt=doc['retrievedAt'],primaryTextSHA256=hashlib.sha256(doc['text'].encode()).hexdigest(),
        license=(repo.get('license') or {}).get('spdx_id') or 'Not declared',repositoryLastPush=repo.get('pushed_at'),publicSourceVerified=True,publicSourceVerifiedAt=public_checks[url.lower()]['retrievedAt'],
        **({'favorite':True} if repo['full_name'].lower().startswith('black-swan-causal-labs/') else {}),
        relevance=dict(id=rid,decision='Core',rationale=rationale,relevanceBasis=summary,evidenceLevel='fresh-primary',evidenceRefs=[source],reviewGroup='october-discovery-refresh',reviewedAt='2026-10-12')))
assert len({c['url'].lower() for c in cards})==len(cards)
write(ROOT/'data/reviewed-refresh-2026-10-12.json',cards)
# Original campaign and relevance audits remain historical, with their original denominators.
base_summary=read(ROOT/'public-data/relevance-audit-2026-09-08.json')
summary=read(ROOT/'data/relevance-summary.json')
summary.update(asOf='2026-10-12',historicalRelevanceAsOf='2026-09-08',totalReviewed=6227+len(cards),
    counts={'Core':4218+len(cards),'Archive':2008,'Borderline':1},
    evidenceLevels={'published-card':6195,'fresh-primary':24+len(cards),'retained-primary':8},
    basis='September 8 individual relevance audit plus October 12 new-card documentation review. Historical review/check dates are unchanged. No exhaustive inventory, renewed whole-catalogue source audit or runtime validation is claimed.')
write(ROOT/'data/relevance-summary.json',summary)
(ROOT/'public/data/core-catalogue.json').write_text(json.dumps([c for c in old if c['relevance']['decision']=='Core']+cards,separators=(',',':'),ensure_ascii=False))
included={c['url'].lower():c for c in cards}
official_aliases={remote['url'].lower().rstrip('/'):x['server']['repository']['url'].lower().rstrip('/')
    for x in read(OUT/'official.json')['items'] if x['server'].get('repository',{}).get('url')
    for remote in x['server'].get('remotes',[]) if remote.get('url')}
excluded={
 'black-swan-causal-labs/rwe-mcp-registry':'Registry itself; discovery source rather than a research capability.',
 'black-swan-causal-labs/bscl-plugins':'Distribution wrapper for underlying tools; no additional capability record counted.',
 'judyma820314/fhir-pilot-mcp':'Documentation states all FHIR operations are mocks; not retained as functional clinical integration.',
 'frenz242/codex-skills':'Repository management and coding workflows; no qualifying health or specific statistical-method function.',
 'mdperry/us-state-job-portals':'Government employment search; public-health agency names do not establish health-research capability.',
 'metachi334/metachi':'Content-management/education agent; no qualifying data retrieval or analysis method.',
 'Jichen-DOU/Circulating-Cytokines-Thromboembolism-Meta-MR'.lower():'MCP-1 is a cytokine name; this is study code, not a discovered MCP/agent interface.',
 'joehomeskillet/dishboard':'Hospital/cafeteria menu publishing; clinical setting and FHIR naming alone do not establish Core relevance.',
 'api-evangelist/machinelibrary-ai':'Third-party API profile; no demonstrated first-party tool implementation.',
 'gio300/kloudy-open':'Generic connector-discovery interface; FHIR mention does not establish a scoped clinical operation.',
 'pipeworx-io/mcp-veterinary-fda':'Animal-drug and pet-service adapter; no documented human-health evidence workflow in reviewed scope.',
 'lurongshika/meta-research-agent':'Selected documentation explicitly scopes methods to ML, computer science and mathematics, not a qualifying health/statistical component.',
 'yq04/mechanics-agent-skills':'Solid-mechanics research workflow; no reviewed qualifying clinical/statistical component.'}
excluded.update({'jmshinhwa/readystack-themes':'Primary README identifies VS Code themes; no health-research capability.',
    'sadri-dridi/named-mcp-utilities':'Large generic utility listing; registry metadata health-term matches do not identify a reviewed qualifying component.',
    'rdmgator12/awesome-healthcare-mcp-servers':'Curated discovery source, not an additional research tool. Its editorial ratings are not adopted as registry validation.',
    'suggestic/herstack-mcp':'Publisher guidance and single-brand product recommendations. Evidence links alone do not establish a scoped synthesis or statistical workflow.'})
decisions=[]
for row in read(OUT/'primary-review-queue.json'):
    u=row['url'].lower().rstrip('/');slug=u.removeprefix('https://github.com/')
    docpath=OUT/'primary'/(slug.replace('/','__')+'.json')
    doc=read(docpath) if docpath.exists() else {}
    if u in included: disposition='Included';reason=included[u]['relevance']['rationale']
    elif official_aliases.get(u) in baseline: disposition='Existing';reason='Official registry metadata links this endpoint to an already catalogued repository; no separate capability counted and no capability date renewed.'
    elif official_aliases.get(u) in included: disposition='Reconciled';reason='Endpoint belongs to a repository already included in this refresh; no additional capability counted.'
    elif slug in excluded: disposition='Excluded';reason=excluded[slug]
    elif doc.get('status')=='error': disposition='Held';reason='Primary repository/documentation could not be retrieved; identity and implemented scope remain unconfirmed.'
    elif not doc: disposition='Held';reason='Hosted/listing identity needs a first-party documentation and component review; registry metadata is insufficient for inclusion.'
    else: disposition='Held';reason='Documentation retrieved; component-level scope, distinctness or implementation evidence still requires follow-up. Not added to the Core catalogue.'
    decisions.append(dict(url=row['url'],name=row['name'],discoverySources=row['discoverySources'],disposition=disposition,reason=reason,
        **({'sourceURL':doc['sourceURL'],'retrievedAt':doc['retrievedAt'],'gitBlobSHA':doc['gitBlobSHA']} if doc.get('status')=='retrieved' else {})))
query_logs=[]
for f in [f for f in sorted(OUT.glob('github-??-*.json')) if '.prior.' not in f.name]+sorted(OUT.glob('smithery-*.json')):
    j=read(f);query_logs.append({k:j[k] for k in ['source','query','startedAt','finishedAt','status','pages'] if k in j}|{'observations':len(j['items']),**({'error':j['error']} if 'error' in j else {})})
official=read(OUT/'official.json')
assert official['status']=='complete','Complete or explicitly amend official-feed coverage before publication.'
assert all(q['status']=='complete' for q in query_logs),'Unfinished query lane must be resolved before publication.'
audit=dict(runDate='2026-10-12',baselineDate='2026-09-08',overlapSince='2026-09-07T00:00:00Z',
    status='Discovery complete' if official['status']=='complete' else 'Official update-feed retrieval still open',
    publication='Reviewed additions only; held candidates outside catalogue',
    counts={'newCoreCards':len(cards),'coreTotal':4218+len(cards),'candidateDispositions':dict(collections.Counter(x['disposition'] for x in decisions)),
        'githubQueries':64,'smitheryQueries':32,'officialPages':len(official['pages']),'officialUpdateRecords':len(official['items'])},
    official={k:official[k] for k in ['source','startedAt','finishedAt','status','pages'] if k in official},
    queries=query_logs,candidates=decisions,
    metadataScreen={'method':'Automatic combined technology and health/method term screen; not individual capability review','observations':len(read(OUT/'metadata-dispositions.json'))},
    boundaries=['Official feed is latest-version updates since the overlap timestamp, including deletion metadata; it is not a fresh full baseline harvest.',
       'GitHub searches cover public non-fork repositories in name, description and topics for MCP/skill with 32 health/method concepts and pushed since overlap. No new code-search or full README-index search lane was executed.',
       'Smithery uses ranked vocabulary search with terminal pagination; live totals changed during retrieval. Search matching is broad and required local scope screening.',
       'Indexed directory searches are ranked results, not full directory inventories. No claim of exhaustive coverage or two-round saturation.',
       'Historical cards and their capability/relevance dates were not renewed. New records are documentation review only; zero candidate runtimes tested.',
       'Held candidate count is a discovery backlog, separate from the one historical Borderline catalogue record.'])
indexed=[]
for f in sorted(OUT.glob('indexed-*.json')):
    payload=read(f)
    queries=payload.get('queries') if isinstance(payload,dict) else None
    if f.name=='indexed-02.json':
        queries=[{'q':'MCP (FHIR OR "clinical trial" OR PubMed OR "systematic review")','domains':[domain]} for domain in ['glama.ai','pulsemcp.com','mcp.so','mcprepository.com']]
    indexed.append({'queries':queries,'observedURLs':sorted(set(re.findall(r'https://[^\s"<>\\)]+',json.dumps(payload)))), 'method':'Ranked web search results; not a complete directory harvest'})
audit['indexedDirectorySearches']=indexed
audit['prospectivePlan']=read(OUT/'plan.json')
audit['publicSourceChecks']=list(public_checks.values())
audit['counts']['indexedDirectoryQueries']=sum(len(x['queries'] or []) for x in indexed)
curated=read(OUT/'primary/rdmgator12__awesome-healthcare-mcp-servers.json')
audit['curatedDiscoverySource']={k:curated[k] for k in ['url','sourceURL','retrievedAt','gitBlobSHA']}
write(ROOT/'public-data/search-refresh-2026-10-12.json',audit)
shutil.copy2(ROOT/'public-data/search-refresh-2026-10-12.json',ROOT/'public/public-data/search-refresh-2026-10-12.json')
write(ROOT/'data/discovery-summary-2026-10-12.json',{'runDate':audit['runDate'],'status':audit['status'],**audit['counts']})
gh=[j for j in query_logs if j['source']=='GitHub repositories'];sm=[j for j in query_logs if j['source']=='Smithery']
dis=audit['counts']['candidateDispositions']
report=f'''# RWE MCP Registry discovery refresh

October 12, 2026. This is a new discovery wave under the September Core relevance rules. Historical search and relevance audits retain their original dates and denominators.

## Results

**{len(cards)} new Core capability records** were added after static primary-documentation review, bringing the website catalogue from 4,218 to **{4218+len(cards):,}** records. Records span MCP servers, agent skills, components and workflows; these are not counts of unique MCP servers.

The reconciled primary-review queue contains {len(decisions)} candidate identities: {dis.get('Included',0)} included, {dis.get('Excluded',0)} excluded, {dis.get('Held',0)} held for further review, and {dis.get('Existing',0)+dis.get('Reconciled',0)} existing or reconciled identities. Held discovery candidates are outside the catalogue. They are separate from the one historical Borderline record and one historical implementation hold. The 2,008 archived catalogue records remain unchanged.

New IDs run from {cards[0]['id']} to {cards[-1]['id']}. New records retain retrieval timestamps, README blob identifiers, source-text hashes, scoped capabilities and limitations in the maintained JSON. Their source and relevance reviews are dated October 12. Historical cards were not relabelled as newly reviewed.

## Sources actually searched

| Source | Completed retrieval | Boundary |
| --- | --- | --- |
| Official MCP Registry | {len(official['pages'])} pages; {len(official['items']):,} update observations; terminal cursor reached | Latest-version updates since September 7, including deletion metadata. This is a delta feed, not a fresh full baseline harvest. |
| GitHub repositories | {len(gh)} queries; {sum(len(x['pages']) for x in gh)} result pages; {sum(x['observations'] for x in gh):,} overlapping observations | 32 health/method concepts paired with MCP and skill signals in names, descriptions and topics; public non-fork repositories pushed since September 7. All queries reached short/empty terminal pages without reported incomplete results. |
| Smithery | {len(sm)} queries; {sum(len(x['pages']) for x in sm)} pages; {sum(x['observations'] for x in sm):,} overlapping observations | Current ranked vocabulary search, paged to its reported/observed end. Broad matches were screened locally. Live totals changed between requests. |
| Indexed directories | {audit['counts']['indexedDirectoryQueries']} queries across named directories | Ranked indexed results from Glama, PulseMCP, MCP.so, MCP Market, MCP Repository and LobeHub; no full-directory inventory claim. |
| Curated healthcare list | Current README retrieved with blob identity | Awesome Healthcare MCP Servers used as a discovery source; its compliance and clinical ratings are not adopted. |

Queries, page URLs, returned counts and primary-review dispositions are retained in the [structured refresh audit](https://black-swan-causal-labs.github.io/RWE-MCP-Registry/public-data/search-refresh-2026-10-12.json). Search observations overlap across terms, pages and sources; adding them does not produce a count of unique projects.

## Review approach

Automatic metadata screens separated potential health/method tools from unrelated matches. This was not individual source review. Promoted GitHub candidates were reconciled with existing canonical repository URLs and their primary documentation was retained. Only explicitly adjudicated records were published. Unknown identities, insufficient documentation and unresolved component/implementation questions remain held, with reasons in the audit.

Core requires a documented health-research, clinical-data, public-health, evidence-synthesis or specific statistical-method function. Mixed collections are limited to the qualifying function named on each card. Generic productivity, molecular-only uses and possible downstream health applications do not independently qualify. Mock-only FHIR operations, registry self-listings and biological MCP-1 homonyms were excluded in this wave.

The new review examined documentation and repository metadata. It did not inspect all implementation files, install candidate projects or call their tools. Author test counts, compliance statements, model performance and benchmark results are not independent registry validation. Synthetic examples are explicitly labelled; they are not real clinical data.

## Examples of added scope

- Survey-weighted NHANES analysis: [NHANES MCP](https://github.com/Black-Swan-Causal-Labs/nhanes-mcp). This is a Black Swan Causal Labs product and retains the ownership marker.
- Exploratory adverse-event methods: [FAERS MCP](https://github.com/drvvek/faers_mcp), with reporting-bias and non-causality limitations.
- International trial registries: [ANZCTR lookup](https://github.com/pipeworx-io/mcp-anzctr), [CTIS](https://github.com/pipeworx-io/mcp-eu-ctis), [ISRCTN](https://github.com/pipeworx-io/mcp-isrctn) and [ICTRP](https://github.com/pipeworx-io/mcp-who-ictrp), each limited to its named adapter.
- Evidence screening and verification: [TypeSafe screening](https://github.com/masa-med-ai/typesafe-screening-mcp), [Pho Research Tools](https://github.com/thaohienhomes/pho-research-tools) and [Librarian Search](https://github.com/wmyung/librarian-search).
- Standards and measure metadata: [CDISC Library MCP](https://github.com/pendingintent/cdisc-library-mcp-server) and [Open Quality](https://github.com/FHIR-IQ/openquality).

## Remaining coverage limits

This wave reruns bounded discovery; it does not claim exhaustive coverage, the original Cartesian matrix, or two successive no-novelty rounds. {dis.get('Held',0)} candidate identities still need first-party identity, distinctness or component-level follow-up. No new GitHub code-search lane, full README-index matrix, full Docker catalogue audit or whole-catalogue capability re-review was executed. Unchanged older projects without matching metadata or directory results can still be missed. Some hosted endpoints may be aliases of known tools that require further identity reconciliation.

The official update feed is live rather than a transactionally frozen snapshot. Deletions and metadata changes do not by themselves establish the availability of an underlying repository or hosted service. The overlap date reduces boundary omissions but does not prove that every old record has been rechecked.

'''
reportpath=ROOT/'public-data/search-refresh-2026-10-12.md';reportpath.write_text(report.rstrip()+'\n')
shutil.copy2(reportpath,ROOT/'public/public-data'/reportpath.name)
print(json.dumps(audit['counts']))
