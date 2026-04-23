import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../components/common/PageTemplate";
import { listPublicArticles, type PublicArticleListItem } from "../../services/publicArticleService";
import type { ArticleCategoryEnum } from "../../services/articleService";

const PRIMARY = '#46a5fd';

const CATEGORY_BADGE_COLOR: Record<ArticleCategoryEnum, string> = {
    SENIOR:  '#1e293b',
    JUNIOR:  '#46a5fd',
    MLODZIK: '#22c55e',
    ORLIK:   '#f97316',
    ZAK:     '#eab308',
    GIRLS:   '#ec4899',
};

const CATEGORY_LABEL: Record<ArticleCategoryEnum, string> = {
    SENIOR:  'Seniorzy',
    JUNIOR:  'Junior',
    MLODZIK: 'Młodzik',
    ORLIK:   'Orlik',
    ZAK:     'Żak',
    GIRLS:   'Girls Teams',
};

type FilterKey = 'all' | ArticleCategoryEnum;

const FILTERS: { id: FilterKey; label: string }[] = [
    { id: 'all',     label: 'Wszystkie' },
    { id: 'SENIOR',  label: 'Seniorzy' },
    { id: 'JUNIOR',  label: 'Junior' },
    { id: 'MLODZIK', label: 'Młodzik' },
    { id: 'ORLIK',   label: 'Orlik' },
    { id: 'ZAK',     label: 'Żak' },
    { id: 'GIRLS',   label: 'Girls Teams' },
];

const PAGE_SIZE = 9;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

const POLISH_MAP: Record<string, string> = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, c => POLISH_MAP[c] ?? c)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

// ── Sub-components ────────────────────────────────────────────────────────────

const FeaturedCard = ({ article }: { article: PublicArticleListItem }) => {
    const [btnHovered, setBtnHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap',
            backgroundColor: '#fff', borderRadius: '0.75rem', overflow: 'hidden',
            border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            marginBottom: '3rem',
        }}>
            <div style={{
                flex: '0 0 60%', minWidth: 280, minHeight: 280,
                backgroundImage: article.image ? `url('${article.image}')` : undefined,
                background: article.image ? undefined : '#f1f3fb',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {!article.image && (
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>image</span>
                )}
            </div>
            <div style={{ flex: 1, minWidth: 260, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem',
                    borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', backgroundColor: `rgba(70,165,253,0.1)`, color: PRIMARY, width: 'fit-content',
                }}>
                    {CATEGORY_LABEL[article.category]}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                    {article.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>{formatDate(article.date)}</p>
                <p style={{ color: '#475569', lineHeight: 1.75, margin: 0 }}>{article.shortPreview}</p>
                <button
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    onClick={() => navigate(`/news/${slugify(article.title)}`, { state: { articleId: article.articleId } })}
                    style={{
                        marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                        width: 'fit-content', padding: '0.625rem 1.5rem',
                        backgroundColor: btnHovered ? 'rgba(70,165,253,0.85)' : PRIMARY,
                        color: '#fff', fontSize: '0.875rem', fontWeight: 600,
                        border: 'none', borderRadius: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s',
                    }}
                >
                    Czytaj więcej
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

const NewsCard = ({ article }: { article: PublicArticleListItem }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/news/${slugify(article.title)}`, { state: { articleId: article.articleId } })}
            style={{
                display: 'flex', flexDirection: 'column', backgroundColor: '#fff',
                borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0',
                boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s', cursor: 'pointer',
            }}
        >
            <div style={{ height: 192, overflow: 'hidden', position: 'relative', background: '#f1f3fb' }}>
                {article.image ? (
                    <div style={{
                        width: '100%', height: '100%',
                        backgroundImage: `url('${article.image}')`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.4s ease',
                    }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>image</span>
                    </div>
                )}
                <div style={{ position: 'absolute', top: 0, left: 0, padding: '1rem' }}>
                    <span style={{
                        backgroundColor: CATEGORY_BADGE_COLOR[article.category],
                        color: '#fff', fontSize: '0.625rem', fontWeight: 700,
                        textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '0.25rem',
                    }}>
                        {CATEGORY_LABEL[article.category]}
                    </span>
                </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>{formatDate(article.date)}</p>
                <h3 style={{
                    fontSize: '1.125rem', fontWeight: 700,
                    color: hovered ? PRIMARY : '#0f172a',
                    margin: '0 0 0.5rem', lineHeight: 1.35, transition: 'color 0.2s',
                }}>
                    {article.title}
                </h3>
                <p style={{
                    fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                    {article.shortPreview}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', color: PRIMARY, fontSize: '0.875rem', fontWeight: 700 }}>
                    Czytaj dalej
                    <span className="material-symbols-outlined" style={{ fontSize: 16, marginLeft: 4 }}>chevron_right</span>
                </div>
            </div>
        </article>
    );
};

const PaginationButton = ({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '0.5rem', border: active ? 'none' : '1px solid #e2e8f0',
                backgroundColor: active ? PRIMARY : hovered ? `rgba(70,165,253,0.05)` : '#fff',
                color: active ? '#fff' : hovered ? PRIMARY : '#475569',
                fontWeight: active ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s',
            }}
        >
            {children}
        </button>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const NewsPage = () => {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
    const [page,         setPage]         = useState(1);
    const [articles,     setArticles]     = useState<PublicArticleListItem[]>([]);
    const [total,        setTotal]        = useState(0);
    const [loading,      setLoading]      = useState(false);

    useEffect(() => {
        setLoading(true);
        listPublicArticles(page, PAGE_SIZE, activeFilter !== 'all' ? activeFilter : undefined)
            .then(({ data, count }) => { setArticles(data); setTotal(Number(count)); })
            .catch(() => { setArticles([]); setTotal(0); })
            .finally(() => setLoading(false));
    }, [page, activeFilter]);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const featured   = articles[0];
    const grid       = articles.slice(1);

    return (
        <PageTemplate>
            <div style={{ width: '100%', maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: "'Lexend', sans-serif", boxSizing: 'border-box' }}>

                {/* Title */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
                        Aktualności
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#475569', margin: 0, maxWidth: '42rem' }}>
                        Najnowsze informacje, wydarzenia oraz relacje z życia akademii Kotan Ozorków.
                    </p>
                </div>

                {/* Featured */}
                {!loading && featured && <FeaturedCard article={featured} />}

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    {FILTERS.map(({ id, label }) => {
                        const isActive = activeFilter === id;
                        return (
                            <button
                                key={id}
                                onClick={() => { setActiveFilter(id); setPage(1); }}
                                style={{
                                    padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem',
                                    fontWeight: 600, cursor: 'pointer',
                                    border: isActive ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: isActive ? PRIMARY : '#fff',
                                    color: isActive ? '#fff' : '#475569',
                                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                        Ładowanie…
                    </div>
                ) : grid.length === 0 && !featured ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                        Brak artykułów
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {grid.map(article => (
                            <NewsCard key={article.articleId} article={article} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav style={{ marginTop: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <PaginationButton onClick={() => setPage(p => Math.max(1, p - 1))}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                        </PaginationButton>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <PaginationButton key={p} active={page === p} onClick={() => setPage(p)}>{p}</PaginationButton>
                        ))}
                        <PaginationButton onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                        </PaginationButton>
                    </nav>
                )}
            </div>
        </PageTemplate>
    );
};

export default NewsPage;
