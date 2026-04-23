import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    listArticles,
    deleteArticle,
    type ArticleCategoryEnum,
    type ArticleListItem,
} from '../../services/articleService';

const CATEGORIES: { value: ArticleCategoryEnum | ''; label: string; color: string }[] = [
    { value: '',        label: 'Wszystkie',   color: '#404752' },
    { value: 'SENIOR',  label: 'Seniorzy',    color: '#1e293b' },
    { value: 'JUNIOR',  label: 'Junior',      color: '#46a5fd' },
    { value: 'MLODZIK', label: 'Młodzik',     color: '#22c55e' },
    { value: 'ORLIK',   label: 'Orlik',       color: '#f97316' },
    { value: 'ZAK',     label: 'Żak',         color: '#eab308' },
    { value: 'GIRLS',   label: 'Girls Teams', color: '#ec4899' },
];

const CATEGORY_COLOR: Record<ArticleCategoryEnum, string> = {
    SENIOR: '#1e293b', JUNIOR: '#46a5fd', MLODZIK: '#22c55e',
    ORLIK:  '#f97316', ZAK:    '#eab308', GIRLS:   '#ec4899',
};

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' });

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return isMobile;
};

// ── Pagination button ──────────────────────────────────────────────────────────
const PgBtn = ({ children, onClick, disabled, active }: {
    children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean;
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            width: '2rem', height: '2rem', borderRadius: '0.5rem',
            border: active ? 'none' : '1px solid #e2e8f0',
            background: active ? '#0061a3' : '#fff',
            color: active ? '#fff' : '#475569',
            fontSize: '0.75rem', fontWeight: 700,
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.35 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
        }}
    >
        {children}
    </button>
);

