import { useRef, useState } from 'react';
import type { ArticleBody, ArticleCategory, MockArticle } from '../../data/mockArticles';
import { createArticle, editArticle, deleteArticle, type ArticleCategoryEnum, type ArticleBodyTypeEnum, type ArticleResponse } from '../../services/articleService';

const BODY_TYPE_FROM_API: Record<ArticleBodyTypeEnum, ArticleBody['type']> = {
    PARAGRAPH: 'paragraph',
    QUOTE:     'quote',
    HEADING:   'heading',
};

const CATEGORIES: { value: ArticleCategory; apiValue: ArticleCategoryEnum; label: string; color: string }[] = [
    { value: 'senior',  apiValue: 'SENIOR',  label: 'Seniorzy',    color: '#1e293b' },
    { value: 'junior',  apiValue: 'JUNIOR',  label: 'Junior',      color: '#46a5fd' },
    { value: 'mlodzik', apiValue: 'MLODZIK', label: 'Młodzik',     color: '#22c55e' },
    { value: 'orlik',   apiValue: 'ORLIK',   label: 'Orlik',       color: '#f97316' },
    { value: 'zak',     apiValue: 'ZAK',     label: 'Żak',         color: '#eab308' },
    { value: 'girls',   apiValue: 'GIRLS',   label: 'Girls Teams', color: '#ec4899' },
];

const BODY_TYPE_MAP: Record<ArticleBody['type'], ArticleBodyTypeEnum> = {
    paragraph: 'PARAGRAPH',
    quote:     'QUOTE',
    heading:   'HEADING',
};

const BODY_TYPE_LABELS: Record<ArticleBody['type'], string> = {
    paragraph: 'Paragraf',
    quote:     'Cytat',
    heading:   'Nagłówek',
};

// ── Upload zone (must be outside parent to avoid remount on every render) ──────
interface UploadZoneProps {
    preview: string; hover: boolean; label: string;
    onHover: () => void; onLeave: () => void; onClick: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadZone = ({ preview, hover, onHover, onLeave, onClick, label, inputRef, onChange }: UploadZoneProps) => {
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '10px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: '#404752', marginBottom: '0.375rem',
    };
    return (
        <div>
            <label style={labelStyle}>{label}</label>
            <div
                onClick={onClick}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
                style={{
                    position: 'relative', borderRadius: '0.625rem', overflow: 'hidden',
                    aspectRatio: '16/9', background: '#f1f3fb',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: `2px dashed ${hover ? '#0061a3' : 'rgba(192,199,212,0.4)'}`,
                    cursor: 'pointer', transition: 'border-color 0.2s', marginTop: '0.5rem',
                }}
            >
                {preview && (
                    <img src={preview} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', opacity: preview && !hover ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: hover ? '#0061a3' : '#94a3b8', transition: 'color 0.2s' }}>add_photo_alternate</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#404752' }}>Kliknij aby dodać zdjęcie</span>
                    <span style={{ fontSize: '10px', color: '#707883' }}>PNG, JPG do 10MB</span>
                </div>
                {preview && hover && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#fff' }}>photo_camera</span>
                    </div>
                )}
                <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onChange} />
            </div>
        </div>
    );
};

// ── Main form ──────────────────────────────────────────────────────────────────
interface Props {
    article?: MockArticle;          // legacy local mock (create flow)
    articleResponse?: ArticleResponse; // real API data (edit flow)
    onBack: () => void;
    onSaved: (article: MockArticle) => void;
}

