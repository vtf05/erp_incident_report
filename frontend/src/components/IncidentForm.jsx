import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { incidentService } from '../services/api';

const IncidentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    erp_module: 'AP',
    environment: 'Prod',
    business_unit: 'Global'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await incidentService.createIncident(formData);
      setSubmitted(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit incident');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-center" style={{ flexDirection: 'column', padding: '3rem', textAlign: 'center' }}>
        <div className="flex-center" style={{ width: '60px', height: '60px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--status-success)' }}>
          <CheckCircle2 size={32} />
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>Incident Reported</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          The incident has been submitted and auto-enriched by the rule engine.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>INCIDENT TITLE</label>
        <input 
          required
          className="glass"
          style={{ padding: '0.85rem 1rem', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }}
          placeholder="e.g. Failure in AP Invoice Processing"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>ERP MODULE</label>
          <select 
            className="glass"
            style={{ padding: '0.85rem 1rem', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }}
            value={formData.erp_module}
            onChange={e => setFormData({...formData, erp_module: e.target.value})}
          >
            <option value="AP">Accounts Payable (AP)</option>
            <option value="AR">Accounts Receivable (AR)</option>
            <option value="GL">General Ledger (GL)</option>
            <option value="Inventory">Inventory</option>
            <option value="HR">Human Resources (HR)</option>
            <option value="Payroll">Payroll</option>
          </select>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>ENVIRONMENT</label>
          <select 
            className="glass"
            style={{ padding: '0.85rem 1rem', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none' }}
            value={formData.environment}
            onChange={e => setFormData({...formData, environment: e.target.value})}
          >
            <option value="Prod">Production</option>
            <option value="Test">Test/UAT</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>DESCRIPTION</label>
        <textarea 
          required
          className="glass"
          rows={4}
          style={{ padding: '0.85rem 1rem', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
          placeholder="Provide technical details. Rule engine will scan this for keywords..."
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>

      {error && (
        <div className="flex-center" style={{ gap: '0.75rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', color: 'var(--status-critical)', fontSize: '0.9rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="btn-primary" 
        style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
      >
        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
        {loading ? 'Submitting...' : 'Report Incident'}
      </button>
    </form>
  );
};

export default IncidentForm;
