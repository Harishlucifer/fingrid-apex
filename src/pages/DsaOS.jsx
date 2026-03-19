import ProductDetailPage from '../components/ProductDetailPage';

export default function DsaOS() {
  return (
    <ProductDetailPage
      title="DsaOS"
      subtitle="FinGrid OS"
      description="End-to-end platform for DSAs to source, process, and track loan applications efficiently across multiple lenders with a unified dashboard."
      gradient="from-navy-dark via-navy to-blue"
      backTo="/products/os"
      backLabel="Back to FinGrid OS"
      features={[
        { icon: '🔍', title: 'Lead Management', desc: 'Capture, qualify, and distribute leads across your team with automated assignment rules.' },
        { icon: '📝', title: 'Application Processing', desc: 'Multi-lender application submission with smart product matching and eligibility checks.' },
        { icon: '📊', title: 'Commission Tracking', desc: 'Automated commission calculation, tracking, and reconciliation across lenders.' },
        { icon: '👥', title: 'Team Management', desc: 'Manage your sales team with territory mapping, target setting, and performance dashboards.' },
        { icon: '🏦', title: 'Multi-Lender Panel', desc: 'Manage relationships with multiple lending partners from a single interface.' },
        { icon: '📱', title: 'Mobile CRM', desc: 'Full-featured mobile CRM for on-field sales teams with offline capabilities.' },
      ]}
      ctaTitle="Scale Your DSA Business"
      ctaLabel="Schedule a Demo"
    />
  );
}
