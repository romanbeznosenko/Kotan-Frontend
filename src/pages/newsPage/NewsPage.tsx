import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../components/common/PageTemplate";
import { MOCK_ARTICLES, FEATURED_ARTICLE, type ArticleCategory } from "../../data/mockArticles";

const PRIMARY = '#46a5fd';

type FilterKey = 'all' | ArticleCategory;

const FILTERS: { id: FilterKey; label: string }[] = [
    { id: 'all',     label: 'Wszystkie' },
    { id: 'senior',  label: 'Seniorzy' },
    { id: 'junior',  label: 'Junior' },
    { id: 'mlodzik', label: 'Młodzik' },
    { id: 'orlik',   label: 'Orlik' },
    { id: 'zak',     label: 'Żak' },
    { id: 'girls',   label: 'Girls Teams' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const FeaturedCard = () => {
    const [btnHovered, setBtnHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            marginBottom: '3rem',
        }}>
            <div style={{
                flex: '0 0 60%',
                minWidth: 280,
                minHeight: 280,
                backgroundImage: `url('${FEATURED_ARTICLE.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />
            <div style={{
                flex: 1,
                minWidth: 260,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.75rem',
            }}>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 9999,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    backgroundColor: `rgba(70,165,253,0.1)`,
                    color: PRIMARY,
                    width: 'fit-content',
                }}>
                    {FEATURED_ARTICLE.badge}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                    {FEATURED_ARTICLE.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>{FEATURED_ARTICLE.date}</p>
                <p style={{ color: '#475569', lineHeight: 1.75, margin: 0 }}>{FEATURED_ARTICLE.excerpt}</p>
                <button
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    onClick={() => navigate(`/news/${FEATURED_ARTICLE.id}`)}
                    style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: 'fit-content',
                        padding: '0.625rem 1.5rem',
                        backgroundColor: btnHovered ? 'rgba(70,165,253,0.85)' : PRIMARY,
                        color: '#fff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    Czytaj więcej
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

const NewsCard = ({ article }: { article: typeof MOCK_ARTICLES[0] }) => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <article
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => navigate(`/news/${article.id}`)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
            }}
        >
            <div style={{ height: 192, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${article.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s ease',
                }} />
                <div style={{ position: 'absolute', top: 0, left: 0, padding: '1rem' }}>
                    <span style={{
                        backgroundColor: article.badgeColor,
                        color: '#fff',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.25rem',
                    }}>
                        {article.badge}
                    </span>
                </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 0.5rem' }}>{article.date}</p>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: hovered ? PRIMARY : '#0f172a',
                    margin: '0 0 0.5rem',
                    lineHeight: 1.35,
                    transition: 'color 0.2s',
                }}>
                    {article.title}
                </h3>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: 1.6,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                }}>
                    {article.excerpt}
                </p>
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    color: PRIMARY,
                    fontSize: '0.875rem',
                    fontWeight: 700,
                }}>
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
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.5rem',
                border: active ? 'none' : '1px solid #e2e8f0',
                backgroundColor: active ? PRIMARY : hovered ? `rgba(70,165,253,0.05)` : '#fff',
                color: active ? '#fff' : hovered ? PRIMARY : '#475569',
                fontWeight: active ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
            }}
        >
            {children}
        </button>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const NewsPage = () => {
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = activeFilter === 'all'
        ? MOCK_ARTICLES
        : MOCK_ARTICLES.filter((a) => a.category === activeFilter);

    return (
        <PageTemplate>
            <div style={{
                width: '100%',
                maxWidth: '80rem',
                margin: '0 auto',
                padding: '2.5rem 1.5rem',
                fontFamily: "'Lexend', sans-serif",
                boxSizing: 'border-box',
            }}>
                {/* Title */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
                        Aktualności
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#475569', margin: 0, maxWidth: '42rem' }}>
                        Najnowsze informacje, wydarzenia oraz relacje z życia akademii Kotan Ozorków.
                    </p>
                </div>

                <FeaturedCard />

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                    {FILTERS.map(({ id, label }) => {
                        const isActive = activeFilter === id;
                        return (
                            <button
                                key={id}
                                onClick={() => { setActiveFilter(id); setCurrentPage(1); }}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    border: isActive ? 'none' : '1px solid #e2e8f0',
                                    backgroundColor: isActive ? PRIMARY : '#fff',
                                    color: isActive ? '#fff' : '#475569',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                }}>
                    {filtered.map((article) => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>

                {/* Pagination */}
                <nav style={{
                    marginTop: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                }}>
                    <PaginationButton onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                    </PaginationButton>
                    {[1, 2, 3].map((p) => (
                        <PaginationButton key={p} active={currentPage === p} onClick={() => setCurrentPage(p)}>
                            {p}
                        </PaginationButton>
                    ))}
                    <span style={{ color: '#94a3b8', margin: '0 0.5rem' }}>...</span>
                    <PaginationButton onClick={() => setCurrentPage(12)}>12</PaginationButton>
                    <PaginationButton onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                    </PaginationButton>
                </nav>
            </div>
        </PageTemplate>
    );
};

export default NewsPage;
