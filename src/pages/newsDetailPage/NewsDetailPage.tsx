import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTemplate from "../../components/common/PageTemplate";
import { MOCK_ARTICLES, type MockArticle } from "../../data/mockArticles";

const PRIMARY = '#46a5fd';

// ── Sub-components ────────────────────────────────────────────────────────────

const GalleryPhoto = ({ src }: { src: string }) => {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ aspectRatio: '1 / 1', borderRadius: '0.5rem', overflow: 'hidden', cursor: 'pointer' }}
        >
            <img
                src={src}
                alt=""
                style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease',
                }}
            />
        </div>
    );
};

const RelatedCard = ({ item, onClick }: { item: MockArticle; onClick: () => void }) => {
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
            <div style={{ height: 192, overflow: 'hidden', position: 'relative' }}>
                <img
                    src={item.image}
                    alt={item.title}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.3s ease',
                    }}
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span style={{
                        backgroundColor: item.badgeColor,
                        color: '#fff',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                        textTransform: 'uppercase',
                    }}>
                        {item.badge}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, margin: '0 0 0.5rem' }}>{item.date}</p>
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

// ── Page ──────────────────────────────────────────────────────────────────────

const NewsDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const article = MOCK_ARTICLES.find((a) => a.id === id) ?? MOCK_ARTICLES[0];
    const related = MOCK_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

    return (
        <PageTemplate>
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
                                backgroundColor: `${article.badgeColor}20`,
                                color: article.badgeColor,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                borderRadius: 9999,
                            }}>
                                {article.badge}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{article.date}</span>
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
                        <div style={{ aspectRatio: '16 / 9', borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                            <img
                                src={article.heroImage}
                                alt={article.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>

                        {/* Body */}
                        <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {article.body.map((block, i) => {
                                if (block.type === 'heading') return (
                                    <h2 key={i} style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                        {block.text}
                                    </h2>
                                );
                                if (block.type === 'quote') return (
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

                    {/* Gallery */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        borderTop: '1px solid #e2e8f0',
                        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            margin: '0 0 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <span className="material-symbols-outlined" style={{ color: PRIMARY, fontSize: 22 }}>photo_library</span>
                            Galeria meczowa
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '1rem',
                        }}>
                            {article.gallery.map((src, i) => <GalleryPhoto key={i} src={src} />)}
                        </div>
                    </div>
                </article>

                {/* Related */}
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
                            <RelatedCard key={item.id} item={item} onClick={() => navigate(`/news/${item.id}`)} />
                        ))}
                    </div>
                </section>
            </div>
        </PageTemplate>
    );
};

export default NewsDetailPage;