// ── Desktop table row ──────────────────────────────────────────────────────────
const ArticleRow = ({ article, categoryColor, divider, onEdit, onDeleted }: {
    article: ArticleListItem; categoryColor: string; divider: boolean;
    onEdit: () => void; onDeleted: () => void;
}) => {
    const [hovered,        setHovered]        = useState(false);
    const [actionsVisible, setActionsVisible] = useState(false);
    const [deleting,       setDeleting]       = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm(`Czy na pewno chcesz usunąć artykuł "${article.title}"?`)) return;
        setDeleting(true);
        try { await deleteArticle(article.articleId); onDeleted(); }
        finally { setDeleting(false); }
    };

    return (
        <tr
            style={{ borderTop: divider ? '1px solid #f8fafc' : 'none', background: hovered ? '#f1f3fb' : 'transparent', transition: 'background 0.15s', cursor: 'pointer' }}
            onMouseEnter={() => { setHovered(true); setActionsVisible(true); }}
            onMouseLeave={() => { setHovered(false); setActionsVisible(false); }}
            onClick={onEdit}
        >
            <td style={{ padding: '0.875rem 1.25rem' }}>
                <div style={{ width: '4.5rem', height: '2.75rem', borderRadius: '0.5rem', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                    {article.image ? (
                        <img src={article.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.25rem' }}>image</span>
                        </div>
                    )}
                </div>
            </td>
            <td style={{ padding: '0.875rem 1.25rem', maxWidth: '22rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{article.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.125rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '20rem' }}>{article.shortPreview}</p>
            </td>
            <td style={{ padding: '0.875rem 1.25rem' }}>
                <span style={{ display: 'inline-block', background: categoryColor, color: '#fff', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.625rem', borderRadius: '0.25rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {article.category}
                </span>
            </td>
            <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.8125rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                {formatDate(article.date)}
            </td>
            <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', opacity: actionsVisible ? 1 : 0, transition: 'opacity 0.15s' }}>
                    <button
                        onClick={e => { e.stopPropagation(); onEdit(); }}
                        style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '0.375rem', display: 'flex' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#0061a3'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,97,163,0.08)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: deleting ? 'default' : 'pointer', color: deleting ? '#e0e2ea' : '#94a3b8', borderRadius: '0.375rem', display: 'flex', opacity: deleting ? 0.5 : 1 }}
                        onMouseEnter={e => { if (!deleting) { (e.currentTarget as HTMLButtonElement).style.color = '#ba1a1a'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.08)'; } }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = deleting ? '#e0e2ea' : '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{deleting ? 'hourglass_empty' : 'delete'}</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ── Mobile card ────────────────────────────────────────────────────────────────
const ArticleCard = ({ article, categoryColor, onEdit, onDeleted }: {
    article: ArticleListItem; categoryColor: string;
    onEdit: () => void; onDeleted: () => void;
}) => {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm(`Czy na pewno chcesz usunąć artykuł "${article.title}"?`)) return;
        setDeleting(true);
        try { await deleteArticle(article.articleId); onDeleted(); }
        finally { setDeleting(false); }
    };

    return (
        <div
            onClick={onEdit}
            style={{
                display: 'flex', gap: '0.875rem', padding: '1rem',
                borderBottom: '1px solid #f1f3fb', cursor: 'pointer',
                background: '#fff', alignItems: 'flex-start',
            }}
        >
            {/* Thumbnail */}
            <div style={{ width: '4rem', height: '4rem', borderRadius: '0.5rem', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                {article.image ? (
                    <img src={article.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.25rem' }}>image</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ background: categoryColor, color: '#fff', fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '0.2rem', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {article.category}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>{formatDate(article.date)}</span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', margin: '0 0 0.2rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {article.title}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                    {article.shortPreview}
                </p>
            </div>

            {/* Actions — always visible on mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                <button
                    onClick={e => { e.stopPropagation(); onEdit(); }}
                    style={{ padding: '0.375rem', background: 'rgba(0,97,163,0.08)', border: 'none', cursor: 'pointer', color: '#0061a3', borderRadius: '0.375rem', display: 'flex' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{ padding: '0.375rem', background: 'rgba(186,26,26,0.08)', border: 'none', cursor: deleting ? 'default' : 'pointer', color: deleting ? '#e0e2ea' : '#ba1a1a', borderRadius: '0.375rem', display: 'flex', opacity: deleting ? 0.5 : 1 }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>{deleting ? 'hourglass_empty' : 'delete'}</span>
                </button>
            </div>
        </div>
    );
};

// ── Main section ───────────────────────────────────────────────────────────────
const AdminNewsSection = () => {
    const navigate  = useNavigate();
    const isMobile  = useIsMobile();

    const [articles,       setArticles]       = useState<ArticleListItem[]>([]);
    const [total,          setTotal]          = useState(0);
    const [loading,        setLoading]        = useState(false);
    const [filterCategory, setFilterCategory] = useState<ArticleCategoryEnum | ''>('');
    const [page,           setPage]           = useState(1);
    const [refreshKey,     setRefreshKey]     = useState(0);

    useEffect(() => {
        setLoading(true);
        listArticles(page, PAGE_SIZE, filterCategory ? { category: filterCategory } : {})
            .then(({ data, count }) => { setArticles(data); setTotal(Number(count)); })
            .catch(() => { setArticles([]); setTotal(0); })
            .finally(() => setLoading(false));
    }, [page, filterCategory, refreshKey]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', padding: isMobile ? '1rem' : '2rem', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    {!isMobile && (
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>
                            <span>Admin</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                            <span style={{ color: '#0061a3', fontWeight: 700 }}>Aktualności</span>
                        </nav>
                    )}
                    <h2 style={{ fontSize: isMobile ? '1.375rem' : '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Aktualności</h2>
                    {!isMobile && <p style={{ color: '#404752', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Zarządzaj artykułami i wpisami akademii.</p>}
                </div>
                <button
                    onClick={() => navigate('/admin/articles/create')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', color: '#fff', padding: isMobile ? '0.625rem 1rem' : '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,97,163,0.2)', whiteSpace: 'nowrap' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add_circle</span>
                    {!isMobile && 'Dodaj artykuł'}
                </button>
            </div>

            {/* Filter bar */}
            <div style={{ background: '#f1f3fb', padding: '0.75rem 1rem', borderRadius: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Kategoria:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {CATEGORIES.map(c => (
                        <button
                            key={c.value}
                            onClick={() => { setFilterCategory(c.value as ArticleCategoryEnum | ''); setPage(1); }}
                            style={{
                                padding: '0.3rem 0.75rem', borderRadius: '9999px', border: 'none',
                                fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap',
                                background: filterCategory === c.value ? c.color : '#fff',
                                color: filterCategory === c.value ? '#fff' : '#404752',
                                transition: 'all 0.15s',
                            }}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                {isMobile ? (
                    /* ── Mobile card list ── */
                    <div>
                        {loading ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Ładowanie…</div>
                        ) : articles.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Brak artykułów</div>
                        ) : articles.map(article => (
                            <ArticleCard
                                key={article.articleId}
                                article={article}
                                categoryColor={CATEGORY_COLOR[article.category]}
                                onEdit={() => navigate(`/admin/articles/${article.articleId}/edit`)}
                                onDeleted={() => setRefreshKey(k => k + 1)}
                            />
                        ))}
                    </div>
                ) : (
                    /* ── Desktop table ── */
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f1f3fb' }}>
                                    {['Zdjęcie', 'Tytuł', 'Kategoria', 'Data', 'Akcje'].map((col, i) => (
                                        <th key={col} style={{ padding: '0.875rem 1.25rem', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', textAlign: i === 4 ? 'right' : 'left', whiteSpace: 'nowrap' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Ładowanie…</td></tr>
                                ) : articles.length === 0 ? (
                                    <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>Brak artykułów</td></tr>
                                ) : articles.map((article, i) => (
                                    <ArticleRow
                                        key={article.articleId}
                                        article={article}
                                        categoryColor={CATEGORY_COLOR[article.category]}
                                        divider={i > 0}
                                        onEdit={() => navigate(`/admin/articles/${article.articleId}/edit`)}
                                        onDeleted={() => setRefreshKey(k => k + 1)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(241,243,251,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#404752', fontWeight: 500, margin: 0 }}>
                        {total === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`} z {total}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_left</span>
                        </PgBtn>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <PgBtn key={p} active={page === p} onClick={() => setPage(p)}>{p}</PgBtn>
                        ))}
                        <PgBtn onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_right</span>
                        </PgBtn>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                {[
                    { icon: 'newspaper', label: 'Artykułów',  value: total,             color: '#0061a3' },
                    { icon: 'groups',    label: 'Kategorii',  value: CATEGORIES.length - 1, color: '#855400' },
                    { icon: 'today',     label: 'Dziś',       value: 0,                 color: '#22c55e' },
                ].map(stat => (
                    <div key={stat.label} style={{ background: '#f1f3fb', padding: '1.25rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: `${stat.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: '1.25rem' }}>{stat.icon}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{stat.label}</p>
                            <p style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", margin: 0 }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNewsSection;
