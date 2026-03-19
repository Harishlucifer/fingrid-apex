import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksLoanLifecycle() {
  return (
    <ProductDetailPage
      title="Loan Life Cycle Stack"
      subtitle="FinGrid Stacks"
      description="End-to-end loan lifecycle management from origination to closure. Automate every stage with configurable workflows."
      gradient="from-navy via-navy-dark to-blue"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '🔄', title: 'Lifecycle Automation', desc: 'Automated transitions across loan stages with rule-based triggers.' },
        { icon: '📝', title: 'Document Management', desc: 'Digital document collection, verification, and secure storage.' },
        { icon: '💳', title: 'EMI Management', desc: 'Flexible EMI schedules, auto-debit mandates, and payment tracking.' },
      ]}
      ctaTitle="Streamline Your Loan Lifecycle"
      ctaLabel="Schedule a Demo"
    />
  );
}
