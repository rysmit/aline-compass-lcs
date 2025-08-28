// Smart data source mapping based on metric content
export interface MetricDataSource {
  sources: string[];
  isInferred?: boolean;
}

export function getMetricDataSources(title: string, subtitle?: string): MetricDataSource {
  const titleLower = title.toLowerCase();
  const subtitleLower = subtitle?.toLowerCase() || '';
  const combined = `${titleLower} ${subtitleLower}`;

  // Financial metrics - typically from billing/accounting systems
  if (combined.includes('revenue') || combined.includes('rpou') || combined.includes('financial') || 
      combined.includes('billing') || combined.includes('payment') || combined.includes('collection')) {
    return { sources: ['Billing', 'Accounting'] };
  }

  // Census and occupancy metrics - from property management systems
  if (combined.includes('census') || combined.includes('occupancy') || combined.includes('units') ||
      combined.includes('occupied') || combined.includes('move-in') || combined.includes('move-out')) {
    return { sources: ['PMS', 'CRM'] };
  }

  // Care and health metrics - from eMar/clinical systems
  if (combined.includes('care') || combined.includes('medication') || combined.includes('readmission') ||
      combined.includes('incident') || combined.includes('compliance') || combined.includes('health') ||
      combined.includes('clinical') || combined.includes('vitals')) {
    return { sources: ['eMar', 'Clinical'] };
  }

  // Length of stay - calculated from multiple systems
  if (combined.includes('length of stay') || combined.includes('los') || combined.includes('stay')) {
    return { sources: ['PMS', 'CRM', 'Billing'], isInferred: true };
  }

  // Sales and pipeline metrics - from CRM
  if (combined.includes('pipeline') || combined.includes('lead') || combined.includes('conversion') ||
      combined.includes('inquiry') || combined.includes('response time') || combined.includes('sales')) {
    return { sources: ['CRM'] };
  }

  // Forecast metrics - derived from multiple sources
  if (combined.includes('forecast') || combined.includes('prediction') || combined.includes('projected') ||
      combined.includes('30-day') || combined.includes('predictive')) {
    return { sources: ['PMS', 'CRM', 'Historical'], isInferred: true };
  }

  // Churn and risk metrics - calculated from multiple sources
  if (combined.includes('churn') || combined.includes('risk') || combined.includes('retention')) {
    return { sources: ['PMS', 'CRM', 'Clinical'], isInferred: true };
  }

  // Staff metrics - from HR/scheduling systems
  if (combined.includes('staff') || combined.includes('employee') || combined.includes('time per resident')) {
    return { sources: ['HR', 'Scheduling'] };
  }

  // Default fallback - most metrics come from CRM
  return { sources: ['CRM'] };
}