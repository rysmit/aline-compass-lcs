import { useParams } from "react-router-dom";
import { MetricDrilldown } from "@/components/dashboard/MetricDrilldown";

export function MetricDetail() {
  const { metric } = useParams<{ metric: string }>();
  
  const getMetricConfig = (metricType: string) => {
    switch (metricType) {
      case 'noi-per-unit':
        return {
          title: 'NOI per Unit',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Financial Health', href: '/?tab=financial' },
            { label: 'NOI per Unit' }
          ]
        };
      case 'move-in-velocity':
        return {
          title: 'Move-In Velocity',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Sales Pipeline', href: '/?tab=sales' },
            { label: 'Move-In Velocity' }
          ]
        };
      case 'tour-conversion':
        return {
          title: 'Tour-to-Move-In Conversion',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Sales Pipeline', href: '/?tab=sales' },
            { label: 'Tour Conversion' }
          ]
        };
      case 'readmission-rate':
        return {
          title: 'Readmission Rate',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Census & Occupancy', href: '/?tab=census' },
            { label: 'Readmission Rate' }
          ]
        };
      case 'ar-risk':
        return {
          title: 'AR Risk Index',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Financial Health', href: '/?tab=financial' },
            { label: 'AR Risk Index' }
          ]
        };
      case 'rpou':
        return {
          title: 'Revenue per Occupied Unit',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Census & Occupancy', href: '/?tab=census' },
            { label: 'Revenue per Unit' }
          ]
        };
      default:
        return {
          title: 'Metric Analysis',
          breadcrumbItems: [
            { label: 'Dashboard', href: '/' },
            { label: 'Metric Detail' }
          ]
        };
    }
  };

  const config = getMetricConfig(metric || '');

  return (
    <MetricDrilldown
      metric={config.title}
      title={config.title}
      data={[]}
      breadcrumbItems={config.breadcrumbItems}
    />
  );
}