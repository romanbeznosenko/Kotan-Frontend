const PRIMARY = '#46a5fd';

const OWN_TEAM = 'Kotan Ozorków';

const TABLE = [
    { pos: 1,  team: 'Legia Warszawa',  p: 10, w: 8, d: 1, l: 1, gf: 24, ga: 8,  pts: 25 },
    { pos: 2,  team: 'Wisła Kraków',    p: 10, w: 7, d: 2, l: 1, gf: 20, ga: 10, pts: 23 },
    { pos: 3,  team: 'Kotan Ozorków',   p: 10, w: 6, d: 2, l: 2, gf: 18, ga: 12, pts: 20 },
    { pos: 4,  team: 'Widzew Łódź',     p: 10, w: 5, d: 3, l: 2, gf: 15, ga: 11, pts: 18 },
    { pos: 5,  team: 'Lech Poznań',     p: 10, w: 4, d: 3, l: 3, gf: 14, ga: 14, pts: 15 },
    { pos: 6,  team: 'Zagłębie Lubin',  p: 10, w: 3, d: 2, l: 5, gf: 10, ga: 16, pts: 11 },
    { pos: 7,  team: 'Śląsk Wrocław',   p: 10, w: 2, d: 2, l: 6, gf:  8, ga: 18, pts:  8 },
    { pos: 8,  team: 'Cracovia',        p: 10, w: 1, d: 1, l: 8, gf:  5, ga: 25, pts:  4 },
];

const LeagueTableSection = () => (
    <section id="tabela" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Tabela Ligi</h2>
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
        }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['#', 'Drużyna', 'M', 'W', 'R', 'P', 'G', 'Pkt'].map((h, i) => (
                                <th key={i} style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: i <= 1 ? 'left' : 'center',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TABLE.map((row) => {
                            const isOwn = row.team === OWN_TEAM;
                            return (
                                <tr
                                    key={row.pos}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        backgroundColor: isOwn ? 'rgba(70,165,253,0.06)' : 'transparent',
                                    }}
                                >
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: row.pos <= 3 ? PRIMARY : '#e2e8f0',
                                            color: row.pos <= 3 ? '#fff' : '#64748b',
                                            fontWeight: 700,
                                            fontSize: '0.75rem',
                                        }}>
                                            {row.pos}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', fontWeight: isOwn ? 700 : 500, color: isOwn ? PRIMARY : '#0f172a', whiteSpace: 'nowrap' }}>
                                        {row.team}
                                    </td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{row.p}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#22c55e', fontWeight: 600 }}>{row.w}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{row.d}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{row.l}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{row.gf}:{row.ga}</td>
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: isOwn ? PRIMARY : '#0f172a' }}>{row.pts}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

export default LeagueTableSection;
