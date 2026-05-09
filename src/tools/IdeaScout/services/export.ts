import { type ScoutReport } from './ai';

export const exportToMarkdown = (report: ScoutReport): string => {
  let md = `# Idea Scout Report: ${report.selectedIdea?.title || 'Unknown Idea'}\n\n`;

  if (report.selectedIdea) {
    md += `## 🚀 Concept\n**${report.selectedIdea.title}**\n\n${report.selectedIdea.description}\n\n`;
    md += `**Market Potential:** ${report.selectedIdea.marketPotential}\n\n`;
  }

  if (report.pitch) {
    md += `## 📣 Pitch\n### Elevator Pitch\n${report.pitch.elevatorPitch}\n\n### Value Proposition\n${report.pitch.valueProposition}\n\n`;
    md += `### Key Features\n`;
    report.pitch.keyFeatures.forEach(f => md += `- ${f}\n`);
    md += `\n`;
  }

  if (report.audience && report.audience.length > 0) {
    md += `## 👥 Target Audience\n`;
    report.audience.forEach(a => {
      md += `### ${a.name}\n`;
      md += `- **Demographic:** ${a.demographic}\n`;
      md += `- **Goals:** ${a.goals.join(', ')}\n`;
      md += `- **Pain Points:** ${a.painPoints.join(', ')}\n\n`;
    });
  }

  if (report.competition && report.competition.length > 0) {
    md += `## ⚔️ Competition\n`;
    report.competition.forEach(c => {
      md += `### ${c.name}\n`;
      md += `- **Strengths:** ${c.strengths.join(', ')}\n`;
      md += `- **Weaknesses:** ${c.weaknesses.join(', ')}\n`;
      md += `- **How we differentiate:** ${c.differentiation}\n\n`;
    });
  }

  if (report.grants && report.grants.length > 0) {
    md += `## 💷 UK Government Grants\n`;
    report.grants.forEach(g => {
      md += `### ${g.name} (${g.provider})\n`;
      md += `- **Amount:** ${g.amount}\n`;
      md += `- **Eligibility:** ${g.eligibility}\n`;
      md += `- **Alignment:** ${g.alignment}\n\n`;
    });
  }

  return md;
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
