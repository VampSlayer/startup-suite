import React from 'react';
import { type FeatureBreakdown } from './services/ai';
import { exportToCSV, exportToMarkdown, downloadFile } from './services/export';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

interface ExportPanelProps {
  data: FeatureBreakdown | null;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  if (!data) return null;

  const handleJiraExport = () => {
    const csv = exportToCSV(data);
    downloadFile('feature-breakdown-jira.csv', csv, 'text/csv');
  };

  const handleGithubExport = () => {
    const md = exportToMarkdown(data);
    downloadFile('feature-breakdown-github.md', md, 'text/markdown');
  };

  const handleCopyMarkdown = async () => {
    const md = exportToMarkdown(data);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
      <div className="flex justify-between items-center flex-wrap gap-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Export Options</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Download or copy the breakdown to use in your project management tools.
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleJiraExport}>
            <Download size={18} />
            Jira CSV
          </button>
          
          <button className="btn btn-secondary" onClick={handleGithubExport}>
            <Download size={18} />
            GitHub Markdown
          </button>
          
          <button className="btn btn-primary" onClick={handleCopyMarkdown} style={{ minWidth: '160px' }}>
            {copied ? (
              <>
                <CheckCircle2 size={18} />
                Copied!
              </>
            ) : (
              <>
                <FileText size={18} />
                Copy Markdown
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
