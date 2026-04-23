import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageTemplate from "../../components/common/PageTemplate";
import { getPublicArticle, listPublicArticles, type PublicArticleDetail, type PublicArticleListItem } from "../../services/publicArticleService";
import type { ArticleCategoryEnum } from "../../services/articleService";

const PRIMARY = '#46a5fd';

const POLISH_MAP: Record<string, string> = {
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
};

const slugify = (text: string) =>
    text
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, c => POLISH_MAP[c] ?? c)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

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

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

// ── Sub-components ────────────────────────────────────────────────────────────

const RelatedCard = ({ item, onClick }: { item: PublicArticleListItem; onClick: () => void }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            style={{
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
            }}
        >
            <div style={{ height: 192, overflow: 'hidden', position: 'relative', background: '#f1f3fb' }}>
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                            transform: hovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.3s ease',
                        }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>image</span>
                    </div>
                )}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span style={{
                        backgroundColor: CATEGORY_BADGE_COLOR[item.category],
                        color: '#fff',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        textTransform: 'uppercase',
                    }}>
                        {CATEGORY_LABEL[item.category]}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, margin: '0 0 0.5rem' }}>{formatDate(item.date)}</p>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: hovered ? PRIMARY : '#0f172a',
                    margin: 0,
                    lineHeight: 1.35,
                    transition: 'color 0.2s',
                }}>
                    {item.title}
                </h3>
            </div>
        </div>
    );
};

// ── Lightbox ──────────────────────────────────────────────────────────────────

const Lightbox = ({ src, onClose }: { src: string; onClose: () => void }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem',
                cursor: 'zoom-out',
            }}
        >
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
            </button>
            <img
                src={src}
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: '100%', maxHeight: '100%',
                    objectFit: 'contain', borderRadius: '0.5rem',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                    cursor: 'default',
                }}
            />
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const NewsDetailPage = () => {
    useParams<{ slug: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const id: string | undefined = (location.state as { articleId?: string } | null)?.articleId;

    const [article,  setArticle]  = useState<PublicArticleDetail | null>(null);
    const [related,  setRelated]  = useState<PublicArticleListItem[]>([]);
    const [loading,  setLoading]  = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [lightbox, setLightbox] = useState<string | null>(null);
    const closeLightbox = useRef(() => setLightbox(null)).current;

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setNotFound(false);
        getPublicArticle(id)
            .then(data => {
                setArticle(data);
                return listPublicArticles(1, 4, data.category);
            })
            .then(({ data }) => {
                setRelated(data.filter(a => a.articleId !== id).slice(0, 3));
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <PageTemplate>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8rem 0', color: '#94a3b8', fontSize: '0.875rem', fontFamily: "'Lexend', sans-serif" }}>
                    Ładowanie…
                </div>
            </PageTemplate>
        );
    }

    if (notFound || !article) {
        return (
            <PageTemplate>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0', gap: '1rem', fontFamily: "'Lexend', sans-serif" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>article</span>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Artykuł nie został znaleziony.</p>
                    <button
                        onClick={() => navigate('/news')}
                        style={{ padding: '0.5rem 1.25rem', background: PRIMARY, border: 'none', borderRadius: '0.5rem', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', fontFamily: "'Lexend', sans-serif" }}
                    >
                        Wróć do aktualności
                    </button>
                </div>
            </PageTemplate>
        );
    }

    const sortedBody = [...article.body].sort((a, b) => a.orderIndex - b.orderIndex);
    const badgeColor = CATEGORY_BADGE_COLOR[article.category];

    return (
        <PageTemplate>
            {lightbox && <Lightbox src={lightbox} onClose={closeLightbox} />}
            <div style={{
                width: '100%',
                maxWidth: '75rem',
                margin: '0 auto',
                padding: '2rem 1.5rem',
                fontFamily: "'Lexend', sans-serif",
                boxSizing: 'border-box',
            }}>
                {/* Breadcrumb */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: PRIMARY, fontWeight: 500, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                        Strona Główna
                    </button>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <button onClick={() => navigate('/news')} style={{ background: 'none', border: 'none', color: PRIMARY, fontWeight: 500, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                        Aktualności
                    </button>
                    <span style={{ color: '#94a3b8' }}>/</span>
                    <span style={{ color: '#64748b' }}>Artykuł</span>
                </nav>

                {/* Article */}
                <article style={{
                    backgroundColor: '#fff',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
                        {/* Meta */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                backgroundColor: `${badgeColor}20`,
                                color: badgeColor,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                borderRadius: 9999,
                            }}>
                                {CATEGORY_LABEL[article.category]}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{formatDate(article.date)}</span>
                        </div>

                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
                            fontWeight: 900,
                            color: '#0f172a',
                            margin: '0 0 1.5rem',
                            lineHeight: 1.15,
                            letterSpacing: '-0.02em',
                        }}>
                            {article.title}
                        </h1>

                        {/* Hero image */}
                        {article.heroImage && (
                            <div
                                onClick={() => setLightbox(article.heroImage!)}
                                style={{ aspectRatio: '16 / 9', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'zoom-in' }}
                            >
                                <img
                                    src={article.heroImage}
                                    alt={article.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        )}

                        {/* Body */}
                        <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {sortedBody.map((block, i) => {
                                if (block.type === 'HEADING') return (
                                    <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        {block.text}
                                    </h2>
                                );
                                if (block.type === 'QUOTE') return (
                                    <blockquote key={i} style={{
                                        borderLeft: `4px solid ${PRIMARY}`,
                                        paddingLeft: '1rem',
                                        fontStyle: 'italic',
                                        color: '#64748b',
                                        margin: '0.5rem 0',
                                        lineHeight: 1.75,
                                    }}>
                                        {block.text}
                                    </blockquote>
                                );
                                return (
                                    <p key={i} style={{ fontSize: i === 0 ? '1.0625rem' : '1rem', color: i === 0 ? '#334155' : '#475569', lineHeight: 1.8, margin: 0 }}>
                                        {block.text}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </article>

                {/* Related */}
                {related.length > 0 && (
                    <section style={{ marginTop: '4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                                Zobacz także
                            </h2>
                            <button
                                onClick={() => navigate('/news')}
                                style={{
                                    background: 'none', border: 'none', color: PRIMARY, fontSize: '0.875rem',
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    gap: '0.25rem', fontFamily: 'inherit', padding: 0,
                                }}
                            >
                                Wszystkie aktualności
                                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                            </button>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {related.map((item) => (
                                <RelatedCard key={item.articleId} item={item} onClick={() => navigate(`/news/${slugify(item.title)}`, { state: { articleId: item.articleId } })} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </PageTemplate>
    );
};

export default NewsDetailPage;
