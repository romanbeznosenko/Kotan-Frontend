import { useEffect, useRef, useState } from 'react';
import AdminClubFormSection from './AdminClubFormSection';
import { importClubs, listClubs, type ClubFilters, type ClubListResponse } from '../../services/clubService';

const PAGE_SIZE = 10;

const AdminClubsSection = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedClub, setSelectedClub] = useState<ClubListResponse | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [clubs, setClubs] = useState<ClubListResponse[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filters, setFilters] = useState<ClubFilters>({});
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const importInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        listClubs(page, PAGE_SIZE, { ...filters, name: debouncedSearch || undefined }).then(({ data, count }) => {
            setClubs(data);
            setTotal(count);
        });
    }, [page, refreshKey, filters, debouncedSearch]);

    const handleFilterCheck = (key: keyof ClubFilters, value: boolean | undefined) => {
        setPage(1);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleRowClick = (club: ClubListResponse) => {
        setSelectedId(club.id);
        setSelectedClub(club);
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setSelectedId(null);
        setSelectedClub(null);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await importClubs(file);
        setRefreshKey(k => k + 1);
        e.target.value = '';
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const visibleClubs = clubs;

    const btnBase: React.CSSProperties = {
        width: '2rem', height: '2rem', borderRadius: '0.5rem',
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#94a3b8', transition: 'all 0.15s',
    };

    return (
        <>
            {showForm && (
                <AdminClubFormSection
                    id={selectedId ?? undefined}
                    initialData={selectedClub ?? undefined}
                    onCancel={handleClose}
                    onSuccess={() => { setRefreshKey(k => k + 1); handleClose(); }}
                />
            )}
            <div style={{ display: showForm ? 'none' : undefined, fontFamily: "'Inter', sans-serif", color: '#181c21', padding: '2rem', width: '100%', boxSizing: 'border-box', background: '#f8f9ff', minHeight: '100%' }}>

                {/* Action bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                            Rejestr Klubów
                        </h2>
                    </div>
                    <button
                        onClick={() => { setSelectedId(null); setShowForm(true); }}
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #0061a3 0%, #46a5fd 100%)', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(0,97,163,0.2)' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>add</span>
                        Dodaj Klub
                    </button>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', alignItems: 'start' }}>

                    {/* ── Filter sidebar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(100,116,139,0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', margin: '0 0 1rem' }}>
                                Filtrowanie
                            </h3>

                            {/* Search */}
                            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                                <span className="material-symbols-outlined" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}>search</span>
                                <input
                                    placeholder="Szukaj klubu..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: '0.75rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e8f0', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: '#f1f3fb' }}
                                />
                            </div>

                            {[
                                { label: 'Nasz Klub', onChange: (c: boolean) => handleFilterCheck('isOurClub', c || undefined) },
                            ].map(f => (
                                <label key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', border: '1px solid transparent' }}>
                                    <input type="checkbox" onChange={e => f.onChange(e.target.checked)} style={{ accentColor: '#0061a3', width: '1rem', height: '1rem' }} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{f.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Stats widget */}
                        <div style={{ background: '#0061a3', borderRadius: '1rem', padding: '1.5rem', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,97,163,0.15)' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, margin: 0 }}>Łącznie Klubów</p>
                                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", margin: '0.25rem 0 1rem' }}>{total}</h4>
                            </div>
                            <span className="material-symbols-outlined" style={{ position: 'absolute', right: '-1rem', bottom: '-1rem', fontSize: '6rem', color: 'rgba(255,255,255,0.1)', transform: 'rotate(12deg)' }}>shield</span>
                        </div>

                        {/* Import */}
                        <div>
                            <input ref={importInputRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleImport} />
                            <button
                                onClick={() => importInputRef.current?.click()}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: '#fff', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>upload</span>
                                Import CSV / Excel
                            </button>
                        </div>
                    </div>

                    {/* ── Table ── */}
                    <div style={{ background: '#fff', borderRadius: '1rem', border: '1px solid rgba(100,116,139,0.08)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f1f3fb' }}>
                                        {['Logo', 'Nazwa Klubu', 'Skrót', 'Miasto / Kraj', 'Status', 'Akcje'].map(col => (
                                            <th key={col} style={{ padding: '1rem 1.5rem', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#404752', textAlign: col === 'Akcje' ? 'right' : col === 'Status' ? 'center' : 'left', whiteSpace: 'nowrap' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleClubs.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                                                Brak wyników
                                            </td>
                                        </tr>
                                    ) : visibleClubs.map((club, i) => (
                                        <tr
                                            key={club.id}
                                            style={{ borderTop: i > 0 ? '1px solid #f8fafc' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(241,243,251,0.6)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                                            onClick={() => handleRowClick(club)}
                                        >
                                            {/* Logo */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.2rem', overflow: 'hidden' }}>
                                                    {club.logo
                                                        ? <img src={club.logo} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        : <span className="material-symbols-outlined" style={{ fontSize: '1.25rem', color: '#94a3b8' }}>shield</span>
                                                    }
                                                </div>
                                            </td>

                                            {/* Name */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{club.name}</div>
                                                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500, marginTop: '0.125rem' }}>
                                                    ID: {club.id.slice(0, 8).toUpperCase()}
                                                </div>
                                            </td>

                                            {/* Short name */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                                                    {club.shortName || '—'}
                                                </span>
                                            </td>

                                            {/* City / Country */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ fontSize: '0.875rem', color: '#374151' }}>{club.city || '—'}</div>
                                                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, marginTop: '0.125rem' }}>{club.country || ''}</div>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                                    <div style={{ position: 'relative' }} title={club.isOurClub ? 'Nasz Klub' : ''}>
                                                        <span
                                                            className="material-symbols-outlined"
                                                            style={{
                                                                fontSize: '1.125rem',
                                                                color: club.isOurClub ? '#0061a3' : '#e2e8f0',
                                                                fontVariationSettings: club.isOurClub ? "'FILL' 1" : "'FILL' 0",
                                                            }}
                                                        >verified</span>
                                                    </div>
                                                    <div style={{ position: 'relative' }} title={club.isOnline ? 'Online Active' : 'Offline'}>
                                                        <span
                                                            className="material-symbols-outlined"
                                                            style={{
                                                                fontSize: '1.125rem',
                                                                color: club.isOnline ? '#22c55e' : '#e2e8f0',
                                                                fontVariationSettings: club.isOnline ? "'FILL' 1" : "'FILL' 0",
                                                            }}
                                                        >{club.isOnline ? 'cloud_done' : 'cloud_off'}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
                                                    <button
                                                        onClick={e => { e.stopPropagation(); handleRowClick(club); }}
                                                        style={btnBase}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(70,165,253,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = '#0061a3'; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>edit</span>
                                                    </button>
                                                    <button
                                                        onClick={e => e.stopPropagation()}
                                                        style={btnBase}
                                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(186,26,26,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = '#ba1a1a'; }}
                                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div style={{ padding: '1rem 1.5rem', background: '#f1f3fb', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.75rem', color: '#404752', fontWeight: 500 }}>
                                Showing{' '}
                                <strong style={{ color: '#181c21' }}>
                                    {total === 0 ? 0 : Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)}
                                </strong>{' '}
                                of {total} clubs
                            </span>
                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_left</span>
                                </PageBtn>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                    <PageBtn key={p} active={page === p} onClick={() => setPage(p)}>
                                        {p}
                                    </PageBtn>
                                ))}
                                <PageBtn onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>chevron_right</span>
                                </PageBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

const PageBtn = ({ children, onClick, disabled, active }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            width: '2rem', height: '2rem', borderRadius: '0.25rem',
            border: active ? 'none' : '1px solid #e2e8f0',
            background: active ? '#0061a3' : '#fff',
            color: active ? '#fff' : '#475569',
            fontSize: '0.75rem', fontWeight: 700,
            cursor: disabled ? 'default' : 'pointer',
            opacity: disabled ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
        }}
    >
        {children}
    </button>
);

export default AdminClubsSection;
