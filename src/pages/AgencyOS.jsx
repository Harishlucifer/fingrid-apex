import ProductDetailPage from '../components/ProductDetailPage';

export default function AgencyOS() {
  return (
    <ProductDetailPage
      title="AgencyOS"
      subtitle="FinGrid OS"
      description="Agency management platform for collections, verification, and field investigation teams. Streamline operations with real-time tracking and automated workflows."
      gradient="from-navy via-blue to-blue-light"
      backTo="/products/os"
      backLabel="Back to FinGrid OS"
      features={[
        { icon: '📋', title: 'Case Management', desc: 'Assign, track, and manage verification and collection cases with priority-based routing.' },
        { icon: '📍', title: 'Field Tracking', desc: 'Real-time GPS tracking of field agents with visit logging and geo-fencing.' },
        { icon: '📸', title: 'Evidence Collection', desc: 'Photo, video, and document capture with tamper-proof timestamps and location tagging.' },
        { icon: '📊', title: 'Performance Dashboards', desc: 'Agent and team performance monitoring with KPI tracking and incentive calculations.' },
        { icon: '🔔', title: 'Automated Alerts', desc: 'Smart notification system for case escalations, deadlines, and compliance triggers.' },
        { icon: '📝', title: 'Report Generation', desc: 'Automated report generation for verification results, collection summaries, and audits.' },
      ]}
      ctaTitle="Modernize Your Agency Operations"
      ctaLabel="Schedule a Demo"
    />
  );
}
