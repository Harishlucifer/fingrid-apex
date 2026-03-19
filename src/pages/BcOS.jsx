import ProductDetailPage from '../components/ProductDetailPage';

export default function BcOS() {
  return (
    <ProductDetailPage
      title="BcOS"
      subtitle="FinGrid OS"
      description="Operating system for Business Correspondents to manage field operations, customer touchpoints, and regulatory compliance with real-time visibility."
      gradient="from-blue via-navy to-navy-dark"
      backTo="/products/os"
      backLabel="Back to FinGrid OS"
      features={[
        { icon: '👥', title: 'Agent Management', desc: 'Onboard, train, and manage field agents with performance tracking and incentive management.' },
        { icon: '📍', title: 'Field Operations', desc: 'GPS-enabled field visit tracking, customer verification, and on-ground data collection.' },
        { icon: '📱', title: 'Mobile First', desc: 'Native mobile experience for agents to handle customer interactions on the go.' },
        { icon: '✅', title: 'KYC & Compliance', desc: 'Digital KYC, document collection, and regulatory compliance automation.' },
        { icon: '📊', title: 'Reporting', desc: 'Real-time dashboards for branch and agent performance monitoring.' },
        { icon: '🔗', title: 'Lender Integration', desc: 'Seamless integration with multiple lender systems for application submission and tracking.' },
      ]}
      ctaTitle="Empower Your BC Network"
      ctaLabel="Schedule a Demo"
    />
  );
}
