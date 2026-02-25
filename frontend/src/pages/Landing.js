import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navLogo}>
          <span style={styles.navLogoIcon}>🏗️</span>
          <span style={styles.navLogoText}>Homebuild</span>
        </div>
        <button style={styles.loginBtn} onClick={() => navigate('/login')}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🏆 Kenya's #1 Home Construction Platform</div>
          <h1 style={styles.heroTitle}>
            Build Your Dream Home <span style={styles.heroHighlight}>With Confidence</span>
          </h1>
          <p style={styles.heroSub}>
            Homebuild connects new homeowners with established construction firms.
            We fund 70% of your build, manage the entire construction process,
            and keep you updated every step of the way.
          </p>
          <div style={styles.heroActions}>
            <button style={styles.heroBtn} onClick={() => navigate('/login')}>
              Get Started →
            </button>
            <button style={styles.heroBtnOutline} onClick={() => {
              document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
            }}>
              How It Works
            </button>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>70%</div>
              <div style={styles.heroStatLabel}>Funded by Us</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>100%</div>
              <div style={styles.heroStatLabel}>Transparent</div>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <div style={styles.heroStatNumber}>24/7</div>
              <div style={styles.heroStatLabel}>Progress Tracking</div>
            </div>
          </div>
        </div>
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
      </div>

      {/* How It Works */}
      <div id="how-it-works" style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSub}>Simple, transparent, and stress-free home building</p>
        <div style={styles.stepsGrid}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>📄</div>
            <h3 style={styles.stepTitle}>Submit Your Land</h3>
            <p style={styles.stepDesc}>Upload your title deed as security and submit your property details to Homebuild for verification.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>✅</div>
            <h3 style={styles.stepTitle}>Get Approved</h3>
            <p style={styles.stepDesc}>Our team verifies your documents and connects you with a trusted construction firm to fund and manage your build.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🏗️</div>
            <h3 style={styles.stepTitle}>Construction Begins</h3>
            <p style={styles.stepDesc}>Your assigned engineer starts building and uploads regular progress photos so you can monitor from anywhere.</p>
          </div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>4</div>
            <div style={styles.stepIcon}>🏠</div>
            <h3 style={styles.stepTitle}>Move In</h3>
            <p style={styles.stepDesc}>Once construction is complete and all payments are settled, your dream home is yours to move into.</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{...styles.section, backgroundColor: '#F5F5F5'}}>
        <h2 style={styles.sectionTitle}>Why Choose Homebuild</h2>
        <p style={styles.sectionSub}>Everything you need to build with confidence</p>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💰</div>
            <h3 style={styles.featureTitle}>70% Funding</h3>
            <p style={styles.featureDesc}>We fund 70% of your construction cost. You only need 30% to get started on your dream home.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📸</div>
            <h3 style={styles.featureTitle}>Remote Monitoring</h3>
            <p style={styles.featureDesc}>Track construction progress through real-time photo updates uploaded by your site engineer.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Secure & Transparent</h3>
            <p style={styles.featureDesc}>Your title deed is held securely. Every payment and milestone is tracked and visible to you.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>👷</div>
            <h3 style={styles.featureTitle}>Professional Teams</h3>
            <p style={styles.featureDesc}>Work with vetted construction firms and certified engineers with proven track records.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💳</div>
            <h3 style={styles.featureTitle}>Easy Payments</h3>
            <p style={styles.featureDesc}>Make payments via Mpesa, bank transfer or cheque. Track your payment history anytime.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Milestone Tracking</h3>
            <p style={styles.featureDesc}>Follow your build stage by stage — foundation, walling, roofing and finishing.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Build Your Dream Home?</h2>
        <p style={styles.ctaSub}>Join hundreds of Kenyans building their homes with Homebuild</p>
        <button style={styles.ctaBtn} onClick={() => navigate('/login')}>
          Get Started Today →
        </button>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLogo}>
          <span>🏗️</span>
          <span style={styles.footerLogoText}>Homebuild</span>
        </div>
        <p style={styles.footerText}>© 2026 Homebuild. Building Dreams, Together.</p>
      </div>
    </div>
  );
};

