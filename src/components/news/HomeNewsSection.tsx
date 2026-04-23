import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listPublicArticles, type PublicArticleListItem } from '../../services/publicArticleService';
import type { ArticleCategoryEnum } from '../../services/articleService';

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

const POLISH_MAP: Record<string, string> = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, c => POLISH_MAP[c] ?? c)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

// ── Featured card ─────────────────────────────────────────────────────────────

const FeaturedCard = ({ article }: { article: PublicArticleListItem }) => {
    const [btnHovered, setBtnHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/news/${slugify(article.title)}`, { state: { articleId: article.articleId } })}
            style={{
                display: 'flex', flexWrap: 'wrap',
                backgroundColor: '#fff', borderRadius: '0.75rem', overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
            }}
        >
            <div style={{
                flex: '0 0 55%', minWidth: 260, minHeight: 260,
                backgroundImage: article.image ? `url('${article.image}')` : undefined,
                background: article.image ? undefined : '#f1f3fb',
                backgroundSize: 'cover', backgroundPosition: 'center',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {!article.image && (
                    <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: '#cbd5e1' }}>image</span>
                )}
            </div>
            <div style={{ flex: 1, minWidth: 240, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0.25rem 0.75rem',
                    borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', backgroundColor: 'rgba(70,165,253,0.1)', color: PRIMARY, width: 'fit-content',
                }}>
                    {CATEGORY_LABEL[article.category]}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                    {article.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>{formatDate(article.date)}</p>
                <p style={{ color: '#475569', lineHeight: 1.75, margin: 0, fontSize: '0.9375rem' }}>{article.shortPreview}</p>
                <button
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    onClick={e => { e.stopPropagation(); navigate(`/news/${slugify(article.title)}`, { state: { articleId: article.articleId } }); }}
                    style={{
                        marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
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

// ── Small card ────────────────────────────────────────────────────────────────

const SmallCard = ({ article }: { article: PublicArticleListItem }) => {
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
            <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: '#f1f3fb' }}>
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
                        <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}>image</span>
                    </div>
                )}
                <div style={{ position: 'absolute', top: 0, left: 0, padding: '0.75rem' }}>
                    <span style={{
                        backgroundColor: CATEGORY_BADGE_COLOR[article.category],
                        color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                        textTransform: 'uppercase', padding: '0.2rem 0.5rem', borderRadius: '0.25rem',
                    }}>
                        {CATEGORY_LABEL[article.category]}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 0.4rem' }}>{formatDate(article.date)}</p>
                <h4 style={{
                    fontSize: '0.9375rem', fontWeight: 700,
                    color: hovered ? PRIMARY : '#0f172a',
                    margin: '0 0 0.4rem', lineHeight: 1.35, transition: 'color 0.2s',
                }}>
                    {article.title}
                </h4>
                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', color: PRIMARY, fontSize: '0.8rem', fontWeight: 700 }}>
                    Czytaj dalej
                    <span className="material-symbols-outlined" style={{ fontSize: 15, marginLeft: 3 }}>chevron_right</span>
                </div>
            </div>
        </article>
    );
};

// ── Section ───────────────────────────────────────────────────────────────────

const HomeNewsSection = () => {
    const navigate = useNavigate();
    const [articles, setArticles] = useState<PublicArticleListItem[]>([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        listPublicArticles(1, 4)
            .then(({ data }) => setArticles(data))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading || articles.length === 0) return null;

    const [featured, ...rest] = articles;

    return (
        <section style={{
            width: '100%', maxWidth: '80rem', margin: '0 auto',
            padding: '3rem 1.5rem', fontFamily: "'Lexend', sans-serif", boxSizing: 'border-box',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem', lineHeight: 1.1 }}>
                        Aktualności
                    </h2>
                    <p style={{ fontSize: '0.9375rem', color: '#64748b', margin: 0 }}>
                        Najnowsze informacje z życia akademii Kotan Ozorków
                    </p>
                </div>
                <button
                    onClick={() => navigate('/news')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        background: 'none', border: `1.5px solid ${PRIMARY}`, borderRadius: '0.5rem',
                        color: PRIMARY, fontSize: '0.875rem', fontWeight: 700,
                        padding: '0.5rem 1.125rem', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'background-color 0.2s',
                    }}
                >
                    Wszystkie aktualności
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
            </div>

            {/* Layout: featured left, small cards right */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ gridColumn: rest.length > 0 ? 'span 2' : 'span 1' }}>
                    <FeaturedCard article={featured} />
                </div>
                {rest.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {rest.map(article => (
                            <SmallCard key={article.articleId} article={article} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeNewsSection;
