import { type SignalReport } from './ai';

export const exportToMarkdown = (report: SignalReport): string => {
  let md = `# Signal Lab Validation Report\n\n`;
  md += `## Concept\n${report.concept}\n\n`;

  if (report.landingPage) {
    md += `## Fake-Door Landing Page\n`;
    md += `**Headline:** ${report.landingPage.heroHeadline}\n\n`;
    md += `**Subheadline:** ${report.landingPage.heroSubheadline}\n\n`;
    md += `**Features:**\n`;
    report.landingPage.features.forEach(f => {
      md += `- **${f.title}**: ${f.description}\n`;
    });
    md += `\n**Waitlist CTA:** ${report.landingPage.waitlistCta}\n\n`;
  }

  if (report.adCampaign) {
    md += `## Simulated Ad Campaign (${report.adCampaign.platform})\n`;
    md += `- **Estimated CPC:** ${report.adCampaign.estimatedCpc}\n`;
    md += `- **Estimated CTR:** ${report.adCampaign.estimatedCtr}\n\n`;
    report.adCampaign.variations.forEach((v, i) => {
      md += `### Variation ${i + 1}\n`;
      md += `**Headline:** ${v.headline}\n\n`;
      md += `**Copy:** ${v.primaryText}\n\n`;
    });
  }

  if (report.interviews && report.interviews.length > 0) {
    md += `## AI Customer Interviews\n\n`;
    report.interviews.forEach((interview, i) => {
      md += `### Interview ${i + 1}: ${interview.personaName} (${interview.demographic})\n`;
      md += `**Key Takeaways:**\n`;
      interview.keyTakeaways.forEach(t => md += `- ${t}\n`);
      md += `\n**Transcript:**\n`;
      interview.transcript.forEach(turn => {
        md += `**${turn.speaker}:** ${turn.text}\n\n`;
      });
    });
  }

  if (report.validationScore) {
    md += `## Validation Score\n`;
    md += `- **Overall Score:** ${report.validationScore.overallScore}/100\n`;
    md += `- **Problem Severity:** ${report.validationScore.problemSeverityScore}/100\n`;
    md += `- **Market Demand:** ${report.validationScore.marketDemandScore}/100\n`;
    md += `- **Ease of Reach:** ${report.validationScore.easeOfReachScore}/100\n\n`;
    md += `### Recommendation\n${report.validationScore.recommendation}\n`;
  }

  return md;
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
