import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as XLSX from 'xlsx';
import type { RegistrationResult } from '../types';

interface Registrant extends RegistrationResult {
  id: number;
  email: string;
  company: string;
  role: string;
  registeredAt: string;
}

interface StatsData {
  total: number;
  standard: number;
  vip: number;
  student: number;
}

export const AdminDashboard: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Data States
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [stats, setStats] = useState<StatsData>({ total: 0, standard: 0, vip: 0, student: 0 });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getApiBaseUrl = (): string => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (!envUrl) return 'http://localhost:5000/api';
    let url = envUrl.trim();
    if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
      url = 'https://' + url;
    }
    if (!/\/api\/?$/i.test(url)) {
      url = url.replace(/\/$/, '') + '/api';
    }
    return url;
  };

  const API_BASE_URL = getApiBaseUrl();

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/registrations`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRegistrants(json.data);
          setStats(json.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch registrations from backend API.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated, fetchRegistrations]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Invalid admin password.');
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Registration deleted.');
        fetchRegistrations();
      } else {
        const json = await res.json();
        alert(json.message || 'Deletion failed.');
      }
    } catch (err) {
      alert('Server error while deleting.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // ─── Excel Export ───────────────────────────────────────────────
  const [exportFilter, setExportFilter] = useState<'all' | 'vip' | 'standard' | 'student'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      // Apply filter
      const rows = exportFilter === 'all'
        ? registrants
        : registrants.filter(r => r.ticketType === exportFilter);

      if (rows.length === 0) {
        alert(`No registrations found for the "${exportFilter}" filter.`);
        setIsExporting(false);
        return;
      }

      // Map to clean export shape
      const sheetData = rows.map((r, index) => ({
        '#': index + 1,
        'Full Name': r.name,
        'Email Address': r.email,
        'Company / Organisation': r.company,
        'Role': r.role,
        'Ticket Tier': r.ticketType.toUpperCase(),
        'Registration Code': r.registrationCode,
        'Registered At': new Date(r.registeredAt).toLocaleString('en-GB', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
      }));

      // Build worksheet & workbook
      const ws = XLSX.utils.json_to_sheet(sheetData);

      // Auto column widths
      const colWidths = Object.keys(sheetData[0]).map(key => ({
        wch: Math.max(key.length, ...sheetData.map(row => String((row as Record<string, unknown>)[key] ?? '').length)) + 2
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

      // Summary sheet
      const summaryData = [
        { 'Metric': 'Total Registrations', 'Count': stats.total },
        { 'Metric': 'VIP Tier', 'Count': stats.vip },
        { 'Metric': 'Standard Tier', 'Count': stats.standard },
        { 'Metric': 'Academic (Student) Tier', 'Count': stats.student },
        { 'Metric': 'Export Filter Applied', 'Count': exportFilter.toUpperCase() },
        { 'Metric': 'Rows Exported', 'Count': rows.length },
        { 'Metric': 'Exported At', 'Count': new Date().toLocaleString('en-GB') },
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryData);
      wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Filename with timestamp
      const ts = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
      const filename = `AIR_Conference_Registrations_${exportFilter.toUpperCase()}_${ts}.xlsx`;

      XLSX.writeFile(wb, filename);
    } catch (err) {
      console.error('Excel export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Filtered registrations
  const filteredRegistrants = useMemo(() => {
    return registrants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [registrants, searchQuery]);

  return (
    <div className="admin-page-layout">
      <div className="admin-page-container">
        <div className="admin-portal-header">
          <div>
            <h1 className="admin-portal-title" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>AIR Administration</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure Conference Management Console</p>
          </div>
          <a href="#" className="cta-button secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}>
            ← Back to Site
          </a>
        </div>

        <div className="admin-portal-body" style={{ padding: '2.5rem 0' }}>
          {!isAuthenticated ? (
            // Passcode login card
            <div style={{ maxWidth: '450px', margin: '4rem auto 0' }} className="registration-card animate-fade-in">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 700 }}>Authorized Personnel Only</h3>
              <form onSubmit={handleLogin} className="admin-login-form" style={{ marginTop: 0 }}>
                <div className="form-group">
                  <label htmlFor="admin-pass" className="form-label">Enter Admin Passcode</label>
                  <input 
                    id="admin-pass"
                    type="password" 
                    className="form-control" 
                    placeholder="Passcode"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                    autoFocus
                  />
                </div>
                <button type="submit" className="cta-button accent" style={{ width: '100%' }}>
                  Authenticate Portal
                </button>
              </form>
            </div>
          ) : (
            // Authenticated Dashboard View
            <div className="admin-dashboard-view animate-fade-in">
              
              {/* High Density Bento Stats (Visual Density = 8) */}
              <div className="admin-stats-bento" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <div className="admin-stat-box">
                  <span className="admin-stat-val font-mono">{stats.total}</span>
                  <span className="admin-stat-lbl">Total Registrants</span>
                </div>
                <div className="admin-stat-box">
                  <span className="admin-stat-val font-mono">{stats.vip}</span>
                  <span className="admin-stat-lbl">VIP Tier</span>
                </div>
                <div className="admin-stat-box">
                  <span className="admin-stat-val font-mono">{stats.standard}</span>
                  <span className="admin-stat-lbl">Standard Tier</span>
                </div>
                <div className="admin-stat-box">
                  <span className="admin-stat-val font-mono">{stats.student}</span>
                  <span className="admin-stat-lbl">Academic Tier</span>
                </div>
              </div>

              {/* Toolbar */}
              <div className="admin-toolbar" style={{ marginTop: '2.5rem' }}>
                <input 
                  type="text" 
                  className="form-control admin-search" 
                  placeholder="Search name, email, or company..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                
                <button 
                  className="cta-button secondary" 
                  onClick={fetchRegistrations} 
                  disabled={loading}
                  type="button"
                  style={{ padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}
                >
                  {loading ? 'Syncing...' : 'Sync Data'}
                </button>
              </div>

              {/* Table list */}
              <div className="registrants-table-wrapper" style={{ maxHeight: '600px', marginTop: '1.5rem' }}>
                {filteredRegistrants.length > 0 ? (
                  <table className="registrants-table">
                    <thead>
                      <tr>
                        <th>Delegate</th>
                        <th>Pass Tier</th>
                        <th>Reference Code</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrants.map(reg => (
                        <tr key={reg.id}>
                          <td>
                            <div className="registrant-name-cell">{reg.name}</div>
                            <div className="registrant-sub-cell">{reg.email} • {reg.company}</div>
                          </td>
                          <td style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700 }}>
                            {reg.ticketType}
                          </td>
                          <td className="font-mono" style={{ fontSize: '0.9rem' }}>
                            {reg.registrationCode}
                          </td>
                          <td>
                            <button 
                              className="admin-delete-row-btn"
                              onClick={() => handleDelete(reg.registrationCode)}
                              title="Revoke reservation"
                              type="button"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state" style={{ padding: '3rem 0', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No delegates registered matching query.</p>
                  </div>
                )}
              </div>

              {/* ── Export to Excel Section ── */}
              <div className="admin-export-section">
                <div className="admin-export-header">
                  <div>
                    <h3 className="admin-export-title">📊 Export Registrations</h3>
                    <p className="admin-export-desc">
                      Download the full delegate list as an Excel spreadsheet (.xlsx). Includes a Summary sheet with stats.
                    </p>
                  </div>
                </div>

                <div className="admin-export-controls">
                  <div className="admin-export-filter-group">
                    <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block', fontSize: '0.8rem' }}>
                      Filter by Ticket Tier
                    </label>
                    <div className="admin-export-tier-pills">
                      {(['all', 'vip', 'standard', 'student'] as const).map(tier => (
                        <button
                          key={tier}
                          type="button"
                          className={`admin-tier-pill ${exportFilter === tier ? 'active' : ''}`}
                          onClick={() => setExportFilter(tier)}
                        >
                          {tier === 'all' ? '🌐 All Tiers' :
                           tier === 'vip' ? '👑 VIP' :
                           tier === 'standard' ? '🎟 Standard' : '🎓 Academic'}
                          <span className="admin-tier-pill-count">
                            {tier === 'all' ? stats.total :
                             tier === 'vip' ? stats.vip :
                             tier === 'standard' ? stats.standard : stats.student}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="admin-export-action">
                    <div className="admin-export-meta">
                      <span>Will export <strong>
                        {exportFilter === 'all' ? stats.total :
                         exportFilter === 'vip' ? stats.vip :
                         exportFilter === 'standard' ? stats.standard : stats.student}
                      </strong> {exportFilter === 'all' ? 'total' : exportFilter} record{(
                        (exportFilter === 'all' ? stats.total :
                         exportFilter === 'vip' ? stats.vip :
                         exportFilter === 'standard' ? stats.standard : stats.student) !== 1) ? 's' : ''}
                      </span>
                      <span className="admin-export-format-badge">📄 .xlsx</span>
                    </div>
                    <button
                      type="button"
                      className="cta-button admin-export-btn"
                      onClick={handleExportExcel}
                      disabled={isExporting || registrants.length === 0}
                    >
                      {isExporting ? (
                        <><span className="admin-export-spinner">⏳</span> Generating... </>
                      ) : (
                        <>⬇ Download Excel File</>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button 
                  className="cta-button secondary" 
                  onClick={handleLogout} 
                  type="button"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem' }}
                >
                  Log Out Portal
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
