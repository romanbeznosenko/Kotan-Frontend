import { useEffect, useState } from 'react';
import { listClubs } from '../../services/clubService';
import { listTeams, type AgeGroupEnum, type GenderEnum, type TeamFilters, type TeamListResponse } from '../../services/teamService';
import AdminTeamModalWindow from './AdminTeamModalWindow';
import AdminTeamFormSection from './AdminTeamFormSection';
import AdminTeamCreateSection from './AdminTeamCreateSection';

const AGE_GROUPS: AgeGroupEnum[] = ['U6_U7', 'U8_U9', 'U10_U11', 'U12_U13', 'U14_U15', 'U16_U17', 'U18_U19', 'SENIOR'];
const GENDERS: GenderEnum[] = ['MEN', 'WOMEN'];

const AGE_LABEL: Record<AgeGroupEnum, string> = {
    U6_U7: 'U6/U7', U8_U9: 'U8/U9', U10_U11: 'U10/U11', U12_U13: 'U12/U13',
    U14_U15: 'U14/U15', U16_U17: 'U16/U17', U18_U19: 'U18/U19', SENIOR: 'Senior',
};

const AGE_BADGE_COLOR: Record<string, { bg: string; color: string }> = {
    U6_U7:   { bg: 'rgba(133,84,0,0.1)', color: '#855400' },
    U8_U9:   { bg: 'rgba(133,84,0,0.1)', color: '#855400' },
    U10_U11: { bg: 'rgba(133,84,0,0.1)', color: '#855400' },
    U12_U13: { bg: 'rgba(133,84,0,0.1)', color: '#855400' },
    U14_U15: { bg: 'rgba(0,97,163,0.12)', color: '#0061a3' },
    U16_U17: { bg: 'rgba(0,97,163,0.12)', color: '#0061a3' },
    U18_U19: { bg: 'rgba(0,97,163,0.12)', color: '#0061a3' },
    SENIOR:  { bg: '#e0e2ea', color: '#404752' },
};

const KOTAN_CLUB_NAME = 'Kotan Ozorków';

interface ClubOption { id: string; name: string; }
interface TeamRow extends TeamListResponse { clubId: string; clubName: string; }

const PAGE_SIZE = 10;