const AdminNewsFormSection = ({ article, articleResponse, onBack, onSaved }: Props) => {
    const isEdit = !!(article || articleResponse);

    // Prefer real API response, fall back to local mock
    const initialTitle   = articleResponse?.title        ?? article?.title    ?? '';
    const initialExcerpt = articleResponse?.shortPreview ?? article?.excerpt  ?? '';
    const initialBody: ArticleBody[] = articleResponse
        ? [...articleResponse.body]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(b => ({ type: BODY_TYPE_FROM_API[b.type], text: b.text }))
        : (article?.body ?? [{ type: 'paragraph', text: '' }]);
    const initialImage     = articleResponse?.image     ?? article?.image     ?? '';
    const initialHeroImage = articleResponse?.heroImage ?? article?.heroImage ?? '';

    const [title,    setTitle]    = useState(initialTitle);
    const [excerpt,  setExcerpt]  = useState(initialExcerpt);
    const [category, setCategory] = useState<ArticleCategory>(article?.category ?? 'senior');
    const [body,     setBody]     = useState<ArticleBody[]>(initialBody);

    const [imagePreview,     setImagePreview]     = useState<string>(initialImage);
    const [heroImagePreview, setHeroImagePreview] = useState<string>(initialHeroImage);
    const [imageFile,        setImageFile]        = useState<File | null>(null);
    const [heroImageFile,    setHeroImageFile]    = useState<File | null>(null);
    const [imageHover,       setImageHover]       = useState(false);
    const [heroHover,        setHeroHover]        = useState(false);

    const [errors,   setErrors]   = useState<Record<string, string>>({});
    const [saving,   setSaving]   = useState(false);
    const [deleting, setDeleting] = useState(false);

    const imageRef     = useRef<HTMLInputElement>(null);
    const heroImageRef = useRef<HTMLInputElement>(null);

    const inputStyle = (hasErr?: boolean): React.CSSProperties => ({
        width: '100%', boxSizing: 'border-box',
        background: '#f1f3fb', border: hasErr ? '1px solid #ba1a1a' : 'none',
        borderRadius: '0.625rem', padding: '0.75rem 1rem',
        fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
        outline: 'none', color: '#181c21', transition: 'background 0.2s',
    });

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '10px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: '#404752', marginBottom: '0.375rem',
    };

    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '0.875rem',
        padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid rgba(192,199,212,0.15)',
    };

    const cardTitleStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        paddingBottom: '1rem', marginBottom: '1.5rem',
        borderBottom: '1px solid #f1f3fb',
    };

    const handleImageFile = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: (v: string) => void,
        setFile: (f: File) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) { setPreview(URL.createObjectURL(file)); setFile(file); }
    };

    const addBodyBlock = (type: ArticleBody['type']) => {
        setBody(b => [...b, { type, text: '' }]);
    };

    const updateBodyBlock = (i: number, text: string) => {
        setBody(b => b.map((block, idx) => idx === i ? { ...block, text } : block));
    };

    const removeBodyBlock = (i: number) => {
        setBody(b => b.filter((_, idx) => idx !== i));
    };

    const changeBodyBlockType = (i: number, type: ArticleBody['type']) => {
        setBody(b => b.map((block, idx) => idx === i ? { ...block, type } : block));
    };

    const moveBodyBlock = (i: number, dir: -1 | 1) => {
        setBody(b => {
            const next = [...b];
            const target = i + dir;
            if (target < 0 || target >= next.length) return next;
            [next[i], next[target]] = [next[target], next[i]];
            return next;
        });
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!title.trim())   e.title   = 'Tytuł jest wymagany';
        if (!excerpt.trim()) e.excerpt  = 'Zajawka jest wymagana';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleDelete = async () => {
        if (!articleResponse) return;
        if (!window.confirm(`Czy na pewno chcesz usunąć artykuł "${articleResponse.title}"?`)) return;
        setDeleting(true);
        try {
            await deleteArticle(articleResponse.articleId);
            onBack();
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const cat = CATEGORIES.find(c => c.value === category)!;
            const requestData = {
                title:        title.trim(),
                shortPreview: excerpt.trim(),
                category:     cat.apiValue,
                body:         body
                    .filter(b => b.text.trim())
                    .map(b => ({ type: BODY_TYPE_MAP[b.type], text: b.text.trim() })),
            };

            if (articleResponse) {
                await editArticle(
                    articleResponse.articleId,
                    requestData,
                    imageFile     ?? undefined,
                    heroImageFile ?? undefined,
                );
            } else {
                await createArticle(
                    requestData,
                    imageFile     ?? undefined,
                    heroImageFile ?? undefined,
                );
            }
            // Build a local representation for the parent list to display immediately
            const saved: MockArticle = {
                id:        article?.id ?? `article-${Date.now()}`,
                category,
                badge:     cat.label,
                badgeColor: cat.color,
                date:      new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' }),
                title:     title.trim(),
                excerpt:   excerpt.trim(),
                image:     imagePreview     || article?.image     || '',
                heroImage: heroImagePreview || article?.heroImage || imagePreview || '',
                body:      body.filter(b => b.text.trim()),
                gallery:   article?.gallery ?? [],
            };
            onSaved(saved);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* Top bar */}
            <header style={{ background: '#f8f9ff', borderBottom: '1px solid #f1f3fb', padding: '0 2rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#404752' }}>
                    <button
                        onClick={onBack}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#404752', fontWeight: 500, fontSize: '0.875rem', padding: 0, fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0061a3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#404752'}
                    >
                        Aktualności
                    </button>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                    <span style={{ color: '#181c21', fontWeight: 700 }}>{isEdit ? 'Edytuj artykuł' : 'Dodaj artykuł'}</span>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {articleResponse && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting || saving}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.375rem',
                                padding: '0.5rem 1.125rem', border: '1px solid rgba(186,26,26,0.3)',
                                borderRadius: '0.5rem', background: 'none',
                                fontSize: '0.8125rem', fontWeight: 700, color: '#ba1a1a',
                                cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.6 : 1,
                                fontFamily: "'Inter', sans-serif", transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (!deleting) (e.currentTarget as HTMLElement).style.background = 'rgba(186,26,26,0.06)'; }}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                                {deleting ? 'hourglass_empty' : 'delete'}
                            </span>
                            {deleting ? 'Usuwanie…' : 'Usuń artykuł'}
                        </button>
                    )}
                    {!isEdit && (
                        <button
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1.125rem', border: 'none', borderRadius: '0.5rem',
                                background: '#1877F2', color: '#fff',
                                fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer',
                                fontFamily: "'Inter', sans-serif",
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1464d8'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#1877F2'}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                            </svg>
                            Pobierz z Facebooka
                        </button>
                    )}
                    <button
                        onClick={onBack}
                        style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#404752', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 12px rgba(0,97,163,0.2)' }}
                    >
                        {saving ? 'Zapisywanie…' : isEdit ? 'Zapisz zmiany' : 'Opublikuj artykuł'}
                    </button>
                </div>
            </header>

            {/* Body */}
            <div style={{ padding: '2rem', maxWidth: '72rem', margin: '0 auto' }}>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                        {isEdit ? 'Edytuj artykuł' : 'Nowy artykuł'}
                    </h2>
                    <p style={{ color: '#404752', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                        {isEdit ? 'Zaktualizuj treść i metadane artykułu.' : 'Utwórz nowy wpis w aktualnościach akademii.'}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Basic info */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>
                                <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>article</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informacje podstawowe</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={labelStyle}>Tytuł artykułu</label>
                                    <input
                                        style={inputStyle(!!errors.title)}
                                        placeholder="np. Junior wygrywa 3:1 z ŁKS"
                                        value={title}
                                        onChange={e => { setTitle(e.target.value); setErrors(v => ({ ...v, title: '' })); }}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                    {errors.title && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: '0.25rem', margin: '0.25rem 0 0' }}>{errors.title}</p>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Zajawka</label>
                                    <textarea
                                        style={{ ...inputStyle(!!errors.excerpt), resize: 'none' }}
                                        placeholder="Krótki opis artykułu widoczny na liście aktualności…"
                                        rows={3}
                                        value={excerpt}
                                        onChange={e => { setExcerpt(e.target.value); setErrors(v => ({ ...v, excerpt: '' })); }}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                    {errors.excerpt && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>{errors.excerpt}</p>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Kategoria</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat.value}
                                                onClick={() => setCategory(cat.value)}
                                                style={{
                                                    padding: '0.375rem 0.875rem', borderRadius: '9999px', border: 'none',
                                                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                                                    background: category === cat.value ? cat.color : '#f1f3fb',
                                                    color: category === cat.value ? '#fff' : '#404752',
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body editor */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>
                                <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>edit_note</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Treść artykułu</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {body.map((block, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>

                                        {/* Type selector */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.125rem', flexShrink: 0 }}>
                                            {(['paragraph', 'quote', 'heading'] as ArticleBody['type'][]).map(type => {
                                                const active = block.type === type;
                                                const color = type === 'quote' ? '#df8f00' : type === 'heading' ? '#0061a3' : '#64748b';
                                                return (
                                                    <button
                                                        key={type}
                                                        onClick={() => changeBodyBlockType(i, type)}
                                                        title={BODY_TYPE_LABELS[type]}
                                                        style={{
                                                            width: 28, height: 22, padding: 0, border: 'none', borderRadius: '0.3rem',
                                                            fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                                                            cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
                                                            background: active ? color : '#f1f3fb',
                                                            color: active ? '#fff' : '#94a3b8',
                                                        }}
                                                    >
                                                        {type === 'paragraph' ? 'P' : type === 'quote' ? 'Q' : 'H'}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Input */}
                                        <div style={{ flex: 1 }}>
                                            {block.type === 'paragraph' ? (
                                                <textarea
                                                    style={{ ...inputStyle(), resize: 'none', borderLeft: '3px solid #e0e2ea' }}
                                                    rows={4}
                                                    placeholder="Treść paragrafu…"
                                                    value={block.text}
                                                    onChange={e => updateBodyBlock(i, e.target.value)}
                                                    onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderLeftColor = '#0061a3'; }}
                                                    onBlur={e => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLElement).style.borderLeftColor = '#e0e2ea'; }}
                                                />
                                            ) : block.type === 'quote' ? (
                                                <textarea
                                                    style={{ ...inputStyle(), resize: 'none', borderLeft: '3px solid #df8f00', fontStyle: 'italic' }}
                                                    rows={3}
                                                    placeholder='"Treść cytatu…"'
                                                    value={block.text}
                                                    onChange={e => updateBodyBlock(i, e.target.value)}
                                                    onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                                                    onBlur={e => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; }}
                                                />
                                            ) : (
                                                <input
                                                    style={{ ...inputStyle(), fontWeight: 700, fontSize: '1rem', borderLeft: '3px solid #46a5fd' }}
                                                    placeholder="Nagłówek sekcji…"
                                                    value={block.text}
                                                    onChange={e => updateBodyBlock(i, e.target.value)}
                                                    onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                                                    onBlur={e => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; }}
                                                />
                                            )}
                                        </div>

                                        {/* Order + delete controls */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                                            <button
                                                onClick={() => moveBodyBlock(i, -1)}
                                                disabled={i === 0}
                                                title="Przesuń wyżej"
                                                style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? '#e0e2ea' : '#94a3b8', borderRadius: '0.375rem', display: 'flex' }}
                                                onMouseEnter={e => { if (i > 0) (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; }}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_upward</span>
                                            </button>
                                            <button
                                                onClick={() => moveBodyBlock(i, 1)}
                                                disabled={i === body.length - 1}
                                                title="Przesuń niżej"
                                                style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: i === body.length - 1 ? 'default' : 'pointer', color: i === body.length - 1 ? '#e0e2ea' : '#94a3b8', borderRadius: '0.375rem', display: 'flex' }}
                                                onMouseEnter={e => { if (i < body.length - 1) (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; }}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>arrow_downward</span>
                                            </button>
                                            <button
                                                onClick={() => removeBodyBlock(i)}
                                                title="Usuń blok"
                                                style={{ padding: '0.3rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '0.375rem', display: 'flex' }}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ba1a1a'; (e.currentTarget as HTMLElement).style.background = 'rgba(186,26,26,0.06)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {(['paragraph', 'quote', 'heading'] as ArticleBody['type'][]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => addBodyBlock(type)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', background: '#f1f3fb', border: 'none', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#404752', cursor: 'pointer', fontFamily: "'Inter', sans-serif' " }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                                            {BODY_TYPE_LABELS[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={cardStyle}>
                            <UploadZone
                                preview={imagePreview}
                                hover={imageHover}
                                onHover={() => setImageHover(true)}
                                onLeave={() => setImageHover(false)}
                                onClick={() => imageRef.current?.click()}
                                label="Zdjęcie na liście"
                                inputRef={imageRef}
                                onChange={e => handleImageFile(e, setImagePreview, setImageFile)}
                            />
                        </div>

                        <div style={cardStyle}>
                            <UploadZone
                                preview={heroImagePreview}
                                hover={heroHover}
                                onHover={() => setHeroHover(true)}
                                onLeave={() => setHeroHover(false)}
                                onClick={() => heroImageRef.current?.click()}
                                label="Zdjęcie nagłówkowe (hero)"
                                inputRef={heroImageRef}
                                onChange={e => handleImageFile(e, setHeroImagePreview, setHeroImageFile)}
                            />
                        </div>

                        {/* Category preview */}
                        <div style={cardStyle}>
                            <label style={labelStyle}>Podgląd etykiety</label>
                            <div style={{ marginTop: '0.5rem' }}>
                                {(() => {
                                    const cat = CATEGORIES.find(c => c.value === category)!;
                                    return (
                                        <span style={{ display: 'inline-block', background: cat.color, color: '#fff', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', padding: '0.2rem 0.625rem', borderRadius: '0.25rem', letterSpacing: '0.08em' }}>
                                            {cat.label}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNewsFormSection;
