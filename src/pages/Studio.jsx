import ProductDetailPage from '../components/ProductDetailPage';

export default function Studio() {
  return (
    <ProductDetailPage
      title="FinGrid Studio"
      subtitle="Low-Code Platform"
      description="Low code Studio that facilitates ease of Building domain specific processes. Design, build, and deploy financial workflows visually without writing complex code."
      gradient="from-blue via-blue-dark to-navy"
      features={[
        { icon: '🎨', title: 'Visual Builder', desc: 'Drag-and-drop interface for building complex financial workflows without code.' },
        { icon: '🧩', title: 'Pre-built Components', desc: 'Library of pre-built financial components ready to customize and deploy.' },
        { icon: '⚡', title: 'Rapid Deployment', desc: 'Go from prototype to production in days, not months.' },
        { icon: '🔄', title: 'Process Automation', desc: 'Automate repetitive tasks with intelligent workflow triggers.' },
        { icon: '📋', title: 'Template Library', desc: 'Industry-specific templates for common lending processes.' },
        { icon: '🔧', title: 'Custom Extensions', desc: 'Extend functionality with custom scripts and API integrations.' },
      ]}
      ctaTitle="Start Building with FinGrid Studio"
      ctaLabel="Request a Demo"
    />
  );
}
