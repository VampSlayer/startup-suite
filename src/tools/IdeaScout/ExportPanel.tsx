import React from 'react';
import { type ScoutReport } from './services/ai';
import { exportToMarkdown, downloadFile } from './services/export';
import { FileText, CheckCircle2 } from 'lucide-react';

interface ExportPanelProps {
  report: ScoutReport;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ report }) => {
  const handleExportMarkdown = () => {
    const md = exportToMarkdown(report);
    downloadFile(md, `idea-scout-${report.selectedIdea?.id || 'export'}.md`, 'text/markdown');
  };

  return (
    <div className="glass-panel animate-fade-in flex-col gap-6" style={{ padding: '2rem', textAlign: 'center' }}>
      <CheckCircle2 size={48} className="text-gradient" style={{ margin: '0 auto' }} />
      <h2>Scouting Complete!</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Your idea has been fully scouted. Export the final report to share with your team or save for your records.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleExportMarkdown}>
          <FileText size={18} /> Export as Markdown
        </button>
      </div>
    </div>
  );
};
