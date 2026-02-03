import React from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Globe, 
  Cpu, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  RefreshCw,
  Clock,
  ChevronDown
} from 'lucide-react';
import { incidentService } from '../services/api';

const IncidentDetails = ({ incident, onBack }) => {
  const [updating, setUpdating] = React.useState(false);
  const [currentStatus, setCurrentStatus] = React.useState(incident?.status);

  if (!incident) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = ['New', 'In Progress', 'Resolved', 'Closed'];

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await incidentService.updateIncident(incident.id, { status: newStatus });
      setCurrentStatus(updated.status);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onBack}
          className="glass flex-center" 
          style={{ width: '40px', height: '40px', borderRadius: '10px', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{incident.title}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            INCIDENT ID: #{incident.id.toString().padStart(6, '0')}
          </div>
        </div>
        
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <select
              className="glass"
              style={{ 
                padding: '0.5rem 1rem', 
                paddingRight: '2rem',
                borderRadius: '8px', 
                color: 'var(--text-primary)',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none',
                background: updating ? 'rgba(255, 255, 255, 0.05)' : 'var(--glass-bg)'
              }}
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {updating ? (
              <RefreshCw size={14} className="animate-spin" style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', color: 'var(--brand-primary)' }} />
            ) : (
              <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '0.75rem', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            )}
          </div>

          <span className={`badge badge-${incident.severity?.toLowerCase() || 'p3'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            {incident.severity || 'P3'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
        {/* Left Column: Core Info */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <FileText size={18} color="var(--brand-primary)" /> Description
            </h4>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {incident.description}
            </p>
          </div>

          <div className="glass-card">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Activity size={18} color="var(--status-info)" /> Auto-Enrichment Summary
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--brand-primary)' }}>
              <div style={{ fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                "{incident.summary || 'Enrichment in progress...'}"
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>CATEGORY</label>
                  <div style={{ fontWeight: 600 }}>{incident.category || 'Triage Pending'}</div>
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>PRIORITY SCORE</label>
                  <div style={{ fontWeight: 600 }}>{incident.severity?.includes('1') ? 'Critical' : 'Standard'}</div>
                </div>
              </div>
            </div>
          </div>

          {incident.suggested_action && (
            <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--status-success)' }}>
                <CheckCircle2 size={18} /> Suggested Resolution
              </h4>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                {incident.suggested_action}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata */}
        <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <h4 style={{ marginBottom: '1.5rem' }}>Technical Context</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Shield size={16} /> ERP Module
                </div>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{incident.erp_module}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Globe size={16} /> Environment
                </div>
                <span style={{ 
                  color: incident.environment === 'Prod' ? 'var(--status-critical)' : 'var(--status-info)',
                  fontWeight: 600 
                }}>
                  {incident.environment}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Cpu size={16} /> Business Unit
                </div>
                <span style={{ fontWeight: 600 }}>{incident.business_unit}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} /> Reported At
                </div>
                <span style={{ fontSize: '0.85rem' }}>{formatDate(incident.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <h4 style={{ marginBottom: '1.5rem' }}>Timeline</h4>
            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              <div style={{ position: 'absolute', left: '4px', top: '0', bottom: '0', width: '2px', background: 'var(--glass-border)' }}></div>
              
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', left: '-1.5rem', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 10px var(--status-success)' }}></div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Incident Created</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(incident.created_at)}</div>
              </div>

              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <div style={{ position: 'absolute', left: '-1.5rem', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-primary)', boxShadow: '0 0 10px var(--brand-primary)' }}></div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Auto-Enrichment Completed</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(incident.updated_at)}</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-1.5rem', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--status-info)', animation: 'pulse-blue 2s infinite' }}></div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Currently Triaging</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to L1 Support Agent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;
