import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksMarketing() {
  return (
    <ProductDetailPage
      title="Marketing Stack"
      subtitle="FinGrid Stacks"
      description="Domain-specific marketing stack for lending institutions. Automate campaigns, track leads, and optimize customer acquisition across channels."
      gradient="from-navy via-navy-dark to-blue"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '📧', title: 'Campaign Management', desc: 'Multi-channel campaign orchestration with A/B testing and performance tracking.' },
        { icon: '🎯', title: 'Lead Generation', desc: 'Automated lead capture and qualification through digital channels.' },
        { icon: '📊', title: 'Analytics', desc: 'Marketing analytics with ROI tracking and attribution modeling.' },
      ]}
      ctaTitle="Boost Your Lending Marketing"
      ctaLabel="Schedule a Demo"
    />
  );
}
