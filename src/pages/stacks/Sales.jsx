import ProductDetailPage from '../../components/ProductDetailPage';

export default function StacksSales() {
  return (
    <ProductDetailPage
      title="Sales Stack"
      subtitle="FinGrid Stacks"
      description="Comprehensive sales stack for lending teams. Manage leads, track pipelines, and close deals faster with AI-powered insights."
      gradient="from-blue via-navy to-navy-dark"
      backTo="/products/stacks"
      backLabel="Back to FinGrid Stacks"
      features={[
        { icon: '📈', title: 'Pipeline Management', desc: 'Visual sales pipeline with stage tracking and forecasting.' },
        { icon: '👥', title: 'Lead Distribution', desc: 'Automated lead assignment with territory and skill-based routing.' },
        { icon: '📱', title: 'Mobile Sales CRM', desc: 'Full-featured mobile CRM for sales teams on the field.' },
      ]}
      ctaTitle="Accelerate Your Sales"
      ctaLabel="Schedule a Demo"
    />
  );
}
