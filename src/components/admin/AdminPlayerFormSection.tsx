import { useRef, useState } from 'react';

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
export type PlayerGender = 'MALE' | 'FEMALE';

export interface PlayerFormData {
    id?: string;
    firstName: string;
    lastName: string;
    birthYear: string;
    gender: PlayerGender;
    season: string;
    teamName: string;
    position: Position | '';
    number: string;
    isCaptain: boolean;
    avatarUrl?: string;
}

interface Props {
    /** If provided → edit mode; omit or null → create mode */
    player?: PlayerFormData | null;
    onBack: () => void;
    onSaved: (data: PlayerFormData) => void;
}

const BIRTH_YEARS = Array.from({ length: 20 }, (_, i) => String(2014 - i));
const SEASONS = ['2025/2026', '2024/2025', '2023/2024'];

const POS_CONFIG: { key: Position; label: string; activeBg: string; activeColor: string; idleBg: string; idleColor: string; border: string }[] = [
    { key: 'GK',  label: 'GK',  activeBg: '#eab308', activeColor: '#fff', idleBg: 'rgba(234,179,8,0.1)',   idleColor: '#a16207', border: '#eab308' },
    { key: 'DEF', label: 'DEF', activeBg: '#3b82f6', activeColor: '#fff', idleBg: 'rgba(59,130,246,0.1)',  idleColor: '#1d4ed8', border: '#3b82f6' },
    { key: 'MID', label: 'MID', activeBg: '#22c55e', activeColor: '#fff', idleBg: 'rgba(34,197,94,0.1)',   idleColor: '#15803d', border: '#22c55e' },
    { key: 'FWD', label: 'FWD', activeBg: '#ef4444', activeColor: '#fff', idleBg: 'rgba(239,68,68,0.1)',   idleColor: '#b91c1c', border: '#ef4444' },
];

const EMPTY: PlayerFormData = {
    firstName: '', lastName: '', birthYear: '2010',
    gender: 'MALE', season: '2025/2026', teamName: '',
    position: '', number: '', isCaptain: false,
};

