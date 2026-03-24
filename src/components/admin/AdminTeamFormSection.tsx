import { useEffect, useRef, useState } from 'react';
import {
    getTeam, editTeam, uploadTeamCover,
    type AgeGroupEnum, type GenderEnum, type TeamResponse,
} from '../../services/teamService';

const AGE_LABEL: Record<AgeGroupEnum, string> = {
    U6_U7: 'U6/U7', U8_U9: 'U8/U9', U10_U11: 'U10/U11', U12_U13: 'U12/U13',
    U14_U15: 'U14/U15', U16_U17: 'U16/U17', U18_U19: 'U18/U19', SENIOR: 'Senior',
};

const AGE_GROUPS: AgeGroupEnum[] = ['U6_U7', 'U8_U9', 'U10_U11', 'U12_U13', 'U14_U15', 'U16_U17', 'U18_U19', 'SENIOR'];
const GENDERS: GenderEnum[] = ['MEN', 'WOMEN'];

interface Props {
    clubId: string;
    teamId: string;
    clubName?: string;
    onBack: () => void;
    onSaved: () => void;
}

const AdminTeamFormSection = ({ clubId, teamId, clubName = '', onBack, onSaved }: Props) => {
    const [team, setTeam] = useState<TeamResponse | null>(null);
    const [name, setName] = useState('');
    const [ageGroup, setAgeGroup] = useState<AgeGroupEnum>('SENIOR');
    const [gender, setGender] = useState<GenderEnum>('MEN');
    const [coachName, setCoachName] = useState('');
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [pendingCover, setPendingCover] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'players' | 'matches' | 'gallery'>('info');
    const [coverHover, setCoverHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getTeam(clubId, teamId).then(data => {
            setTeam(data);
            setName(data.name);
            setAgeGroup(data.ageGroup);
            setGender(data.gender);
            setCoachName(data.coachName ?? '');
            if (data.coverImage) setCoverPreview(data.coverImage);
        });
    }, [clubId, teamId]);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPendingCover(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await editTeam(clubId, teamId, { name, ageGroup, gender, coachName: coachName || undefined });
            if (pendingCover) await uploadTeamCover(clubId, teamId, pendingCover);
            onSaved();
        } finally {
            setSaving(false);
        }
    };

    const TABS = [
        { key: 'info', label: 'Informacje' },
        { key: 'players', label: 'Zawodnicy' },
        { key: 'matches', label: 'Mecze' },
        { key: 'gallery', label: 'Galeria' },
    ] as const;

    const fieldStyle: React.CSSProperties = {
        width: '100%', background: 'transparent', border: 'none',
        borderBottom: '1px solid #e2e8f0', padding: '0.5rem 0',
        fontSize: '0.9375rem', fontFamily: "'Inter', sans-serif",
        outline: 'none', color: '#181c21', boxSizing: 'border-box',
    };

    const selectFieldStyle: React.CSSProperties = {
        ...fieldStyle, cursor: 'pointer',
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '10px', fontWeight: 700, color: '#94a3b8',
        textTransform: 'uppercase', letterSpacing: '0.12em',
        display: 'block', marginBottom: '0.25rem',
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f1f3fb', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={onBack}
                        style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', color: '#475569' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#f1f3fb'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
                    </button>

                    {/* Badge placeholder */}
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1.5rem' }}>groups</span>
                    </div>

                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
                            {team?.name ?? '…'}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>storefront</span>
                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>{clubName}</span>
                            <span style={{ color: '#cbd5e1' }}>·</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', color: '#94a3b8' }}>location_on</span>
                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                {team ? AGE_LABEL[team.ageGroup] : '—'}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>share</span>
                        Share
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', border: 'none', borderRadius: '0.75rem', padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#fff', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>save</span>
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderBottom: '1px solid #f1f3fb', padding: '0 2rem', display: 'flex', gap: '0' }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
                            color: activeTab === tab.key ? '#0061a3' : '#94a3b8',
                            borderBottom: activeTab === tab.key ? '2px solid #0061a3' : '2px solid transparent',
                            transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Cover image */}
                    <div
                        style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', cursor: 'pointer', aspectRatio: '16/7' }}
                        onClick={() => fileInputRef.current?.click()}
                        onMouseEnter={() => setCoverHover(true)}
                        onMouseLeave={() => setCoverHover(false)}
                    >
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.15)' }}>image</span>
                            </div>
                        )}
                        {/* Hover overlay */}
                        <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: coverHover ? 1 : 0, transition: 'opacity 0.2s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.625rem 1.25rem', borderRadius: '2rem', color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>photo_camera</span>
                                Change Cover
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
                    </div>

                    {/* Form card */}
                    <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: '0 0 1.5rem' }}>Team Information</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem 2rem' }}>

                            {/* Name */}
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={labelStyle}>Team Name</label>
                                <input style={fieldStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Team name" />
                            </div>

                            {/* Club */}
                            <div>
                                <label style={labelStyle}>Club</label>
                                <input style={{ ...fieldStyle, color: '#94a3b8' }} value={clubName} readOnly />
                            </div>

                            {/* Age Group */}
                            <div>
                                <label style={labelStyle}>Age Group</label>
                                <select style={selectFieldStyle} value={ageGroup} onChange={e => setAgeGroup(e.target.value as AgeGroupEnum)}>
                                    {AGE_GROUPS.map(g => <option key={g} value={g}>{AGE_LABEL[g]}</option>)}
                                </select>
                            </div>

                            {/* Gender */}
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select style={selectFieldStyle} value={gender} onChange={e => setGender(e.target.value as GenderEnum)}>
                                    {GENDERS.map(g => <option key={g} value={g}>{g === 'MEN' ? 'Men' : 'Women'}</option>)}
                                </select>
                            </div>

                            {/* Coach */}
                            <div>
                                <label style={labelStyle}>Head Coach</label>
                                <input style={fieldStyle} value={coachName} onChange={e => setCoachName(e.target.value)} placeholder="Coach name" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Players card */}
                    <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0 }}>Players</h3>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#0061a3', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                                Add Player
                            </button>
                        </div>

                        {/* Avatar stack placeholder */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '-0.5rem', marginBottom: '1rem' }}>
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: `hsl(${210 + i * 25}, 60%, 75%)`, border: '2px solid #fff', marginLeft: i > 0 ? '-0.625rem' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: '#fff' }}>person</span>
                                </div>
                            ))}
                            <div style={{ marginLeft: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
                                Roster
                            </div>
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                            Player management is available in the <strong style={{ color: '#475569' }}>Zawodnicy</strong> tab.
                        </p>

                        <button
                            onClick={() => setActiveTab('players')}
                            style={{ marginTop: '1rem', width: '100%', padding: '0.625rem', background: '#f1f3fb', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#0061a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#f1f3fb'}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
                            View Roster
                        </button>
                    </div>

                    {/* Coaching staff card */}
                    <div style={{ background: '#fff', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: 0 }}>Coaching Staff</h3>
                            <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: '#0061a3', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                                Add
                            </button>
                        </div>

                        {coachName ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #f8fafc' }}>
                                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, #0061a3, #46a5fd)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '1rem' }}>person</span>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#181c21' }}>{coachName}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Head Coach</p>
                                </div>
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                                No coaching staff assigned yet.
                            </p>
                        )}
                    </div>

                    {/* Quick navigation card */}
                    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #000 100%)', color: '#fff', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #1e293b' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.75rem' }}>Quick Navigation</span>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Manrope', sans-serif", margin: '0 0 1rem', lineHeight: 1.3 }}>Jump to section</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: activeTab === tab.key ? 'rgba(70,165,253,0.15)' : 'rgba(255,255,255,0.04)',
                                        border: activeTab === tab.key ? '1px solid rgba(70,165,253,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '0.75rem', padding: '0.625rem 0.875rem',
                                        color: activeTab === tab.key ? '#46a5fd' : '#94a3b8',
                                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                                        fontFamily: "'Inter', sans-serif", transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { if (activeTab !== tab.key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { if (activeTab !== tab.key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                >
                                    {tab.label}
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTeamFormSection;
