import ProductDetailPage from '../components/ProductDetailPage';

export default function FinGridOS() {
  return (
    <ProductDetailPage
      title="FinGrid OS"
      subtitle="Operating Systems"
      description="FinGrid AI offers Operating Systems for each player in the Lending Ecosystem. Purpose-built platforms that power lenders, business correspondents, DSAs, LSPs, agencies, and auto dealers."
      gradient="from-mint-dark via-[#15a366] to-navy"
      features={[
        { icon: '🏦', title: 'LenderOS', desc: 'Complete operating system for lenders — manage origination, underwriting, disbursement, and servicing.' },
        { icon: '🤝', title: 'BcOS', desc: 'Operating system for Business Correspondents to manage field operations and customer touchpoints.' },
        { icon: '📱', title: 'DsaOS', desc: 'End-to-end platform for DSAs to source, process, and track loan applications efficiently.' },
        { icon: '🔗', title: 'LspOS', desc: 'Loan Service Provider OS for managing lending partnerships and service delivery.' },
        { icon: '🏢', title: 'AgencyOS', desc: 'Agency management platform for collections, verification, and field investigation teams.' },
        { icon: '🚗', title: 'AutoDealerOS', desc: 'Auto dealer financing platform for vehicle loan origination and dealer management.' },
      ]}
      ctaTitle="Explore FinGrid OS Solutions"
      ctaLabel="Schedule a Demo"
    />
  );
}
