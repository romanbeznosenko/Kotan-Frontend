const AdminDashboardSection = () => {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif", color: '#181c21', width: '100%', padding: '2.5rem' }}>

            {/* Hero */}
            <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", letterSpacing: '-0.02em', margin: 0 }}>
                        Kotan Ozorków
                    </h2>
                </div>
            </section>

            {/* Stats */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '6rem', height: '6rem', background: 'rgba(0,97,163,0.05)', borderRadius: '50%' }} />
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#404752', marginBottom: '0.25rem' }}>Total Players</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", margin: '0 0 1rem' }}>142</h3>
                </div>

                <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: '#404752', marginBottom: '0.25rem' }}>Active Teams</p>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Manrope', sans-serif", margin: '0 0 1rem' }}>8</h3>
                </div>
            </section>

            {/* Quick actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {[
                    { icon: 'domain_add', label: 'Add New Club', desc: 'Register a new partner club or affiliate program to the academy network.', accent: '#0061a3' },
                    { icon: 'group_add', label: 'Add New Team', desc: 'Create a new age category squad and assign technical staff and captains.', accent: '#46a5fd' },
                ].map((card) => (
                    <div
                        key={card.label}
                        style={{ background: '#f1f3fb', padding: '2rem', borderRadius: '0.75rem', borderBottom: '4px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderBottomColor = card.accent; (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderBottomColor = 'transparent'; (e.currentTarget as HTMLDivElement).style.background = '#f1f3fb'; }}
                    >
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', background: `${card.accent}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.75rem', color: card.accent }}>{card.icon}</span>
                        </div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{card.label}</h4>
                        <p style={{ fontSize: '0.875rem', color: '#404752' }}>{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardSection;
