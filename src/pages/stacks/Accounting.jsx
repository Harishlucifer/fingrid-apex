import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksAccounting() {
  return (
    <ProductDetailPage
      title="Accounting Stack"
      subtitle="FinGrid Stacks"
      description="Financial accounting and regulatory reporting stack for lending institutions. Automate GL entries, reconciliation, and compliance reporting."
      gradient="from-navy-dark via-navy to-blue"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '📒', title: 'General Ledger', desc: 'Automated GL entries with configurable chart of accounts for lending operations.' },
        { icon: '🔄', title: 'Reconciliation', desc: 'Automated bank and payment reconciliation with exception handling.' },
        { icon: '📊', title: 'Regulatory Reporting', desc: 'Pre-built templates for RBI, NHB, and other regulatory reporting requirements.' },
      ]}
      ctaTitle="Automate Your Lending Accounting"
      ctaLabel="Schedule a Demo"
    />
  );
}
