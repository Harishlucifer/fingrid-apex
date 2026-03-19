import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksCredit() {
  return (
    <ProductDetailPage
      title="Credit Stack"
      subtitle="FinGrid Stacks"
      description="AI-powered credit assessment stack for intelligent underwriting, risk scoring, and credit decisioning at scale."
      gradient="from-navy-dark via-blue to-blue-light"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '🤖', title: 'AI Credit Scoring', desc: 'Machine learning models for accurate credit risk assessment.' },
        { icon: '📋', title: 'Policy Engine', desc: 'Configurable credit policy rules with multi-level approval workflows.' },
        { icon: '📊', title: 'Risk Analytics', desc: 'Portfolio risk monitoring and early warning system.' },
      ]}
      ctaTitle="Smarter Credit Decisions"
      ctaLabel="Schedule a Demo"
    />
  );
}
