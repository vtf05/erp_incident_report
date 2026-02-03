import React from 'react';
import { AlertTriangle, Clock, Activity, MessageSquare, Filter, ChevronRight } from 'lucide-react';

const IncidentTable = ({ incidents, loading, onViewDetail }) => {
  const [filter, setFilter] = React.useState({ severity: 'All', module: 'All' });

  const filteredIncidents = incidents.filter(i => {
    const sevMatch = filter.severity === 'All' || i.severity === filter.severity;
    const modMatch = filter.module === 'All' || i.erp_module === filter.module;
    return sevMatch && modMatch;
  });

  const modules = ['All', ...new Set(incidents.map(i => i.erp_module))];
  const severities = ['All', 'P1', 'P2', 'P3'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <div className="flex-center" style={{ gap: '1rem' }}>
          <Activity className="animate-pulse" size={24} color="var(--brand-primary)" />
          <span style={{ color: 'var(--text-secondary)' }}>Syncing with ERP systems...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Filter size={16} /> Filter by:
        </div>
        
        <select 
          className="glass" 
          style={{ padding: '0.4rem 0.8rem', outline: 'none', color: 'var(--text-secondary)' }}
          value={filter.severity}
          onChange={(e) => setFilter({...filter, severity: e.target.value})}
        >
          {severities.map(s => <option key={s} value={s}>Severity: {s}</option>)}
        </select>

        <select 
          className="glass" 
          style={{ padding: '0.4rem 0.8rem', outline: 'none', color: 'var(--text-secondary)' }}
          value={filter.module}
          onChange={(e) => setFilter({...filter, module: e.target.value})}
        >
          {modules.map(m => <option key={m} value={m}>Module: {m}</option>)}
        </select>
      </div>

      {filteredIncidents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No incidents match your current filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0 1rem' }}>INCIDENT</th>
                <th>MODULE</th>
                <th>SEVERITY</th>
                <th>ENVIRONMENT</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr 
                  key={incident.id} 
                  className="glass-card" 
                  style={{ padding: 0, cursor: 'pointer' }}
                  onClick={() => onViewDetail(incident)}
                >
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{incident.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MessageSquare size={14} /> {incident.summary || 'Awaiting enrichment...'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{incident.erp_module}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${incident.severity?.toLowerCase() || 'p3'}`}>
                      {incident.severity || 'P3'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      <div style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: incident.environment === 'Prod' ? 'var(--status-critical)' : 'var(--status-info)' 
                      }}></div>
                      {incident.environment}
                    </div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--status-info)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                       <Clock size={16} /> Triaging
                    </div>
                  </td>
                  <td style={{ paddingRight: '1rem', textAlign: 'right' }}>
                    <button 
                      className="glass flex-center" 
                      style={{ padding: '0.5rem', borderRadius: '8px' }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentTable;
