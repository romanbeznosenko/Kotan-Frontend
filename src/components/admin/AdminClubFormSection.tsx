import { useEffect, useRef, useState } from 'react';
import { createClubWithLogo, deleteClub, editClub, uploadClubLogo, type ClubListResponse } from '../../services/clubService';

interface Props {
    id?: string;
    initialData?: ClubListResponse;
    onCancel: () => void;
    onSuccess: () => void;
}

const COUNTRIES = [
    { code: 'PL', label: 'Polska (PL)' },
    { code: 'DE', label: 'Niemcy (DE)' },
    { code: 'GB', label: 'Wielka Brytania (GB)' },
    { code: 'ES', label: 'Hiszpania (ES)' },
    { code: 'FR', label: 'Francja (FR)' },
    { code: 'IT', label: 'Włochy (IT)' },
];

const toSlug = (val: string) =>
    val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const AdminClubFormSection = ({ id, initialData, onCancel, onSuccess }: Props) => {
    const isEdit = Boolean(id);

    const [name, setName] = useState(initialData?.name ?? '');
    const [shortName, setShortName] = useState(initialData?.shortName ?? '');
    const [city, setCity] = useState(initialData?.city ?? '');
    const [country, setCountry] = useState(initialData?.country ?? 'PL');
    const [isOurClub, setIsOurClub] = useState(initialData?.isOurClub ?? false);
    const [isOnline, setIsOnline] = useState(initialData?.isOnline ?? false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo ?? null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = 'Nazwa klubu jest wymagana';
        if (!isEdit && !logoFile) errs.logo = 'Logo jest wymagane';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const data = { name, shortName, city, country, isOurClub };
            if (isEdit && id) {
                await editClub(id, data);
                if (logoFile) await uploadClubLogo(id, logoFile);
            } else {
                await createClubWithLogo(data, logoFile ?? undefined);
            }
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        setLoading(true);
        try {
            await deleteClub(id);
            onSuccess();
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', background: '#f1f3fb', border: 'none',
        borderBottom: '2px solid transparent', borderRadius: '0.5rem 0.5rem 0 0',
        padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
        color: '#0f172a', outline: 'none', transition: 'all 0.15s',
        boxSizing: 'border-box',
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '10px', textTransform: 'uppercase',
        letterSpacing: '0.1em', fontWeight: 700, color: '#404752', marginBottom: '0.5rem',
    };

    const sectionStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '1rem', padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    };

    const sectionHeaderIcon: React.CSSProperties = {
        width: '2rem', height: '2rem', borderRadius: '0.5rem',
        background: '#d1e4ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0061a3', flexShrink: 0,
    };

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <div style={{
                width: '2.75rem', height: '1.5rem', borderRadius: '9999px',
                background: checked ? '#0061a3' : '#e2e8f0',
                position: 'relative', transition: 'background 0.2s',
            }}>
                <div style={{
                    position: 'absolute', top: '2px',
                    left: checked ? 'calc(100% - 22px)' : '2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
            </div>
        </label>
    );

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', padding: '2rem', width: '100%', boxSizing: 'border-box', background: '#f8f9ff', minHeight: '100%' }}>

            {/* Breadcrumbs */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                <button
                    onClick={onCancel}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600, fontSize: '0.8125rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>shield</span>
                    Rejestr Klubów
                </button>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#cbd5e1' }}>chevron_right</span>
                <span style={{ color: '#0f172a', fontWeight: 600 }}>
                    {isEdit ? (initialData?.name ?? 'Edytuj klub') : 'Nowy klub'}
                </span>
            </nav>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                        {isEdit ? 'Edytuj klub' : 'Dodaj nowy klub'}
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        Zdefiniuj parametry klubu sportowego, aby rozpocząć zarządzanie jego kadrą i wynikami.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {isEdit && (
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            style={{ padding: '0.625rem 1.25rem', borderRadius: '0.75rem', background: 'rgba(186,26,26,0.08)', border: 'none', color: '#ba1a1a', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                        >
                            Usuń klub
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        style={{ padding: '0.625rem 1.5rem', borderRadius: '0.75rem', background: '#e5e8f0', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', color: '#181c21' }}
                    >
                        Anuluj
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{ padding: '0.625rem 2rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Zapisywanie...' : 'Zapisz klub'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

                {/* ── Left column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Basic info */}
                    <section style={sectionStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={sectionHeaderIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>info</span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0 }}>Informacje podstawowe</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem' }}>
                            <div>
                                <label style={labelStyle}>Nazwa Klubu *</label>
                                <input
                                    style={{ ...inputStyle, borderBottomColor: errors.name ? '#ba1a1a' : undefined }}
                                    placeholder="np. KS Akademia Piłkarska"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    onFocus={e => { e.currentTarget.style.borderBottomColor = '#0061a3'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.background = '#f1f3fb'; }}
                                />
                                {errors.name && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                            </div>

                            <div>
                                <label style={labelStyle}>Skrócona nazwa</label>
                                <input
                                    style={inputStyle}
                                    placeholder="np. KSAP"
                                    value={shortName}
                                    onChange={e => setShortName(e.target.value)}
                                    onFocus={e => { e.currentTarget.style.borderBottomColor = '#0061a3'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.background = '#f1f3fb'; }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Slug (generowany automatycznie)</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: '#f1f3fb', borderRadius: '0.5rem 0.5rem 0 0', borderBottom: '2px solid #e2e8f0', padding: '0 1rem' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '0.875rem', padding: '0.75rem 0.25rem 0.75rem 0', whiteSpace: 'nowrap' }}>athleticarchive.pl/klub/</span>
                                    <input readOnly value={toSlug(name)} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem', padding: '0.75rem 0' }} />
                                    <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.125rem' }}>lock</span>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Miasto</label>
                                <input
                                    style={inputStyle}
                                    placeholder="Warszawa"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                    onFocus={e => { e.currentTarget.style.borderBottomColor = '#0061a3'; e.currentTarget.style.background = '#fff'; }}
                                    onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.background = '#f1f3fb'; }}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Kraj</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }}
                                        onFocus={e => { e.currentTarget.style.borderBottomColor = '#0061a3'; e.currentTarget.style.background = '#fff'; }}
                                        onBlur={e => { e.currentTarget.style.borderBottomColor = 'transparent'; e.currentTarget.style.background = '#f1f3fb'; }}
                                    >
                                        {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', fontSize: '1.25rem' }}>expand_more</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Settings */}
                    <section style={sectionStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={sectionHeaderIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>settings_input_component</span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0 }}>Ustawienia systemowe</h3>
                        </div>

                        {[
                            { label: 'Nasz klub?', desc: 'Zaznacz, jeśli to główny klub Twojej akademii.', checked: isOurClub, onChange: setIsOurClub },
                            { label: 'Widoczny na stronie?', desc: 'Czy klub ma być widoczny w publicznym archiwum i statystykach?', checked: isOnline, onChange: setIsOnline },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '0.75rem', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#f8f9ff'}
                                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                            >
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>{item.label}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{item.desc}</p>
                                </div>
                                <Toggle checked={item.checked} onChange={item.onChange} />
                            </div>
                        ))}
                    </section>
                </div>

                {/* ── Right column ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Logo upload */}
                    <section style={sectionStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={sectionHeaderIcon}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>image</span>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0 }}>Logo Klubu</h3>
                        </div>

                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{ border: '2px dashed #e2e8f0', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', background: '#f8f9ff' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLDivElement).style.borderColor = '#0061a3'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#f8f9ff'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; }}
                        >
                            <div style={{ width: '6rem', height: '6rem', borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
                                {logoPreview
                                    ? <img src={logoPreview} alt="logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    : <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#cbd5e1' }}>add_photo_alternate</span>
                                }
                            </div>
                            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>
                                {logoPreview ? 'Zmień logo' : 'Kliknij lub upuść'}
                            </p>
                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '0.5rem', textAlign: 'center' }}>
                                Zalecany format PNG lub SVG (Min. 400×400px)
                            </p>
                            {errors.logo && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: '0.5rem' }}>{errors.logo}</p>}
                        </div>
                    </section>

                    {/* Preview card */}
                    <section style={{ background: '#0f172a', borderRadius: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', background: 'rgba(0,97,163,0.1)', borderRadius: '50%', filter: 'blur(2rem)' }} />
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, color: '#475569', marginBottom: '1.5rem' }}>Podgląd karty</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                {logoPreview
                                    ? <img src={logoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    : <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.15)' }}>shield</span>
                                }
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", color: '#fff', margin: 0, lineHeight: 1 }}>
                                    {name || 'Nazwa Klubu'}
                                </h4>
                                <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>location_on</span>
                                    {city || 'Miasto'}, {country}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                                <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>Status</p>
                                <p style={{ fontSize: '0.875rem', color: '#46a5fd', fontWeight: 700, marginTop: '0.25rem' }}>W trakcie</p>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem' }}>
                                <p style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', margin: 0 }}>Typ</p>
                                <p style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 700, marginTop: '0.25rem' }}>Akademia</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', marginLeft: '-0.5rem' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: `hsl(220,15%,${30 + i * 8}%)`, border: '2px solid #0f172a', marginLeft: '-0.5rem' }} />
                                ))}
                            </div>
                            <span style={{ fontSize: '10px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>0 Zawodników</span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminClubFormSection;
