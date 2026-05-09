import { type FeatureBreakdown } from './ai';

export const exportToMarkdown = (data: FeatureBreakdown): string => {
  let md = '# Feature Breakdown\n\n';

  md += '## User Stories\n';
  data.userStories?.forEach(us => {
    md += `### ${us.id}: ${us.title}\n`;
    md += `**Description:** ${us.description}\n\n`;
    
    const acs = data.acceptanceCriteria?.filter(ac => ac.storyId === us.id) || [];
    if (acs.length > 0) {
      md += `**Acceptance Criteria:**\n`;
      acs.forEach(ac => md += `- [ ] ${ac.description}\n`);
      md += '\n';
    }

    const tasks = data.tasks?.filter(t => t.storyId === us.id) || [];
    if (tasks.length > 0) {
      md += `**Tasks:**\n`;
      tasks.forEach(t => md += `- [ ] ${t.id}: ${t.title}\n`);
      md += '\n';
    }
  });

  md += '## Test Cases\n';
  data.testCases?.forEach(tc => {
    md += `### ${tc.id}: ${tc.title}\n`;
    md += `**Steps:**\n`;
    tc.steps.forEach((step, i) => md += `${i + 1}. ${step}\n`);
    md += `**Expected Result:** ${tc.expectedResult}\n\n`;
  });

  return md;
};

export const exportToCSV = (data: FeatureBreakdown): string => {
  const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
  
  let csv = 'IssueType,IssueId,ParentId,Summary,Description\n';
  
  data.userStories?.forEach(us => {
    csv += `Story,${us.id},,${escapeCsv(us.title)},${escapeCsv(us.description)}\n`;
  });

  data.tasks?.forEach(t => {
    csv += `Sub-task,${t.id},${t.storyId || ''},${escapeCsv(t.title)},${escapeCsv(t.description)}\n`;
  });

  data.testCases?.forEach(tc => {
    const desc = `Steps:\n${tc.steps.join('\n')}\n\nExpected Result:\n${tc.expectedResult}`;
    csv += `Test,${tc.id},,${escapeCsv(tc.title)},${escapeCsv(desc)}\n`;
  });

  return csv;
};

export const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
