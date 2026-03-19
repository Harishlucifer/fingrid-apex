import ProductDetailPage from '../components/ProductDetailPage';

export default function LspOS() {
  return (
    <ProductDetailPage
      title="LspOS"
      subtitle="FinGrid OS"
      description="Loan Service Provider operating system for managing lending partnerships, service delivery, and end-to-end loan processing workflows."
      gradient="from-blue via-blue-dark to-navy"
      backTo="/products/os"
      backLabel="Back to FinGrid OS"
      features={[
        { icon: '🤝', title: 'Partner Management', desc: 'Manage lending partner relationships with SLA tracking and performance monitoring.' },
        { icon: '🔄', title: 'Workflow Engine', desc: 'Configurable workflows for loan processing, verification, and disbursement.' },
        { icon: '📋', title: 'Service Delivery', desc: 'Track and manage service delivery across multiple lending partners and products.' },
        { icon: '📊', title: 'Analytics', desc: 'Business analytics and reporting for operational efficiency and growth insights.' },
        { icon: '🔗', title: 'API Integration', desc: 'Pre-built integrations with major lending platforms and financial services.' },
        { icon: '📱', title: 'Digital Onboarding', desc: 'Paperless customer onboarding with eKYC, eSign, and document management.' },
      ]}
      ctaTitle="Optimize Your LSP Operations"
      ctaLabel="Schedule a Demo"
    />
  );
}
