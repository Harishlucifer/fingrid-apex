import ProductDetailPage from '../components/ProductDetailPage';

export default function AutoDealerOS() {
  return (
    <ProductDetailPage
      title="AutoDealerOS"
      subtitle="FinGrid OS"
      description="Auto dealer financing platform for vehicle loan origination, dealer management, and multi-lender integration. Purpose-built for the automotive lending ecosystem."
      gradient="from-navy-dark via-navy to-mint-dark"
      backTo="/products/os"
      backLabel="Back to FinGrid OS"
      features={[
        { icon: '🚗', title: 'Vehicle Loan Origination', desc: 'Streamlined vehicle loan applications with real-time eligibility checks across multiple lenders.' },
        { icon: '🏪', title: 'Dealer Management', desc: 'Manage dealer relationships, inventory financing, and floor plan facilities.' },
        { icon: '📊', title: 'Pricing Engine', desc: 'Dynamic pricing and rate comparison across lending partners for best customer offers.' },
        { icon: '📋', title: 'Document Management', desc: 'Digital document collection, RC verification, and insurance integration.' },
        { icon: '💰', title: 'Payout Management', desc: 'Automated dealer payout calculations, tracking, and reconciliation.' },
        { icon: '🔗', title: 'Multi-Lender Integration', desc: 'Pre-integrated with major auto loan lenders for instant decisioning and disbursement.' },
      ]}
      ctaTitle="Accelerate Auto Financing"
      ctaLabel="Schedule a Demo"
    />
  );
}
