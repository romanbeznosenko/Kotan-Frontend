import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PRIMARY = '#46a5fd';

const SENIOR_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1c31_dwl0lJUX5PEVuXTk3A20xA8pPb4yFUdiWc_kGPEoJf-FAxyopIdZ5liG8W5nOhxmVa1WYNkXyAUQUlndv3128m84pG-Mg7OE_P46v1qMqk4aiOC47lD1BERIeC8acyzRV32pF1gMKThmljSfzfZNar-Rn0moogg4GFESUXFB4zI9Aj3VIsKvPIms_5MGlGlQ08JMgcDBBxMIW5pBKzzdnfzQ4jbsFTOx64pptbWvF0vUpYSDR67OLIi7xZR6zrPt7ayczxA';

const SectionHeader = ({ title }: { title: string }) => (
    <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    }}>
        <span style={{ width: 6, height: 32, backgroundColor: PRIMARY, borderRadius: 9999, display: 'inline-block', flexShrink: 0 }} />
        {title}
    </h2>
);

const SeniorSection = () => {
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <section style={{ marginBottom: '4rem' }} id="senior">
            <SectionHeader title="Senior Team" />
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.06)',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'row',
                    transition: 'box-shadow 0.2s',
                    flexWrap: 'wrap',
                }}
            >
                {/* Image */}
                <div style={{ flex: '0 0 40%', minWidth: 280, overflow: 'hidden', minHeight: 280 }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        minHeight: 280,
                        backgroundImage: `url('${SENIOR_IMAGE}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.5s ease',
                    }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 260 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Seniorzy</h3>
                            <p style={{ color: PRIMARY, fontWeight: 500, margin: '0.25rem 0 0' }}>Klasa Okręgowa</p>
                        </div>
                        <span style={{
                            backgroundColor: `rgba(70,165,253,0.1)`,
                            color: PRIMARY,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '4px 12px',
                            borderRadius: 9999,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}>
                            Pierwszy Zespół
                        </span>
                    </div>
                    <p style={{ color: '#475569', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                        Główna drużyna reprezentująca barwy Kotan Ozorków w rozgrywkach ligowych. Trzon zespołu stanowią wychowankowie oraz doświadczeni zawodnicy z regionu.
                    </p>
                    <button
                        onClick={() => navigate('/teams/senior')}
                        style={{
                            alignSelf: 'flex-start',
                            height: 40,
                            padding: '0 1.5rem',
                            backgroundColor: PRIMARY,
                            color: '#fff',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'filter 0.2s',
                        }}>
                        Zobacz drużynę
                    </button>
                </div>
            </div>
        </section>
    );
};

export { SectionHeader };
export default SeniorSection;
