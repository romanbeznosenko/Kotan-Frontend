import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    listArticles,
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
    new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

const AdminNewsSection = () => {
    const navigate = useNavigate();
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

    const selectStyle: React.CSSProperties = {
        background: 'transparent', border: 'none', fontSize: '0.875rem',
        fontWeight: 600, outline: 'none', cursor: 'pointer', width: '100%',
        fontFamily: "'Inter', sans-serif",
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', padding: '2rem', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>
                        <span>Admin</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                        <span style={{ color: '#0061a3', fontWeight: 700 }}>Aktualności</span>
                    </nav>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Aktualności</h2>
                    <p style={{ color: '#404752', marginTop: '0.25rem', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Zarządzaj artykułami i wpisami akademii.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/articles/create')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,97,163,0.2)' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add_circle</span>
                    Dodaj artykuł
                </button>
            </div>

            {/* Filter bar */}
            <div style={{ background: '#f1f3fb', padding: '1rem', borderRadius: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div
                    style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', minWidth: '160px' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#ebeef5'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#fff'}
                >
                    <label style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kategoria</label>
                    <select style={selectStyle} value={filterCategory} onChange={e => { setFilterCategory(e.target.value as ArticleCategoryEnum | ''); setPage(1); }}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f3fb' }}>
                                {['Zdjęcie', 'Tytuł', 'Kategoria', 'Data', 'Akcje'].map((col, i) => (
                                    <th key={col} style={{ padding: '1rem 1.5rem', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', textAlign: i === 4 ? 'right' : 'left', whiteSpace: 'nowrap' }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        Ładowanie…
                                    </td>
                                </tr>
                            ) : articles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        Brak artykułów
                                    </td>
                                </tr>
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

                {/* Pagination */}
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(241,243,251,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.75rem', color: '#404752', fontWeight: 500, margin: 0 }}>
                        Wyświetlono <strong style={{ color: '#181c21' }}>{total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}</strong> z {total} artykułów
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                {[
                    { icon: 'newspaper', label: 'Wszystkich artykułów', value: total,                    color: '#0061a3' },
                    { icon: 'groups',    label: 'Kategorii',            value: CATEGORIES.length - 1,    color: '#855400' },
                    { icon: 'today',     label: 'Dodanych dziś',        value: 0,                        color: '#22c55e' },
                ].map(stat => (
                    <div key={stat.label} style={{ background: '#f1f3fb', padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${stat.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: '1.375rem' }}>{stat.icon}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{stat.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", margin: 0 }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Article row ────────────────────────────────────────────────────────────────
const ArticleRow = ({ article, categoryColor, divider, onEdit, onDeleted }: {
    article: ArticleListItem; categoryColor: string; divider: boolean;
    onEdit: () => void; onDeleted: () => void;
}) => {
    const [hovered,        setHovered]        = useState(false);
    const [actionsVisible, setActionsVisible] = useState(false);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <tr
            style={{ borderTop: divider ? '1px solid #f8fafc' : 'none', background: hovered ? '#f1f3fb' : 'transparent', transition: 'background 0.15s', cursor: 'pointer' }}
            onMouseEnter={() => { setHovered(true); setActionsVisible(true); }}
            onMouseLeave={() => { setHovered(false); setActionsVisible(false); }}
            onClick={onEdit}
        >
            {/* Cover */}
            <td style={{ padding: '1rem 1.5rem' }}>
                <div style={{ width: '5rem', height: '3rem', borderRadius: '0.5rem', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                    {article.image ? (
                        <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>image</span>
                        </div>
                    )}
                </div>
            </td>

            {/* Title */}
            <td style={{ padding: '1rem 1.5rem', maxWidth: '22rem' }}>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{article.title}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.125rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '20rem' }}>{article.shortPreview}</p>
            </td>

            {/* Category */}
            <td style={{ padding: '1rem 1.5rem' }}>
                <span style={{ display: 'inline-block', background: categoryColor, color: '#fff', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.625rem', borderRadius: '0.25rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {article.category}
                </span>
            </td>

            {/* Date */}
            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                {formatDate(article.date)}
            </td>

            {/* Actions */}
            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
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
                        onClick={e => { e.stopPropagation(); onDeleted(); }}
                        style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '0.375rem', display: 'flex' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ba1a1a'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.08)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ── Pagination button ──────────────────────────────────────────────────────────
const PgBtn = ({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0061a3' : '#fff', color: active ? '#fff' : '#475569', fontSize: '0.75rem', fontWeight: 700, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
    >
        {children}
    </button>
);

export default AdminNewsSection;
