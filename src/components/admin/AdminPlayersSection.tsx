import { useEffect, useState } from 'react';
import { listClubs } from '../../services/clubService';
import { listTeams, type TeamListResponse } from '../../services/teamService';
import {
    listPlayers,
    type PlayerListResponse,
    type PositionEnum,
    type GenderEnum,
} from '../../services/playerService';
import AdminPlayerFormSection, { type PlayerFormData } from './AdminPlayerFormSection';

const KOTAN_CLUB_NAME = 'Kotan Ozorków';
const PAGE_SIZE = 10;

const POSITION_LABEL: Record<PositionEnum, string> = {
    GOALKEEPER: 'GK',
    DEFENDER:   'DEF',
    MIDFIELDER: 'MID',
    STRIKER:    'FWD',
};

const POSITION_BADGE: Record<PositionEnum, { bg: string; color: string }> = {
    STRIKER:    { bg: 'rgba(239,68,68,0.12)',  color: '#b91c1c' },
    DEFENDER:   { bg: 'rgba(34,197,94,0.12)',  color: '#15803d' },
    GOALKEEPER: { bg: 'rgba(59,130,246,0.12)', color: '#1d4ed8' },
    MIDFIELDER: { bg: 'rgba(249,115,22,0.12)', color: '#c2410c' },
};

