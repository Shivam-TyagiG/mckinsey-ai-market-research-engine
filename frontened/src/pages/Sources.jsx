import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, RefreshCw, Search } from "lucide-react";
import Shell from "../components/Shell";
import { api } from "../api/client";

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSources = async () => {
    setLoading(true);
    try {
      const { jobs = [] } = await api.listResearch();
      const results = await Promise.all(jobs.map(async (job) => {
        try {
          const [sourceData, evidenceData] = await Promise.all([api.getSources(job.id), api.getEvidence(job.id)]);
          const evidenceBySource = (evidenceData.evidence || []).reduce((map, item) => { map[item.source_id] = [...(map[item.source_id] || []), item]; return map; }, {});
          return (sourceData.sources || []).map((source) => ({ ...source, brief: job.brief, claims: evidenceBySource[source.id] || [] }));
        } catch { return []; }
      }));
      setSources(results.flat());
      setError("");
    } catch (err) { setError(err.message || "Unable to load sources."); }
    finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadSources(); }, []);
  const filtered = sources.filter((source) => `${source.title} ${source.url} ${source.brief} ${source.claims.map((claim) => claim.claim).join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  return <Shell><div className="mx-auto max-w-6xl px-6 pb-24 pt-12"><div className="flex flex-col justify-between gap-5 border-b border-line pb-8 sm:flex-row sm:items-end"><div><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Evidence library</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Sources & library</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">Browse the sources and claims collected across your completed engagements.</p></div><button onClick={loadSources} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-3.5 py-2.5 text-sm font-medium text-ink-soft hover:border-ink/30 hover:text-ink"><RefreshCw size={15} /> Refresh</button></div><div className="mt-7 flex max-w-md items-center gap-2 rounded-md border border-line bg-paper px-3 py-2.5"><Search size={16} className="text-ink-muted" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sources or claims" className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted" /></div>{error && <p className="mt-6 rounded-md border border-bad/20 bg-bad/5 px-4 py-3 text-sm text-bad">{error}</p>}<div className="mt-6 grid gap-4 md:grid-cols-2">{loading ? <div className="col-span-full px-5 py-12 text-center text-sm text-ink-muted">Loading your evidence library...</div> : filtered.length === 0 ? <div className="col-span-full rounded-lg border border-dashed border-line px-5 py-12 text-center"><BookOpen className="mx-auto text-ink-muted" size={26} /><p className="mt-3 text-sm text-ink-muted">No sources found yet. Run a research engagement to populate this library.</p></div> : filtered.map((source) => <article key={`${source.id}-${source.job_id}`} className="rounded-lg border border-line bg-paper p-5"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface text-gold"><BookOpen size={16} /></span><div className="min-w-0"><h2 className="truncate text-sm font-semibold text-ink">{source.title || "Untitled source"}</h2><p className="mt-1 truncate text-xs text-ink-muted">{source.url}</p></div></div><a href={source.url} target="_blank" rel="noreferrer" aria-label="Open source" className="shrink-0 text-ink-muted hover:text-ink"><ExternalLink size={15} /></a></div><p className="mt-4 line-clamp-2 text-xs leading-relaxed text-ink-muted">{source.brief}</p>{source.claims.length > 0 && <div className="mt-4 border-t border-line pt-3"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">Claims captured · {source.claims.length}</p><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{source.claims[0].claim}</p></div>}</article>)}</div></div></Shell>;
}
