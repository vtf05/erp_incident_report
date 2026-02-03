import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { enrichmentService } from '../services/api';

const RuleManager = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    erp_module_condition: '',
    keyword_condition: '',
    severity_outcome: 'P2',
    priority: 0
  });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await enrichmentService.getRules();
      setRules(data);
    } catch (err) {
      console.error('Failed to fetch rules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async (e) => {
    e.preventDefault();
    try {
      await enrichmentService.createRule(newRule);
      setShowAddForm(false);
      fetchRules();
      setNewRule({ name: '', erp_module_condition: '', keyword_condition: '', severity_outcome: 'P2', priority: 0 });
    } catch (err) {
      alert('Failed to create rule');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Active Enrichment Rules</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rules are executed in order of priority (descending).</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
        >
          <Plus size={18} /> New Rule
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card animate-fade-in" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
          <h4 style={{ marginBottom: '1.25rem' }}>Create New Enrichment Rule</h4>
          <form onSubmit={handleAddRule} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RULE NAME</label>
              <input 
                required
                className="glass"
                style={{ padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                placeholder="e.g. Critical AP Issues"
                value={newRule.name}
                onChange={e => setNewRule({...newRule, name: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MODULE MATCH (OPTIONAL)</label>
              <input 
                className="glass"
                style={{ padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                placeholder="FI, AP, HR..."
                value={newRule.erp_module_condition}
                onChange={e => setNewRule({...newRule, erp_module_condition: e.target.value})}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SEVERITY OUTCOME</label>
              <select 
                className="glass"
                style={{ padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                value={newRule.severity_outcome}
                onChange={e => setNewRule({...newRule, severity_outcome: e.target.value})}
              >
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>KEYWORD MATCH (DESCRIPTION)</label>
              <input 
                className="glass"
                style={{ padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                placeholder="e.g. timeout, critical error, payroll"
                value={newRule.keyword_condition}
                onChange={e => setNewRule({...newRule, keyword_condition: e.target.value})}
              />
            </div>
            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="glass" style={{ padding: '0.6rem 1.2rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Save Rule</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {rules.map((rule) => (
          <div key={rule.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="flex-center" style={{ width: '40px', height: '40px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '10px', color: 'var(--brand-primary)' }}>
                <Zap size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0 }}>{rule.name}</h4>
                  <span className={`badge badge-${rule.severity_outcome?.toLowerCase()}`}>Apply {rule.severity_outcome}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                  {rule.erp_module_condition && <span>Module: <b>{rule.erp_module_condition}</b></span>}
                  {rule.keyword_condition && <span>Keyword: "<b>{rule.keyword_condition}</b>"</span>}
                  <span>Priority: {rule.priority}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button className="glass" style={{ padding: '0.5rem' }}><ArrowUp size={16} /></button>
               <button className="glass" style={{ padding: '0.5rem' }}><ArrowDown size={16} /></button>
               <button className="glass" style={{ padding: '0.5rem', color: 'var(--status-critical)' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {rules.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
            No enrichment rules configured yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleManager;
