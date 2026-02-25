import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={{ ...styles.navbar, padding: isMobile ? '16px 20px' : '20px 80px' }}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoIcon}>🏗️</span>
          <span style={{ ...styles.navLogoText, fontSize: isMobile ? '18px' : '22px' }}>Homebuild</span>
        </div>
        <button style={{ ...styles.loginBtn, padding: isMobile ? '8px 16px' : '10px 24px', fontSize: isMobile ? '13px' : '15px' }} onClick={() => navigate('/login')}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div style={{ ...styles.hero, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', padding: isMobile ? '40px 20px' : '80px' }}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🏆 Kenya's #1 Home Construction Platform</div>
          <h1 style={{ ...styles.heroTitle, fontSize: isMobile ? '32px' : '52px' }}>
            Build Your Dream Home <span style={styles.heroHighlight}>With Confidence</span>
          </h1>
          <p style={{ ...styles.heroSub, fontSize: isMobile ? '15px' : '18px' }}>
            Homebuild connects new homeowners with established construction firms.
            We fund 70% of your build, manage the entire construction process,
            and keep you updated every step of the way.
          </p>
          <div style={styles.heroActions}>
            <button style={{ ...styles.heroBtn, padding: isMobile ? '12px 24px' : '16px 32px', fontSize: isMobile ? '14px' : '16px' }} onClick={() => navigate('/login')}>
              Get Started →
            </button>
            <button style={{ ...styles.heroBtnOutline, padding: isMobile ? '12px 24px' : '16px 32px', fontSize: isMobile ? '14px' : '16px' }} onClick={() => {
              document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            }}>
              How It Works
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={{ ...styles.heroStatNumber, fontSize: isMobile ? '22px' : '28px' }}>70%</div>
              <div style={styles.heroStatLabel}>Funded by Us</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={{ ...styles.heroStatNumber, fontSize: isMobile ? '22px' : '28px' }}>100%</div>
              <div style={styles.heroStatLabel}>Transparent</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={{ ...styles.heroStatNumber, fontSize: isMobile ? '22px' : '28px' }}>24/7</div>
              <div style={styles.heroStatLabel}>Progress Tracking</div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div style={styles.heroImageWrapper}>
            <div style={styles.heroCard}>
              <div style={styles.heroCardHeader}>
                <span style={styles.heroCardIcon}>🏠</span>
                <div>
                  <div style={styles.heroCardTitle}>Nairobi, Karen</div>
                  <div style={styles.heroCardSub}>Project Active</div>
                </div>
                <span style={styles.heroCardBadge}>Active</span>
              </div>
              <div style={styles.heroCardProgress}>
                <div style={styles.heroCardProgressLabel}>
                  <span>Foundation Complete</span>
                  <span>25%</span>
                </div>
                <div style={styles.heroCardProgressBar}>
                  <div style={styles.heroCardProgressFill} />
                </div>
              </div>
              <div style={styles.heroCardStats}>
                <div style={styles.heroCardStat}>
                  <div style={styles.heroCardStatValue}>KES 5M</div>
                  <div style={styles.heroCardStatLabel}>Total Cost</div>
                </div>
                <div style={styles.heroCardStat}>
                  <div style={styles.heroCardStatValue}>KES 3.5M</div>
                  <div style={styles.heroCardStatLabel}>Funded</div>
                </div>
                <div style={styles.heroCardStat}>
                  <div style={styles.heroCardStatValue}>KES 1.5M</div>
                  <div style={styles.heroCardStatLabel}>Your Share</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={{ ...styles.section, padding: isMobile ? '48px 20px' : '80px' }}>
        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : '36px' }}>How It Works</h2>
        <p style={styles.sectionSub}>Simple, transparent, and stress-free home building</p>
        <div style={{ ...styles.stepsGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={{ ...styles.stepIcon, fontSize: isMobile ? '28px' : '40px' }}>📄</div>
            <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '13px' : '18px' }}>Submit Your Land</h3>
            <p style={{ ...styles.stepDesc, fontSize: isMobile ? '12px' : '14px' }}>Upload your title deed and submit your property details for verification.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={{ ...styles.stepIcon, fontSize: isMobile ? '28px' : '40px' }}>✅</div>
            <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '13px' : '18px' }}>Get Approved</h3>
            <p style={{ ...styles.stepDesc, fontSize: isMobile ? '12px' : '14px' }}>Our team verifies your documents and connects you with a trusted firm.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={{ ...styles.stepIcon, fontSize: isMobile ? '28px' : '40px' }}>🏗️</div>
            <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '13px' : '18px' }}>Construction Begins</h3>
            <p style={{ ...styles.stepDesc, fontSize: isMobile ? '12px' : '14px' }}>Your engineer uploads progress photos so you can monitor from anywhere.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <div style={{ ...styles.stepIcon, fontSize: isMobile ? '28px' : '40px' }}>🏠</div>
            <h3 style={{ ...styles.stepTitle, fontSize: isMobile ? '13px' : '18px' }}>Move In</h3>
            <p style={{ ...styles.stepDesc, fontSize: isMobile ? '12px' : '14px' }}>Once complete and payments settled, your dream home is yours!</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ ...styles.section, backgroundColor: '#F5F5F5', padding: isMobile ? '48px 20px' : '80px' }}>
        <h2 style={{ ...styles.sectionTitle, fontSize: isMobile ? '26px' : '36px' }}>Why Choose Homebuild</h2>
        <p style={styles.sectionSub}>Everything you need to build with confidence</p>
        <div style={{ ...styles.featuresGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)' }}>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>💰</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>70% Funding</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>We fund 70% of your construction cost. You only need 30% to get started.</p>
          </div>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>📸</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>Remote Monitoring</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>Track progress through real-time photo updates by your site engineer.</p>
          </div>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>🔒</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>Secure & Transparent</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>Every payment and milestone is tracked and visible to you.</p>
          </div>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>👷</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>Professional Teams</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>Work with vetted firms and certified engineers with proven track records.</p>
          </div>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>💳</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>Easy Payments</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>Pay via Mpesa, bank transfer or cheque. Track history anytime.</p>
          </div>
          <div style={{ ...styles.featureCard, padding: isMobile ? '16px' : '28px' }}>
            <div style={{ ...styles.featureIcon, fontSize: isMobile ? '28px' : '36px' }}>📊</div>
            <h3 style={{ ...styles.featureTitle, fontSize: isMobile ? '13px' : '18px' }}>Milestone Tracking</h3>
            <p style={{ ...styles.featureDesc, fontSize: isMobile ? '12px' : '14px' }}>Follow your build stage by stage — foundation to finishing.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...styles.cta, padding: isMobile ? '48px 20px' : '80px' }}>
        <h2 style={{ ...styles.ctaTitle, fontSize: isMobile ? '24px' : '36px' }}>Ready to Build Your Dream Home?</h2>
        <p style={{ ...styles.ctaSub, fontSize: isMobile ? '14px' : '18px' }}>Join hundreds of Kenyans building their homes with Homebuild</p>
        <button style={{ ...styles.ctaBtn, padding: isMobile ? '14px 28px' : '18px 40px', fontSize: isMobile ? '15px' : '18px' }} onClick={() => navigate('/login')}>
          Get Started Today →
        </button>
      </div>

      {/* Footer */}
      <div style={{ ...styles.footer, flexDirection: isMobile ? 'column' : 'row', padding: isMobile ? '24px 20px' : '32px 80px', textAlign: isMobile ? 'center' : 'left' }}>
        <div style={styles.footerLogo}>
          <span>🏗️</span>
          <span style={styles.footerLogoText}>Homebuild</span>
        </div>
        <p style={styles.footerText}>© 2026 Homebuild. Building Dreams, Together.</p>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", color: '#333' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogoIcon: { fontSize: '24px' },
  navLogoText: { fontWeight: '700', color: '#1B3A6B' },
  loginBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  hero: { display: 'grid', gap: '32px', backgroundColor: '#fff', alignItems: 'center' },
  heroContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  heroBadge: { display: 'inline-block', backgroundColor: '#FFF7ED', color: '#F97316', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', width: 'fit-content' },
  heroTitle: { fontWeight: '800', color: '#1B3A6B', lineHeight: '1.2', margin: 0 },
  heroHighlight: { color: '#F97316' },
  heroSub: { color: '#888', lineHeight: '1.6', margin: 0 },
  heroActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  heroBtnOutline: { backgroundColor: '#fff', color: '#1B3A6B', border: '2px solid #1B3A6B', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  heroStats: { display: 'flex', gap: '16px', alignItems: 'center' },
  heroStat: { textAlign: 'center' },
  heroStatNumber: { fontWeight: '800', color: '#1B3A6B' },
  heroStatLabel: { fontSize: '12px', color: '#888' },
  heroStatDivider: { width: '1px', height: '40px', backgroundColor: '#E0E0E0' },
  heroImageWrapper: { display: 'flex', justifyContent: 'center' },
  heroCard: { backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', width: '100%', maxWidth: '380px' },
  heroCardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  heroCardIcon: { fontSize: '32px' },
  heroCardTitle: { fontSize: '16px', fontWeight: '700', color: '#1B3A6B' },
  heroCardSub: { fontSize: '13px', color: '#888' },
  heroCardBadge: { marginLeft: 'auto', backgroundColor: '#10B981', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  heroCardProgress: { marginBottom: '20px' },
  heroCardProgressLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', color: '#1B3A6B', marginBottom: '8px' },
  heroCardProgressBar: { backgroundColor: '#F0F0F0', borderRadius: '8px', height: '10px', overflow: 'hidden' },
  heroCardProgressFill: { backgroundColor: '#F97316', height: '100%', width: '25%', borderRadius: '8px' },
  heroCardStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: '#F5F5F5', borderRadius: '12px', padding: '16px' },
  heroCardStat: { textAlign: 'center' },
  heroCardStatValue: { fontSize: '14px', fontWeight: '700', color: '#1B3A6B' },
  heroCardStatLabel: { fontSize: '11px', color: '#888', marginTop: '2px' },
  section: { backgroundColor: '#fff' },
  sectionTitle: { fontWeight: '800', color: '#1B3A6B', textAlign: 'center', margin: '0 0 12px 0' },
  sectionSub: { fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '40px' },
  stepsGrid: { display: 'grid', gap: '24px' },
  step: { textAlign: 'center' },
  stepNumber: { width: '32px', height: '32px', backgroundColor: '#F97316', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', margin: '0 auto 12px' },
  stepIcon: { marginBottom: '12px' },
  stepTitle: { fontWeight: '700', color: '#1B3A6B', marginBottom: '8px' },
  stepDesc: { color: '#888', lineHeight: '1.6' },
  featuresGrid: { display: 'grid', gap: '16px' },
  featureCard: { backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  featureIcon: { marginBottom: '12px' },
  featureTitle: { fontWeight: '700', color: '#1B3A6B', marginBottom: '8px' },
  featureDesc: { color: '#888', lineHeight: '1.6', margin: 0 },
  cta: { backgroundColor: '#1B3A6B', textAlign: 'center' },
  ctaTitle: { fontWeight: '800', color: '#fff', margin: '0 0 16px 0' },
  ctaSub: { color: 'rgba(255,255,255,0.7)', marginBottom: '32px' },
  ctaBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' },
  footer: { backgroundColor: '#0F2447', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' },
  footerLogoText: { color: '#fff', fontWeight: '700' },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 },
};

export default Landing;