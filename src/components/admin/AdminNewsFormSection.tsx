import { useRef, useState } from 'react';
import type { ArticleBody, ArticleCategory, MockArticle } from '../../data/mockArticles';

const CATEGORIES: { value: ArticleCategory; label: string; color: string }[] = [
    { value: 'senior',  label: 'Seniorzy',    color: '#1e293b' },
    { value: 'junior',  label: 'Junior',       color: '#46a5fd' },
    { value: 'mlodzik', label: 'Młodzik',      color: '#22c55e' },
    { value: 'orlik',   label: 'Orlik',        color: '#f97316' },
    { value: 'zak',     label: 'Żak',          color: '#eab308' },
    { value: 'girls',   label: 'Girls Teams',  color: '#ec4899' },
];

const BODY_TYPE_LABELS: Record<ArticleBody['type'], string> = {
    paragraph: 'Paragraf',
    quote:     'Cytat',
    heading:   'Nagłówek',
};

interface Props {
    article?: MockArticle;
    onBack: () => void;
    onSaved: (article: MockArticle) => void;
}

const AdminNewsFormSection = ({ article, onBack, onSaved }: Props) => {
    const isEdit = !!article;

    const [title,    setTitle]    = useState(article?.title    ?? '');
    const [excerpt,  setExcerpt]  = useState(article?.excerpt  ?? '');
    const [category, setCategory] = useState<ArticleCategory>(article?.category ?? 'senior');
    const [body,     setBody]     = useState<ArticleBody[]>(article?.body ?? [{ type: 'paragraph', text: '' }]);

    const [imagePreview,     setImagePreview]     = useState<string>(article?.image     ?? '');
    const [heroImagePreview, setHeroImagePreview] = useState<string>(article?.heroImage ?? '');
    const [imageHover,       setImageHover]       = useState(false);
    const [heroHover,        setHeroHover]        = useState(false);

    const [errors,  setErrors]  = useState<Record<string, string>>({});
    const [saving,  setSaving]  = useState(false);

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

    const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (v: string) => void) => {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
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

    const validate = () => {
        const e: Record<string, string> = {};
        if (!title.trim())   e.title   = 'Tytuł jest wymagany';
        if (!excerpt.trim()) e.excerpt  = 'Zajawka jest wymagana';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const cat = CATEGORIES.find(c => c.value === category)!;
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

    const UploadZone = ({
        preview, hover, onHover, onLeave, onClick, label, inputRef, onChange,
    }: {
        preview: string; hover: boolean; onHover: () => void; onLeave: () => void;
        onClick: () => void; label: string;
        inputRef: React.RefObject<HTMLInputElement | null>;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) => (
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
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', paddingTop: '0.25rem', flexShrink: 0 }}>
                                            <span style={{
                                                fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                                                color: block.type === 'quote' ? '#855400' : block.type === 'heading' ? '#0061a3' : '#94a3b8',
                                                writingMode: 'vertical-rl', transform: 'rotate(180deg)',
                                            }}>
                                                {BODY_TYPE_LABELS[block.type]}
                                            </span>
                                        </div>
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
                                        <button
                                            onClick={() => removeBodyBlock(i)}
                                            style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '0.375rem', flexShrink: 0 }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ba1a1a'; (e.currentTarget as HTMLElement).style.background = 'rgba(186,26,26,0.06)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'none'; }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                                        </button>
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
                                onChange={e => handleImageFile(e, setImagePreview)}
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
                                onChange={e => handleImageFile(e, setHeroImagePreview)}
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
