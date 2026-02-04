import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, Settings, PlusCircle, Bell, RefreshCw, HardDrive } from 'lucide-react';
import { incidentService } from './services/api';
import IncidentTable from './components/IncidentTable';
import IncidentForm from './components/IncidentForm';
import RuleManager from './components/RuleManager';
import IncidentDetails from './components/IncidentDetails';
import S3Explorer from './components/S3Explorer';

const Layout = ({ children, activeTab, setActiveTab, onReset }) => {
  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="glass" style={{ width: '260px', padding: '2rem 1.5rem', margin: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: 'calc(100vh - 2rem)', position: 'fixed' }}>
        <div 
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', cursor: 'pointer' }}
        >
          <div className="flex-center" style={{ width: '40px', height: '40px', background: 'var(--brand-primary)', borderRadius: '10px', boxShadow: '0 0 15px var(--brand-glow)' }}>
            <ShieldAlert size={24} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Triage.ai</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item ${activeTab === 'dashboard' || activeTab === 'details' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`nav-item ${activeTab === 'rules' ? 'active' : ''}`}
          >
            <Settings size={20} /> Enrichment Rules
          </button>
          <button 
            onClick={() => setActiveTab('s3')}
            className={`nav-item ${activeTab === 's3' ? 'active' : ''}`}
          >
            <HardDrive size={20} /> S3 Payload Explorer
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button 
            onClick={() => setActiveTab('create')}
            className={`btn-primary ${activeTab === 'create' ? 'active' : ''}`} 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <PlusCircle size={18} /> Report Incident
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '300px', flex: 1, padding: '2rem 3rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {activeTab === 'dashboard' && 'Incident Dashboard'}
              {activeTab === 'details' && 'Incident Details'}
              {activeTab === 'rules' && 'Enrichment Rules'}
              {activeTab === 'create' && 'Report New Incident'}
              {activeTab === 's3' && 'S3 Payload Explorer'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'dashboard' && 'Monitor and triage ERP system incidents in real-time.'}
              {activeTab === 'details' && 'View detailed analysis and enrichment data.'}
              {activeTab === 'rules' && 'Manage auto-enrichment logic and prioritization.'}
              {activeTab === 'create' && 'Fill out the details to automatically triage the issue.'}
              {activeTab === 's3' && 'Explore raw incident and rule payloads stored in Amazon S3.'}
            </p>
          </div>
          <div className="flex-center" style={{ gap: '1.5rem' }}>
            <button className="glass" style={{ padding: '0.75rem', borderRadius: '50%', color: 'var(--text-secondary)' }}>
              <Bell size={20} />
            </button>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>Admin User</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enterprise Admin</div>
            </div>
            <div className="glass" style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=8b5cf6&color=fff" alt="Avatar" />
            </div>
          </div>
        </header>

        <section className="animate-fade-in">
          {children}
        </section>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          width: 100%;
          background: transparent;
          color: var(--text-secondary);
          text-align: left;
          font-size: 0.95rem;
          transition: var(--transition-smooth);
        }
        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-item.active {
          color: var(--brand-primary);
          background: rgba(139, 92, 246, 0.1);
          border-left: 3px solid var(--brand-primary);
        }
      `}} />
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    p1: 0,
    enrichedToday: 0,
    rules: 2
  });

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await incidentService.getIncidents();
      setIncidents(data);
      // Derive stats
      setStats({
        total: data.length,
        p1: data.filter(i => i.severity === 'P1').length,
        enrichedToday: data.filter(i => i.summary).length,
        rules: 2 
      });
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setActiveTab('details');
  };

  const handleBackToDashboard = () => {
    setSelectedIncident(null);
    setActiveTab('dashboard');
    fetchIncidents();
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedIncident(null);
      }}
      onReset={handleBackToDashboard}
    >
      {activeTab === 'dashboard' && (
        <div className="dashboard-grid">
          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Open Incidents', val: stats.total, color: 'var(--status-info)' },
              { label: 'Critical (P1)', val: stats.p1, color: 'var(--status-critical)' },
              { label: 'Enriched Items', val: stats.enrichedToday, color: 'var(--status-success)' },
              { label: 'Active Rules', val: stats.rules, color: 'var(--brand-primary)' }
            ].map(stat => (
              <div key={stat.label} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ color: stat.color, fontWeight: 700, fontSize: '1.75rem' }}>{stat.val}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ minHeight: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Active Incidents</h3>
              <button 
                onClick={fetchIncidents}
                className="glass" 
                style={{ padding: '0.5rem', borderRadius: '8px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            
            <IncidentTable 
              incidents={incidents} 
              loading={loading} 
              onViewDetail={handleViewDetails}
            />
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <IncidentDetails 
          incident={selectedIncident} 
          onBack={handleBackToDashboard} 
        />
      )}

      {activeTab === 'rules' && (
        <RuleManager />
      )}

      {activeTab === 's3' && (
        <S3Explorer />
      )}

      {activeTab === 'create' && (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Report Incident</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Please provide details about the ERP system issue.</p>
          <IncidentForm onSuccess={handleBackToDashboard} />
        </div>
      )}
    </Layout>
  );
}

export default App;
