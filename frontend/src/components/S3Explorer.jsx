import React, { useState, useEffect } from 'react';
import { HardDrive, FileJson, Clock, ChevronRight, Search, RefreshCw, X } from 'lucide-react';
import { incidentService } from '../services/api';

const S3Explorer = () => {
  const [payloads, setPayloads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [viewingContent, setViewingContent] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchPayloads();
  }, []);

  const fetchPayloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.listS3Payloads();
      setPayloads(data);
    } catch (error) {
      console.error('Error fetching S3 payloads:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayload = async (payload) => {
    setSelectedPayload(payload);
    setLoading(true);
    try {
      const content = await incidentService.getS3Payload(payload.key);
      setViewingContent(content);
    } catch (error) {
      console.error('Error fetching payload content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayloads = payloads.filter(p => 
    p.key.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>AWS S3 Payload Explorer</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View raw JSON payloads stored in S3</p>
        </div>
        <button 
          onClick={fetchPayloads}
          className="glass flex-center" 
          style={{ width: '40px', height: '40px', borderRadius: '10px' }}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="glass" style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', marginBottom: '1rem' }}>
          <strong>Error:</strong> {error}. Please check your AWS bucket name and IAM permissions in <code>config.py</code>.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: viewingContent ? '1fr 1.5fr' : '1fr', gap: '2rem' }}>
        {/* List View */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="glass" 
              placeholder="Filter payloads..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading && !payloads.length ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
            ) : filteredPayloads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No payloads found</div>
            ) : (
              filteredPayloads.map((p) => (
                <div 
                  key={p.key}
                  onClick={() => handleViewPayload(p)}
                  className={`glass flex-center`}
                  style={{ 
                    justifyContent: 'flex-start',
                    padding: '1rem', 
                    borderRadius: '12px',
                    cursor: 'pointer',
                    borderLeft: `4px solid ${p.key.startsWith('rules') ? 'var(--brand-primary)' : 'var(--status-info)'}`,
                    background: selectedPayload?.key === p.key ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileJson size={20} style={{ marginRight: '1rem', opacity: 0.7 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.key.split('/').pop()}</span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        background: p.source === 'S3' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                        color: p.source === 'S3' ? '#6ee7b7' : '#d1d5db',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {p.source || 'Local'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={12} /> {new Date(p.last_modified).toLocaleString()}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ opacity: 0.5 }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* JSON Content View */}
        {viewingContent && (
          <div className="glass-card animate-fade-in" style={{ maxHeight: '70vh', overflowY: 'auto', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HardDrive size={18} /> Raw Payload Content
                </h4>
                <button 
                  onClick={() => setViewingContent(null)}
                  className="glass flex-center"
                  style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                >
                  <X size={16} />
                </button>
            </div>
            <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                fontSize: '0.85rem', 
                lineHeight: 1.6,
                overflowX: 'auto',
                border: '1px solid var(--glass-border)',
                color: '#e0e0e0',
                fontFamily: 'Fira Code, monospace'
            }}>
              {JSON.stringify(viewingContent, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default S3Explorer;