const isMobile = window.innerWidth <= 768;

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", color: '#333' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '16px 20px' : '20px 80px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  navLogoIcon: { fontSize: '24px' },
  navLogoText: { fontSize: isMobile ? '18px' : '22px', fontWeight: '700', color: '#1B3A6B' },
  loginBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '8px', padding: isMobile ? '8px 16px' : '10px 24px', fontSize: isMobile ? '13px' : '15px', fontWeight: '600', cursor: 'pointer' },
  hero: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '60px', padding: isMobile ? '40px 20px' : '80px', backgroundColor: '#fff', alignItems: 'center' },
  heroContent: { display: 'flex', flexDirection: 'column', gap: '24px' },
  heroBadge: { display: 'inline-block', backgroundColor: '#FFF7ED', color: '#F97316', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', width: 'fit-content' },
  heroTitle: { fontSize: isMobile ? '32px' : '52px', fontWeight: '800', color: '#1B3A6B', lineHeight: '1.2', margin: 0 },
  heroHighlight: { color: '#F97316' },
  heroSub: { fontSize: isMobile ? '15px' : '18px', color: '#888', lineHeight: '1.6', margin: 0 },
  heroActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  heroBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '10px', padding: isMobile ? '12px 24px' : '16px 32px', fontSize: isMobile ? '14px' : '16px', fontWeight: '700', cursor: 'pointer' },
  heroBtnOutline: { backgroundColor: '#fff', color: '#1B3A6B', border: '2px solid #1B3A6B', borderRadius: '10px', padding: isMobile ? '12px 24px' : '16px 32px', fontSize: isMobile ? '14px' : '16px', fontWeight: '700', cursor: 'pointer' },
  heroStats: { display: 'flex', gap: isMobile ? '16px' : '32px', alignItems: 'center' },
  heroStat: { textAlign: 'center' },
  heroStatNumber: { fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#1B3A6B' },
  heroStatLabel: { fontSize: '12px', color: '#888' },
  heroStatDivider: { width: '1px', height: '40px', backgroundColor: '#E0E0E0' },
  heroImageWrapper: { display: isMobile ? 'none' : 'flex', justifyContent: 'center' },
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
  section: { padding: isMobile ? '48px 20px' : '80px', backgroundColor: '#fff' },
  sectionTitle: { fontSize: isMobile ? '26px' : '36px', fontWeight: '800', color: '#1B3A6B', textAlign: 'center', margin: '0 0 12px 0' },
  sectionSub: { fontSize: isMobile ? '14px' : '16px', color: '#888', textAlign: 'center', marginBottom: '40px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? '24px' : '32px' },
  step: { textAlign: 'center' },
  stepNumber: { width: '32px', height: '32px', backgroundColor: '#F97316', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', margin: '0 auto 12px' },
  stepIcon: { fontSize: isMobile ? '32px' : '40px', marginBottom: '12px' },
  stepTitle: { fontSize: isMobile ? '14px' : '18px', fontWeight: '700', color: '#1B3A6B', marginBottom: '8px' },
  stepDesc: { fontSize: isMobile ? '12px' : '14px', color: '#888', lineHeight: '1.6' },
  featuresGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '16px' },
  featureCard: { backgroundColor: '#fff', borderRadius: '16px', padding: isMobile ? '20px' : '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  featureIcon: { fontSize: isMobile ? '28px' : '36px', marginBottom: '12px' },
  featureTitle: { fontSize: isMobile ? '14px' : '18px', fontWeight: '700', color: '#1B3A6B', marginBottom: '8px' },
  featureDesc: { fontSize: isMobile ? '12px' : '14px', color: '#888', lineHeight: '1.6', margin: 0 },
  cta: { backgroundColor: '#1B3A6B', padding: isMobile ? '48px 20px' : '80px', textAlign: 'center' },
  ctaTitle: { fontSize: isMobile ? '24px' : '36px', fontWeight: '800', color: '#fff', margin: '0 0 16px 0' },
  ctaSub: { fontSize: isMobile ? '14px' : '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' },
  ctaBtn: { backgroundColor: '#F97316', color: '#fff', border: 'none', borderRadius: '10px', padding: isMobile ? '14px 28px' : '18px 40px', fontSize: isMobile ? '15px' : '18px', fontWeight: '700', cursor: 'pointer' },
  footer: { backgroundColor: '#0F2447', padding: isMobile ? '24px 20px' : '32px 80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px' },
  footerLogoText: { color: '#fff', fontWeight: '700' },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 },
};

export default Landing;