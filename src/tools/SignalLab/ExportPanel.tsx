import React from 'react';
import { type SignalReport } from './services/ai';
import { exportToMarkdown, downloadFile } from './services/export';
import { FileText, CheckCircle2 } from 'lucide-react';

interface ExportPanelProps {
  report: SignalReport;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ report }) => {
  const handleExportMarkdown = () => {
    const md = exportToMarkdown(report);
    downloadFile(md, `signal-lab-report.md`, 'text/markdown');
  };

  return (
    <div className="glass-panel animate-fade-in flex-col gap-6" style={{ padding: '2rem', textAlign: 'center' }}>
      <CheckCircle2 size={48} className="text-gradient" style={{ margin: '0 auto' }} />
      <h2>Validation Complete!</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Your concept has been fully validated through simulated demand testing. Export the final report to review the simulated metrics and transcripts.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={handleExportMarkdown}>
          <FileText size={18} /> Export as Markdown
        </button>
      </div>
    </div>
  );
};
