import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksCollections() {
  return (
    <ProductDetailPage
      title="Collections Stack"
      subtitle="FinGrid Stacks"
      description="Intelligent collections management with automated dunning, field tracking, and resolution workflows for maximizing recovery rates."
      gradient="from-blue via-navy to-navy-dark"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '📞', title: 'Automated Dunning', desc: 'Multi-channel collection communication with SMS, email, and call scheduling.' },
        { icon: '📍', title: 'Field Collection', desc: 'Field agent management with GPS tracking and visit scheduling.' },
        { icon: '📊', title: 'Recovery Analytics', desc: 'Recovery rate tracking, prediction models, and portfolio health monitoring.' },
      ]}
      ctaTitle="Improve Your Collection Efficiency"
      ctaLabel="Schedule a Demo"
    />
  );
}