const AdminPlayerFormSection = ({ player, onBack, onSaved }: Props) => {
    const isEdit = Boolean(player?.id);
    const initial = player ?? EMPTY;

    const [firstName, setFirstName] = useState(initial.firstName);
    const [lastName,  setLastName]  = useState(initial.lastName);
    const [birthYear, setBirthYear] = useState(initial.birthYear || '2010');
    const [gender,    setGender]    = useState<PlayerGender>(initial.gender || 'MALE');
    const [season,    setSeason]    = useState(initial.season || SEASONS[0]);
    const [teamName,  setTeamName]  = useState(initial.teamName);
    const [position,  setPosition]  = useState<Position | ''>(initial.position);
    const [number,    setNumber]    = useState(initial.number);
    const [isCaptain, setIsCaptain] = useState(initial.isCaptain);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(initial.avatarUrl ?? null);
    const [dropHover, setDropHover] = useState(false);
    const [saving, setSaving]       = useState(false);
    const [errors, setErrors]       = useState<Record<string, string>>({});

    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setAvatarPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!firstName.trim()) e.firstName = 'Required';
        if (!lastName.trim())  e.lastName  = 'Required';
        if (!position)         e.position  = 'Select a position';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        // TODO: wire to playerService.createPlayer / editPlayer
        await new Promise(r => setTimeout(r, 600));
        setSaving(false);
        onSaved({ ...initial, firstName, lastName, birthYear, gender, season, teamName, position, number, isCaptain, avatarUrl: avatarPreview ?? undefined });
    };

    /* ── shared styles ─────────────────────────────────────── */
    const inputStyle = (hasErr?: boolean): React.CSSProperties => ({
        width: '100%', boxSizing: 'border-box',
        background: '#f1f3fb',
        border: hasErr ? '2px solid #ba1a1a' : '2px solid transparent',
        borderRadius: '0.625rem', padding: '0.75rem 1rem',
        fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
        outline: 'none', color: '#181c21', transition: 'background 0.15s, border-color 0.15s',
    });

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '10px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.12em',
        color: '#404752', marginBottom: '0.375rem', paddingLeft: '0.25rem',
    };

    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '0.875rem',
        padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        border: '1px solid rgba(192,199,212,0.15)',
        borderBottom: '2px solid transparent',
        transition: 'border-bottom-color 0.2s',
    };

    const sectionIconStyle = (bg: string, color: string): React.CSSProperties => ({
        width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    });

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* ── Top bar ── */}
            <header style={{ background: '#f8f9ff', borderBottom: '1px solid #f1f3fb', padding: '0 2rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#404752' }}>
                    <button
                        onClick={onBack}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#404752', fontWeight: 500, fontSize: '0.875rem', padding: 0, fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0061a3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#404752'}
                    >
                        Zawodnicy
                    </button>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                    <span style={{ color: '#181c21', fontWeight: 700 }}>
                        {isEdit ? `${firstName || initial.firstName} ${lastName || initial.lastName}` : 'Dodaj zawodnika'}
                    </span>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                        onClick={onBack}
                        style={{ padding: '0.5rem 1.25rem', background: 'none', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#404752', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 12px rgba(0,97,163,0.2)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>save</span>
                        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Player'}
                    </button>
                </div>
            </header>

            {/* ── Page body ── */}
            <div style={{ padding: '2.5rem', maxWidth: '72rem', margin: '0 auto' }}>

                {/* Breadcrumb + heading */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem' }}>
                    {['Admin', 'Zawodnicy', isEdit ? 'Edytuj zawodnika' : 'Dodaj zawodnika'].map((crumb, i, arr) => (
                        <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: i === arr.length - 1 ? '#0061a3' : '#707883' }}>{crumb}</span>
                            {i < arr.length - 1 && <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#c0c7d4' }}>chevron_right</span>}
                        </span>
                    ))}
                </nav>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.03em', margin: 0 }}>
                        {isEdit ? 'Edit Player Profile' : 'Add New Player'}
                    </h1>
                    <p style={{ color: '#404752', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
                        {isEdit ? 'Update player details in the Academy Performance Ledger.' : 'Register a new talent into the Academy Performance Ledger.'}
                    </p>
                </div>

                {/* ── Asymmetric grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Section 1: Identity */}
                        <div
                            style={cardStyle}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(0,97,163,0.2)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                <div style={sectionIconStyle('rgba(0,97,163,0.1)', '#0061a3')}>
                                    <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>person</span>
                                </div>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity Details</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                                <div>
                                    <label style={labelStyle}>First Name</label>
                                    <input
                                        style={inputStyle(!!errors.firstName)}
                                        placeholder="e.g. Robert"
                                        value={firstName}
                                        onChange={e => { setFirstName(e.target.value); setErrors(v => ({ ...v, firstName: '' })); }}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; if (!errors.firstName) (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    />
                                    {errors.firstName && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', margin: '0.25rem 0 0 0.25rem' }}>{errors.firstName}</p>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Last Name</label>
                                    <input
                                        style={inputStyle(!!errors.lastName)}
                                        placeholder="e.g. Lewandowski"
                                        value={lastName}
                                        onChange={e => { setLastName(e.target.value); setErrors(v => ({ ...v, lastName: '' })); }}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; if (!errors.lastName) (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    />
                                    {errors.lastName && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', margin: '0.25rem 0 0 0.25rem' }}>{errors.lastName}</p>}
                                </div>

                                <div>
                                    <label style={labelStyle}>Birth Year</label>
                                    <select
                                        style={{ ...inputStyle(), cursor: 'pointer' }}
                                        value={birthYear}
                                        onChange={e => setBirthYear(e.target.value)}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    >
                                        {BIRTH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '0.75rem' }}>
                                        {(['MALE', 'FEMALE'] as PlayerGender[]).map(g => (
                                            <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    checked={gender === g}
                                                    onChange={() => setGender(g)}
                                                    style={{ accentColor: '#0061a3', width: '1rem', height: '1rem' }}
                                                />
                                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{g === 'MALE' ? 'Male' : 'Female'}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Team Assignment */}
                        <div
                            style={cardStyle}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(133,84,0,0.2)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                                <div style={sectionIconStyle('rgba(133,84,0,0.1)', '#855400')}>
                                    <span className="material-symbols-outlined" style={{ color: '#855400', fontSize: '1.25rem' }}>sports_soccer</span>
                                </div>
                                <h2 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Assignment</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                                <div>
                                    <label style={labelStyle}>Season</label>
                                    <select
                                        style={{ ...inputStyle(), cursor: 'pointer' }}
                                        value={season}
                                        onChange={e => setSeason(e.target.value)}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    >
                                        {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>Academy Team</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="e.g. U15 Elite"
                                        value={teamName}
                                        onChange={e => setTeamName(e.target.value)}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    />
                                </div>

                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Primary Position</label>
                                    {errors.position && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginBottom: '0.375rem', paddingLeft: '0.25rem' }}>{errors.position}</p>}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                                        {POS_CONFIG.map(pos => {
                                            const active = position === pos.key;
                                            return (
                                                <button
                                                    key={pos.key}
                                                    type="button"
                                                    onClick={() => { setPosition(pos.key); setErrors(v => ({ ...v, position: '' })); }}
                                                    style={{
                                                        padding: '0.625rem 0', borderRadius: '0.625rem',
                                                        border: `2px solid ${pos.border}`,
                                                        background: active ? pos.activeBg : pos.idleBg,
                                                        color: active ? pos.activeColor : pos.idleColor,
                                                        fontSize: '10px', fontWeight: 900, cursor: 'pointer',
                                                        letterSpacing: '0.08em', transition: 'all 0.15s',
                                                        fontFamily: "'Inter', sans-serif",
                                                    }}
                                                    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = pos.activeBg; (e.currentTarget as HTMLElement).style.color = pos.activeColor; }}}
                                                    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = pos.idleBg; (e.currentTarget as HTMLElement).style.color = pos.idleColor; }}}
                                                >
                                                    {pos.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}>Jersey Number</label>
                                    <input
                                        type="number"
                                        style={inputStyle()}
                                        placeholder="99"
                                        value={number}
                                        onChange={e => setNumber(e.target.value)}
                                        onFocus={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; }}
                                        onBlur={e  => { (e.currentTarget as HTMLElement).style.background = '#f1f3fb'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Photo upload */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <div style={sectionIconStyle('rgba(0,97,163,0.1)', '#0061a3')}>
                                    <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.125rem' }}>add_a_photo</span>
                                </div>
                                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Player Photo</h2>
                            </div>

                            <div
                                onClick={() => fileRef.current?.click()}
                                onDragOver={e => { e.preventDefault(); setDropHover(true); }}
                                onDragLeave={() => setDropHover(false)}
                                onDrop={e => { e.preventDefault(); setDropHover(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                                onMouseEnter={() => setDropHover(true)}
                                onMouseLeave={() => setDropHover(false)}
                                style={{ position: 'relative', borderRadius: '0.875rem', overflow: 'hidden', aspectRatio: '1 / 1', background: dropHover ? '#fff' : '#f1f3fb', border: `2px dashed ${dropHover ? '#0061a3' : 'rgba(192,199,212,0.5)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', padding: '1.5rem', textAlign: 'center' }}
                            >
                                {avatarPreview && (
                                    <img src={avatarPreview} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: dropHover ? 0.4 : 1, transition: 'opacity 0.2s' }} />
                                )}
                                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', opacity: avatarPreview && !dropHover ? 0 : 1, transition: 'opacity 0.2s' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: dropHover ? '#0061a3' : '#94a3b8', transition: 'color 0.2s' }}>cloud_upload</span>
                                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#181c21', margin: 0 }}>Drag &amp; drop photo here</p>
                                    <p style={{ fontSize: '10px', color: '#707883', margin: 0 }}>PNG or JPG, max 5MB</p>
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                                        style={{ marginTop: '0.5rem', padding: '0.375rem 0.875rem', background: '#fff', border: '1px solid rgba(192,199,212,0.5)', borderRadius: '0.5rem', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', color: '#404752', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.15s, color 0.15s' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0061a3'; (e.currentTarget as HTMLElement).style.color = '#0061a3'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,199,212,0.5)'; (e.currentTarget as HTMLElement).style.color = '#404752'; }}
                                    >
                                        Select File
                                    </button>
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                            </div>
                        </div>

                        {/* Squad Role */}
                        <div style={cardStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                <div style={sectionIconStyle('rgba(67,96,130,0.1)', '#436082')}>
                                    <span className="material-symbols-outlined" style={{ color: '#436082', fontSize: '1.125rem' }}>stars</span>
                                </div>
                                <h2 style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Squad Role</h2>
                            </div>

                            <div
                                onClick={() => setIsCaptain(v => !v)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: '#f1f3fb', borderRadius: '0.75rem', cursor: 'pointer', transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#ebeef5'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '1.25rem' }}>military_tech</span>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Team Captain</span>
                                </div>
                                <Toggle on={isCaptain} onChange={setIsCaptain} />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', border: 'none', borderRadius: '0.875rem', fontSize: '1rem', fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,97,163,0.25)', transition: 'transform 0.1s', fontFamily: "'Manrope', sans-serif" }}
                                onMouseEnter={e => { if (!saving) (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>save</span>
                                {saving ? 'Saving…' : isEdit ? 'Save Player Profile' : 'Save Player Profile'}
                            </button>
                            <button
                                onClick={onBack}
                                style={{ width: '100%', padding: '1rem', background: '#e5e8f0', border: 'none', borderRadius: '0.875rem', fontSize: '0.875rem', fontWeight: 700, color: '#404752', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif", transition: 'background 0.15s' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#d7dae1'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Toggle switch ──────────────────────────────────────────── */
const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
    <button
        type="button"
        onClick={e => { e.stopPropagation(); onChange(!on); }}
        role="switch"
        aria-checked={on}
        style={{ position: 'relative', width: '2.75rem', height: '1.5rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: on ? '#0061a3' : '#c0c7d4', transition: 'background 0.2s', padding: 0, flexShrink: 0 }}
    >
        <span style={{ position: 'absolute', top: '2px', left: on ? 'calc(100% - 1.25rem - 2px)' : '2px', width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
);

export default AdminPlayerFormSection;
