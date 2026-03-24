import { useEffect, useRef, useState } from 'react';
import { listClubs } from '../../services/clubService';
import { createTeam, type AgeGroupEnum, type GenderEnum } from '../../services/teamService';

const AGE_GROUPS: { label: string; value: AgeGroupEnum }[] = [
    { label: 'U6/U7',   value: 'U6_U7'   },
    { label: 'U8/U9',   value: 'U8_U9'   },
    { label: 'U10/U11', value: 'U10_U11' },
    { label: 'U12/U13', value: 'U12_U13' },
    { label: 'U14/U15', value: 'U14_U15' },
    { label: 'U16/U17', value: 'U16_U17' },
    { label: 'U18/U19', value: 'U18_U19' },
    { label: 'Senior',  value: 'SENIOR'  },
];

const toSlug = (v: string) =>
    v.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

interface ClubOption { id: string; name: string; }

interface Props {
    defaultClubId?: string;
    onBack: () => void;
    onSaved: () => void;
}

const AdminTeamCreateSection = ({ defaultClubId = '', onBack, onSaved }: Props) => {
    const [clubs, setClubs] = useState<ClubOption[]>([]);
    const [clubId, setClubId] = useState(defaultClubId);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [ageGroup, setAgeGroup] = useState<AgeGroupEnum>('U14_U15');
    const [gender, setGender] = useState<GenderEnum>('MEN');
    const [coachName, setCoachName] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [coverHover, setCoverHover] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        listClubs(1, 100).then(({ data }) => {
            const opts = data.map(c => ({ id: c.id, name: c.name }));
            setClubs(opts);
            if (!clubId && opts.length > 0) setClubId(opts[0].id);
        });
    }, []);

    const handleNameChange = (v: string) => {
        setName(v);
        setSlug(toSlug(v));
    };

    const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!clubId) e.clubId = 'Select a club';
        if (!name.trim()) e.name = 'Team name is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await createTeam(clubId, { name: name.trim(), ageGroup, gender, coachName: coachName.trim() || undefined }, coverFile);
            onSaved();
        } finally {
            setSaving(false);
        }
    };

    /* ── styles ─────────────────────────────────────────────── */
    const inputStyle = (hasErr?: boolean): React.CSSProperties => ({
        width: '100%', boxSizing: 'border-box',
        background: '#f1f3fb', border: hasErr ? '1px solid #ba1a1a' : 'none',
        borderRadius: '0.625rem', padding: '0.75rem 1rem',
        fontSize: '0.875rem', fontFamily: "'Inter', sans-serif",
        outline: 'none', color: '#181c21',
        transition: 'background 0.2s',
    });

    const selectStyle: React.CSSProperties = {
        ...inputStyle(), cursor: 'pointer',
    };

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

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* Top bar */}
            <header style={{ background: '#f8f9ff', borderBottom: '1px solid #f1f3fb', padding: '0 2rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
                <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#404752' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#404752', fontWeight: 500, fontSize: '0.875rem', padding: 0, fontFamily: "'Inter', sans-serif" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0061a3'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#404752'}
                    >
                        Zespoły
                    </button>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                    <span style={{ color: '#181c21', fontWeight: 700 }}>Dodaj nowy zespół</span>
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
                        style={{ padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 12px rgba(0,97,163,0.2)' }}
                    >
                        {saving ? 'Saving…' : 'Save Team'}
                    </button>
                </div>
            </header>

            {/* Page body */}
            <div style={{ padding: '2rem', maxWidth: '72rem', margin: '0 auto' }}>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Create Academy Team</h2>
                    <p style={{ color: '#404752', marginTop: '0.25rem', fontSize: '0.875rem' }}>Register a new squad to the Athletic Archive ledger.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>

                    {/* ── Left column ───────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Basic Information */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>
                                <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>info</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Basic Information</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                                {/* Club selector — full width */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Club Selection</label>
                                    <select
                                        style={{ ...selectStyle, border: errors.clubId ? '1px solid #ba1a1a' : 'none' }}
                                        value={clubId}
                                        onChange={e => { setClubId(e.target.value); setErrors(v => ({ ...v, clubId: '' })); }}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    >
                                        <option value="">Select parent club…</option>
                                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                    {errors.clubId && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.clubId}</p>}
                                </div>

                                {/* Team name */}
                                <div>
                                    <label style={labelStyle}>Team Name</label>
                                    <input
                                        style={inputStyle(!!errors.name)}
                                        placeholder="e.g. Warsaw Eagles U15"
                                        value={name}
                                        onChange={e => { handleNameChange(e.target.value); setErrors(v => ({ ...v, name: '' })); }}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                    {errors.name && <p style={{ color: '#ba1a1a', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.name}</p>}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label style={labelStyle}>Slug (Auto-generated)</label>
                                    <input
                                        style={{ ...inputStyle(), background: '#e5e8f0', color: '#94a3b8', cursor: 'not-allowed' }}
                                        value={slug}
                                        readOnly
                                    />
                                </div>

                                {/* Age group */}
                                <div>
                                    <label style={labelStyle}>Age Group</label>
                                    <select
                                        style={selectStyle}
                                        value={ageGroup}
                                        onChange={e => setAgeGroup(e.target.value as AgeGroupEnum)}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    >
                                        {AGE_GROUPS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                                    </select>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label style={labelStyle}>Gender</label>
                                    <select
                                        style={selectStyle}
                                        value={gender}
                                        onChange={e => setGender(e.target.value as GenderEnum)}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    >
                                        <option value="MEN">Men</option>
                                        <option value="WOMEN">Women</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        {/* Staff & Training */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>
                                <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>tactic</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff &amp; Training</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                                {/* Coach — full width */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>Head Coach Name</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="Full name of the coach"
                                        value={coachName}
                                        onChange={e => setCoachName(e.target.value)}
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Birth Year Range</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="e.g. 2010–2011"
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Training Location</label>
                                    <input
                                        style={inputStyle()}
                                        placeholder="Primary pitch or facility"
                                        onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                        onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Description */}
                        <div style={cardStyle}>
                            <div style={cardTitleStyle}>
                                <span className="material-symbols-outlined" style={{ color: '#0061a3', fontSize: '1.25rem' }}>description</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Narrative &amp; Description</h3>
                            </div>

                            {/* Toolbar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f1f3fb', padding: '0.5rem', borderRadius: '0.5rem 0.5rem 0 0', borderBottom: '1px solid rgba(192,199,212,0.3)' }}>
                                {['format_bold', 'format_italic', 'format_list_bulleted'].map(icon => (
                                    <button key={icon} style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#404752', borderRadius: '0.25rem', display: 'flex' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>{icon}</span>
                                    </button>
                                ))}
                                <div style={{ width: '1px', height: '1rem', background: 'rgba(192,199,212,0.5)', margin: '0 0.25rem' }} />
                                <button style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer', color: '#404752', borderRadius: '0.25rem', display: 'flex' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e5e8f0'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>link</span>
                                </button>
                            </div>
                            <textarea
                                style={{ width: '100%', boxSizing: 'border-box', background: '#f1f3fb', border: 'none', borderRadius: '0 0 0.5rem 0.5rem', padding: '0.75rem 1rem', fontSize: '0.875rem', fontFamily: "'Inter', sans-serif", outline: 'none', resize: 'none', color: '#181c21', lineHeight: 1.6 }}
                                rows={8}
                                placeholder="Describe the team's philosophy, recent achievements, and goals for the season…"
                                onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                            />
                        </div>
                    </div>

                    {/* ── Right column ──────────────────────────────── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Photo upload */}
                        <div style={cardStyle}>
                            <label style={labelStyle}>Team Identity Photo</label>
                            <div
                                onClick={() => fileRef.current?.click()}
                                onMouseEnter={() => setCoverHover(true)}
                                onMouseLeave={() => setCoverHover(false)}
                                style={{ position: 'relative', borderRadius: '0.625rem', overflow: 'hidden', aspectRatio: '16/9', background: '#f1f3fb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${coverHover ? '#0061a3' : 'rgba(192,199,212,0.4)'}`, cursor: 'pointer', transition: 'border-color 0.2s', marginTop: '0.5rem' }}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : null}
                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', opacity: coverPreview && !coverHover ? 0 : 1, transition: 'opacity 0.2s' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: coverHover ? '#0061a3' : '#94a3b8', transition: 'color 0.2s' }}>add_a_photo</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#404752' }}>Upload Team Photo</span>
                                    <span style={{ fontSize: '10px', color: '#707883' }}>PNG, JPG up to 10MB</span>
                                </div>
                                {coverPreview && coverHover && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#fff' }}>photo_camera</span>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCover} />
                            </div>
                        </div>

                        {/* Status & Season */}
                        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Active toggle */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label style={{ ...labelStyle, marginBottom: 0 }}>Active Status</label>
                                    <Toggle />
                                </div>
                                <p style={{ fontSize: '10px', color: '#707883', lineHeight: 1.5, margin: 0 }}>
                                    Visible to public scouting profiles and league tables.
                                </p>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #f1f3fb', margin: 0 }} />

                            {/* Season */}
                            <div>
                                <label style={labelStyle}>Current Season</label>
                                <select
                                    style={{ ...selectStyle, padding: '0.625rem 0.75rem' }}
                                    onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                    onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                >
                                    <option>2025/2026</option>
                                    <option>2024/2025</option>
                                </select>
                            </div>

                            {/* League */}
                            <div>
                                <label style={labelStyle}>Registered League</label>
                                <select
                                    style={{ ...selectStyle, padding: '0.625rem 0.75rem' }}
                                    onFocus={e => (e.currentTarget as HTMLElement).style.background = '#fff'}
                                    onBlur={e => (e.currentTarget as HTMLElement).style.background = '#f1f3fb'}
                                >
                                    <option>Regional Youth League I</option>
                                    <option>District Championship</option>
                                    <option>National Academy Series</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── Toggle switch ──────────────────────────────────────────── */
const Toggle = () => {
    const [on, setOn] = useState(true);
    return (
        <button
            onClick={() => setOn(v => !v)}
            style={{
                position: 'relative', width: '2.75rem', height: '1.5rem',
                borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: on ? '#0061a3' : '#c0c7d4',
                transition: 'background 0.2s', padding: 0, flexShrink: 0,
            }}
            role="switch"
            aria-checked={on}
        >
            <span style={{
                position: 'absolute', top: '2px',
                left: on ? 'calc(100% - 1.25rem - 2px)' : '2px',
                width: '1.25rem', height: '1.25rem',
                borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', display: 'block',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
        </button>
    );
};

export default AdminTeamCreateSection;
