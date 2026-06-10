import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

export async function exportPitchDeckToPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const opt = {
    margin: [0, 0, 0, 0] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#0c0a1a',
      logging: false,
    },
    jsPDF: { 
      unit: 'in' as const, 
      format: 'letter' as const, 
      orientation: 'landscape' as const,
    },
    pagebreak: { mode: 'avoid-all' as const },
  };

  const worker = html2pdf().set(opt);
  worker.from(element).save();
}

export async function exportAnalysisReportToPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const opt = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      backgroundColor: '#0c0a1a',
      logging: false,
    },
    jsPDF: { 
      unit: 'mm' as const, 
      format: 'a4' as const, 
      orientation: 'portrait' as const,
    },
  };

  const worker = html2pdf().set(opt);
  worker.from(element).save();
}

export async function exportToImage(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0c0a1a',
    logging: false,
  });

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

export function printPage(): void {
  window.print();
}

export async function exportBusinessPlanToWord(analysisData: any, filename: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
      <meta charset='utf-8'>
      <title>${analysisData.idea.name} - Business Plan</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
        h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
        h2 { color: #10b981; margin-top: 30px; }
        .score { background: #7c3aed; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        .metric { background: #f3f4f6; padding: 15px; margin: 10px 0; border-radius: 8px; }
        ul { color: #555; }
        .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .swot-box { padding: 15px; border-radius: 8px; }
        .strengths { background: #d1fae5; }
        .weaknesses { background: #fee2e2; }
        .opportunities { background: #dbeafe; }
        .threats { background: #fef3c7; }
      </style>
    </head>
    <body>
      <h1>${analysisData.idea.name}</h1>
      <p><strong>Industry:</strong> ${analysisData.industry.industry} | <strong>Category:</strong> ${analysisData.industry.category}</p>
      <p><span class="score">Validation Score: ${analysisData.validationScore}/100</span></p>
      
      <h2>Executive Summary</h2>
      <p>${analysisData.businessPlan.executiveSummary}</p>
      
      <h2>Market Analysis</h2>
      <div class="metric">
        <strong>TAM:</strong> ${analysisData.market.tam}<br>
        <strong>SAM:</strong> ${analysisData.market.sam}<br>
        <strong>SOM:</strong> ${analysisData.market.som}<br>
        <strong>Growth Rate:</strong> ${analysisData.market.growthRate}
      </div>
      
      <h2>Validation Breakdown</h2>
      <ul>
        <li>Market Demand: ${analysisData.validationBreakdown.marketDemand}/100</li>
        <li>Competition: ${analysisData.validationBreakdown.competition}/100</li>
        <li>Revenue Potential: ${analysisData.validationBreakdown.revenuePotential}/100</li>
        <li>Scalability: ${analysisData.validationBreakdown.scalability}/100</li>
        <li>Innovation: ${analysisData.validationBreakdown.innovation}/100</li>
      </ul>
      
      <h2>SWOT Analysis</h2>
      <div class="swot-grid">
        <div class="swot-box strengths">
          <h3>Strengths</h3>
          <ul>${analysisData.swot.strengths.map((s: string) => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="swot-box weaknesses">
          <h3>Weaknesses</h3>
          <ul>${analysisData.swot.weaknesses.map((w: string) => `<li>${w}</li>`).join('')}</ul>
        </div>
        <div class="swot-box opportunities">
          <h3>Opportunities</h3>
          <ul>${analysisData.swot.opportunities.map((o: string) => `<li>${o}</li>`).join('')}</ul>
        </div>
        <div class="swot-box threats">
          <h3>Threats</h3>
          <ul>${analysisData.swot.threats.map((t: string) => `<li>${t}</li>`).join('')}</ul>
        </div>
      </div>
      
      <h2>Revenue Projections</h2>
      <p><strong>Conservative:</strong> Year 1: ${analysisData.revenue.conservative.year1}, Year 3: ${analysisData.revenue.conservative.year3}, Year 5: ${analysisData.revenue.conservative.year5}</p>
      <p><strong>Expected:</strong> Year 1: ${analysisData.revenue.expected.year1}, Year 3: ${analysisData.revenue.expected.year3}, Year 5: ${analysisData.revenue.expected.year5}</p>
      <p><strong>Optimistic:</strong> Year 1: ${analysisData.revenue.optimistic.year1}, Year 3: ${analysisData.revenue.optimistic.year3}, Year 5: ${analysisData.revenue.optimistic.year5}</p>
      
      <h2>Funding Recommendations</h2>
      <ul>
        ${analysisData.funding.recommendations.map((r: any) => `<li><strong>${r.type}</strong> (${r.fit}% fit): ${r.name} - ${r.description}</li>`).join('')}
      </ul>
      
      <h2>Key Milestones</h2>
      <ol>
        ${analysisData.businessPlan.milestones.map((m: string) => `<li>${m}</li>`).join('')}
      </ol>
      
      <hr style="margin-top: 50px;">
      <p style="color: #999; font-size: 12px;">Generated by StartupValidator.ai on ${new Date().toLocaleDateString()}</p>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.doc`;
  link.click();
}

export async function shareReport(analysisData: any): Promise<void> {
  const shareText = `
🚀 Startup Validation Report: ${analysisData.idea.name}

Validation Score: ${analysisData.validationScore}/100
Industry: ${analysisData.industry.industry}
Market Demand: ${analysisData.market.demandScore}/100
Success Probability: ${analysisData.successProbability}%

Key Insights:
• TAM: ${analysisData.market.tam}
• Growth Rate: ${analysisData.market.growthRate}
• Top Opportunity: ${analysisData.gaps[0]?.area || 'N/A'}

Generated by StartupValidator.ai
  `.trim();

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${analysisData.idea.name} - Startup Validation`,
        text: shareText,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  } else {
    await copyToClipboard(shareText);
    alert('Report summary copied to clipboard!');
  }
}