const AdminPlayersSection = () => {
    const [showCreate, setShowCreate]   = useState(false);
    const [editPlayer, setEditPlayer]   = useState<PlayerFormData | null>(null);

    const [players, setPlayers]         = useState<PlayerListResponse[]>([]);
    const [total, setTotal]             = useState(0);
    const [loading, setLoading]         = useState(false);
    const [page, setPage]               = useState(1);
    const [refreshKey, setRefreshKey]   = useState(0);

    const [teams, setTeams]             = useState<TeamListResponse[]>([]);
    const [filterTeamId, setFilterTeamId]       = useState('');
    const [filterPosition, setFilterPosition]   = useState<PositionEnum | ''>('');
    const [filterGender, setFilterGender]       = useState<GenderEnum | ''>('');

    // Load Kotan club's teams for the filter dropdown
    useEffect(() => {
        listClubs(1, 100).then(({ data }) => {
            const kotan = data.find(c => c.name === KOTAN_CLUB_NAME) ?? data[0];
            if (!kotan) return;
            listTeams(kotan.id, 1, 100).then(({ data: tData }) => setTeams(tData));
        });
    }, []);

    // Load players whenever filters / page change
    useEffect(() => {
        setLoading(true);
        listPlayers(page, PAGE_SIZE, {
            teamId:   filterTeamId   || undefined,
            position: filterPosition || undefined,
            gender:   filterGender   || undefined,
        })
            .then(({ data, count }) => { setPlayers(data); setTotal(count); })
            .catch(() => { setPlayers([]); setTotal(0); })
            .finally(() => setLoading(false));
    }, [page, filterTeamId, filterPosition, filterGender, refreshKey]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    if (showCreate) {
        return (
            <AdminPlayerFormSection
                teams={teams}
                onBack={() => setShowCreate(false)}
                onSaved={() => { setRefreshKey(k => k + 1); setShowCreate(false); }}
            />
        );
    }

    if (editPlayer) {
        return (
            <AdminPlayerFormSection
                player={editPlayer}
                teams={teams}
                onBack={() => setEditPlayer(null)}
                onSaved={() => { setRefreshKey(k => k + 1); setEditPlayer(null); }}
            />
        );
    }

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
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 500, color: '#404752', marginBottom: '0.375rem' }}>
                        <span>Admin</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>chevron_right</span>
                        <span style={{ color: '#0061a3' }}>Zawodnicy</span>
                    </nav>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                        Katalog Zawodników
                    </h2>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#404752' }}>
                        Zarządzaj profilami i statystykami zawodników akademii.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,97,163,0.2)' }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>add</span>
                    Dodaj zawodnika
                </button>
            </div>

            {/* Filters */}
            <div style={{ background: '#f1f3fb', padding: '1rem', borderRadius: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    {
                        label: 'Zespół',
                        node: (
                            <select style={selectStyle} value={filterTeamId} onChange={e => { setFilterTeamId(e.target.value); setPage(1); }}>
                                <option value=''>Wszystkie</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        ),
                    },
                    {
                        label: 'Pozycja',
                        node: (
                            <select style={selectStyle} value={filterPosition} onChange={e => { setFilterPosition(e.target.value as PositionEnum | ''); setPage(1); }}>
                                <option value=''>Wszystkie</option>
                                <option value='GOALKEEPER'>GK</option>
                                <option value='DEFENDER'>DEF</option>
                                <option value='MIDFIELDER'>MID</option>
                                <option value='STRIKER'>FWD</option>
                            </select>
                        ),
                    },
                    {
                        label: 'Płeć',
                        node: (
                            <select style={selectStyle} value={filterGender} onChange={e => { setFilterGender(e.target.value as GenderEnum | ''); setPage(1); }}>
                                <option value=''>Wszystkie</option>
                                <option value='MEN'>Mężczyźni</option>
                                <option value='WOMEN'>Kobiety</option>
                            </select>
                        ),
                    },
                ].map(f => (
                    <div key={f.label} style={{ background: '#fff', padding: '0.75rem 1rem', borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', minWidth: '160px', flex: '1 1 160px' }}>
                        <label style={{ fontSize: '10px', fontWeight: 700, color: '#404752', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</label>
                        {f.node}
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f1f3fb' }}>
                                {['Zdjęcie', 'Imię i Nazwisko', 'Nr', 'Pozycja', 'Akcje'].map(col => (
                                    <th key={col} style={{ padding: '1rem 1.5rem', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', textAlign: col === 'Akcje' ? 'right' : col === 'Nr' ? 'center' : 'left', whiteSpace: 'nowrap' }}>
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
                            ) : players.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                        Brak zawodników
                                    </td>
                                </tr>
                            ) : players.map((player, i) => {
                                const badge = POSITION_BADGE[player.position];
                                return (
                                    <tr
                                        key={player.id}
                                        style={{ borderTop: i > 0 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                                        onClick={() => setEditPlayer({
                                            id: player.id,
                                            firstName: player.firstName,
                                            lastName: player.lastName,
                                            birthDate: '',
                                            gender: 'MALE',
                                            season: '',
                                            teamId: filterTeamId,
                                            teamName: '',
                                            position: player.position,
                                            number: player.jerseyNumber,
                                            isCaptain: false,
                                            avatarUrl: player.photo ?? undefined,
                                        })}
                                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f1f3fb'}
                                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                                    >
                                        {/* Photo */}
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {player.photo ? (
                                                <img src={player.photo} alt="Player" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span className="material-symbols-outlined" style={{ color: '#cbd5e1', fontSize: '1.25rem' }}>person</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Name */}
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', margin: 0 }}>{player.firstName}</p>
                                            <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#181c21', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0.125rem 0 0' }}>{player.lastName}</p>
                                        </td>

                                        {/* Number */}
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: '1.25rem', color: 'rgba(0,97,163,0.35)' }}>
                                                {player.jerseyNumber}
                                            </span>
                                        </td>

                                        {/* Position */}
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ display: 'inline-flex', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '10px', fontWeight: 900, background: badge.bg, color: badge.color, textTransform: 'uppercase' }}>
                                                {POSITION_LABEL[player.position]}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                                <button
                                                    onClick={e => e.stopPropagation()}
                                                    style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,97,163,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#0061a3'; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                                                </button>
                                                <button
                                                    onClick={e => e.stopPropagation()}
                                                    style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#ba1a1a'; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
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
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(241,243,251,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '0.75rem', color: '#404752', fontWeight: 500, margin: 0 }}>
                        Wyświetlono <strong style={{ color: '#181c21' }}>{total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}</strong> z {total} zawodników
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_left</span>
                        </PgBtn>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <PgBtn key={p} active={page === p} onClick={() => setPage(p)}>{p}</PgBtn>
                        ))}
                        <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>chevron_right</span>
                        </PgBtn>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {[
                    { icon: 'group',            iconBg: 'rgba(0,97,163,0.1)',    iconColor: '#0061a3', label: 'Aktywni Zawodnicy', value: String(total) },
                    { icon: 'star',             iconBg: 'rgba(133,84,0,0.1)',    iconColor: '#855400', label: 'Top Prospekty',     value: '—' },
                    { icon: 'medical_services', iconBg: 'rgba(239,68,68,0.1)',   iconColor: '#dc2626', label: 'Kontuzjowani',      value: '—' },
                ].map(card => (
                    <div key={card.label} style={{ background: '#f1f3fb', padding: '1.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: card.iconColor }}>{card.icon}</span>
                        </div>
                        <div>
                            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', margin: 0 }}>{card.label}</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: "'Manrope', sans-serif", margin: '0.125rem 0 0', color: '#181c21' }}>{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PgBtn = ({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) => (
    <button onClick={onClick} disabled={disabled} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', border: active ? 'none' : '1px solid #e2e8f0', background: active ? '#0061a3' : '#fff', color: active ? '#fff' : '#475569', fontSize: '0.75rem', fontWeight: 700, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
        {children}
    </button>
);

export default AdminPlayersSection;