const AdminTeamsSection = () => {
    const [clubs, setClubs] = useState<ClubOption[]>([]);
    const [selectedClubId, setSelectedClubId] = useState<string>('');
    const [selectedClubName, setSelectedClubName] = useState<string>('');
    const [teams, setTeams] = useState<TeamRow[]>([]);
    const [total, setTotal] = useState(0);
    const [filterGender, setFilterGender] = useState<GenderEnum | ''>('');
    const [filterAge, setFilterAge] = useState<AgeGroupEnum | ''>('');
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeamId, setEditTeamId] = useState<string | undefined>();
    const [modalClubId, setModalClubId] = useState('');
    const [formTeam, setFormTeam] = useState<{ clubId: string; teamId: string; clubName: string } | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    // Load clubs, auto-select "Kotan Ozorków"
    useEffect(() => {
        listClubs(1, 100).then(({ data }) => {
            const opts = data.map(c => ({ id: c.id, name: c.name }));
            setClubs(opts);
            const kotan = opts.find(c => c.name === KOTAN_CLUB_NAME) ?? opts[0];
            if (kotan) { setSelectedClubId(kotan.id); setSelectedClubName(kotan.name); }
        });
    }, []);

    // Load teams for selected club with server-side filters
    useEffect(() => {
        if (!selectedClubId) return;
        const filters: TeamFilters = {};
        if (filterGender) filters.gender = filterGender;
        if (filterAge) filters.ageGroup = filterAge;
        listTeams(selectedClubId, page, PAGE_SIZE, filters).then(({ data, count }) => {
            const clubName = clubs.find(c => c.id === selectedClubId)?.name ?? selectedClubName;
            setTeams(data.map(t => ({ ...t, clubId: selectedClubId, clubName })));
            setTotal(count);
        });
    }, [selectedClubId, page, refreshKey, filterGender, filterAge]);

    const handleClubChange = (id: string) => {
        setSelectedClubId(id);
        setSelectedClubName(clubs.find(c => c.id === id)?.name ?? '');
        setPage(1);
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paged = teams;

    const openAdd = () => setShowCreate(true);

    const openEdit = (team: TeamRow) => {
        setFormTeam({ clubId: team.clubId, teamId: team.id, clubName: team.clubName });
    };

    // Chart: count teams per age group bucket
    const buckets = [
        { label: 'U6–U11', groups: ['U6_U7', 'U8_U9', 'U10_U11'] as AgeGroupEnum[] },
        { label: 'U12–U13', groups: ['U12_U13'] as AgeGroupEnum[] },
        { label: 'U14–U17', groups: ['U14_U15', 'U16_U17'] as AgeGroupEnum[] },
        { label: 'U18+/Senior', groups: ['U18_U19', 'SENIOR'] as AgeGroupEnum[] },
    ];
    const maxBucket = Math.max(...buckets.map(b => teams.filter(t => b.groups.includes(t.ageGroup)).length), 1);

    const selectStyle: React.CSSProperties = {
        background: 'transparent', border: 'none', fontSize: '0.875rem',
        fontWeight: 600, outline: 'none', cursor: 'pointer', width: '100%',
        fontFamily: "'Inter', sans-serif",
    };

    if (showCreate) {
        return (
            <AdminTeamCreateSection
                defaultClubId={selectedClubId}
                onBack={() => setShowCreate(false)}
                onSaved={() => { setRefreshKey(k => k + 1); setShowCreate(false); }}
            />
        );
    }

    if (formTeam) {
        return (
            <AdminTeamFormSection
                clubId={formTeam.clubId}
                teamId={formTeam.teamId}
                clubName={formTeam.clubName}
                onBack={() => setFormTeam(null)}
                onSaved={() => { setRefreshKey(k => k + 1); setFormTeam(null); }}
            />
        );
    }

    return (
        <>
            <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', padding: '2rem', background: '#f8f9ff', minHeight: '100%', boxSizing: 'border-box', width: '100%' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>Zespoły</h2>
                    </div>
                    <button
                        onClick={openAdd}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add_circle</span>
                        Add Team
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        {
                            label: 'Club',
                            node: (
                                <select style={selectStyle} value={selectedClubId} onChange={e => handleClubChange(e.target.value)}>
                                    {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            ),
                        },
                        {
                            label: 'Gender',
                            node: (
                                <select style={selectStyle} value={filterGender} onChange={e => { setFilterGender(e.target.value as GenderEnum | ''); setPage(1); setRefreshKey(k => k + 1); }}>
                                    <option value="">All</option>
                                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            ),
                        },
                        {
                            label: 'Category',
                            node: (
                                <select style={selectStyle} value={filterAge} onChange={e => { setFilterAge(e.target.value as AgeGroupEnum | ''); setPage(1); setRefreshKey(k => k + 1); }}>
                                    <option value="">All</option>
                                    {AGE_GROUPS.map(g => <option key={g} value={g}>{AGE_LABEL[g]}</option>)}
                                </select>
                            ),
                        },
                    ].map(f => (
                        <div key={f.label} style={{ background: '#f1f3fb', padding: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#ebeef5'}
                            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#f1f3fb'}
                        >
                            <label style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</label>
                            {f.node}
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f1f3fb' }}>
                                    {['Photo', 'Name', 'Category', 'Gender', 'Coach', 'Actions'].map(col => (
                                        <th key={col} style={{ padding: '1rem 1.5rem', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', textAlign: col === 'Actions' ? 'right' : 'left', whiteSpace: 'nowrap' }}>
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paged.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                            {selectedClubId ? 'Brak zespołów' : 'Wybierz klub'}
                                        </td>
                                    </tr>
                                ) : paged.map((team, i) => {
                                    const badge = AGE_BADGE_COLOR[team.ageGroup] ?? { bg: '#f1f3fb', color: '#404752' };
                                    return (
                                        <tr
                                            key={team.id}
                                            style={{ borderTop: i > 0 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f1f3fb'}
                                            onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                                            onClick={() => openEdit(team)}
                                        >
                                            {/* Photo */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ width: '4rem', height: '3rem', borderRadius: '0.75rem', background: '#f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.5rem' }}>groups</span>
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', margin: 0 }}>{team.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: '#404752', margin: '0.125rem 0 0' }}>{team.clubName}</p>
                                            </td>

                                            {/* Category */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                                                    {AGE_LABEL[team.ageGroup]}
                                                </span>
                                            </td>

                                            {/* Gender */}
                                            <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{team.gender}</td>

                                            {/* Coach */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: '#e2e8f0', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#404752' }}>{team.coachName || '—'}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem', opacity: 0, transition: 'opacity 0.15s' }}
                                                    ref={el => {
                                                        if (!el) return;
                                                        const row = el.closest('tr') as HTMLTableRowElement;
                                                        row.addEventListener('mouseenter', () => el.style.opacity = '1');
                                                        row.addEventListener('mouseleave', () => el.style.opacity = '0');
                                                    }}
                                                >
                                                    <button
                                                        onClick={e => { e.stopPropagation(); openEdit(team); }}
                                                        style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', borderRadius: '0.5rem', display: 'flex' }}
                                                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#0061a3'}
                                                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ padding: '1rem 1.5rem', background: 'rgba(241,243,251,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '0.75rem', color: '#404752', fontWeight: 500, margin: 0 }}>
                            Showing <strong style={{ color: '#181c21' }}>{total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} – {Math.min(page * PAGE_SIZE, total)}</strong> of {total} teams
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
            </div>

            <AdminTeamModalWindow
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => { setRefreshKey(k => k + 1); setModalOpen(false); }}
                clubId={modalClubId}
                teamId={editTeamId}
            />
        </>
    );
};

const PgBtn = ({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) => (
    <button onClick={onClick} disabled={disabled} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0061a3' : '#fff', color: active ? '#fff' : '#475569', fontSize: '0.75rem', fontWeight: 700, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {children}
    </button>
);

export default AdminTeamsSection;
