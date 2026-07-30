import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Fingrid Connect — mounted OUTSIDE the marketing Navbar/Footer, per
// fingrid-connect-integration-plan.md's routing decision (Connect is a stateful, logged-in
// "app" zone, not a marketing page). See src/connect/ for the module itself.
import { ConnectProvider } from './connect/state/ConnectContext';
import { TenantProvider } from './connect/state/TenantContext';
import { LookupsProvider } from './connect/state/LookupsContext';
import ConnectAuthLayout from './connect/ConnectAuthLayout';
import ConnectAppLayout from './connect/ConnectAppLayout';
import ConnectAdminLayout from './connect/ConnectAdminLayout';
import AdminLogin from './connect/pages/admin/AdminLogin';
import PartnerOversight from './connect/pages/admin/PartnerOversight';
import RequirementModeration from './connect/pages/admin/RequirementModeration';
import OnboardingWizard from './connect/pages/onboarding/OnboardingWizard';
import SignIn from './connect/pages/onboarding/SignIn';
import CompanyProfileWizard from './connect/pages/company/CompanyProfileWizard';
import RequirementWizard from './connect/pages/requirements/RequirementWizard';
import Dashboard from './connect/pages/home/Dashboard';
import Directory from './connect/pages/home/Directory';
import MyRequirements from './connect/pages/home/MyRequirements';
import Matches from './connect/pages/home/Matches';
import Requests from './connect/pages/home/Requests';
import Partners from './connect/pages/home/Partners';
import PartnerDetail from './connect/pages/home/PartnerDetail';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';

// FinGrid Studio
import Studio from './pages/Studio';

// FinGrid Stacks
import Stacks from './pages/Stacks';
import StacksMarketing from './pages/stacks/Marketing';
import StacksSales from './pages/stacks/Sales';
import StacksCredit from './pages/stacks/Credit';
import StacksLoanLifecycle from './pages/stacks/LoanLifecycle';
import StacksCollections from './pages/stacks/Collections';
import StacksAccounting from './pages/stacks/Accounting';

// FinGrid OS
import FinGridOS from './pages/FinGridOS';
import LenderOS from './pages/LenderOS';
import BcOS from './pages/BcOS';
import DsaOS from './pages/DsaOS';
import LspOS from './pages/LspOS';
import AgencyOS from './pages/AgencyOS';
import AutoDealerOS from './pages/AutoDealerOS';

// FinGrid Network
import FinGridNetwork from './pages/FinGridNetwork';
import NetworkRegister from './pages/network/Register';
import ProfileDueDiligence from './pages/network/ProfileDueDiligence';
import Discover from './pages/network/Discover';
import NetworkPage from './pages/network/Network';
import DealRoom from './pages/network/DealRoom';
import Integrate from './pages/network/Integrate';

// FinGrid AI
import AgenticAI from './pages/AgenticAI';

// Innovation & GTM
import Innovation from './pages/Innovation';
import GTMStrategy from './pages/GTMStrategy';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Wraps every marketing page in the existing Navbar/Footer chrome. Unchanged behavior from
// before this refactor — only the JSX nesting moved, to make room for /connect/* to render
// as a sibling route tree that bypasses this chrome entirely.
function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />

          {/* FinGrid Studio */}
          <Route path="/products/studio" element={<Studio />} />

          {/* FinGrid Stacks */}
          <Route path="/products/stacks" element={<Stacks />} />
          <Route path="/products/stacks/marketing" element={<StacksMarketing />} />
          <Route path="/products/stacks/sales" element={<StacksSales />} />
          <Route path="/products/stacks/credit" element={<StacksCredit />} />
          <Route path="/products/stacks/loan-lifecycle" element={<StacksLoanLifecycle />} />
          <Route path="/products/stacks/collections" element={<StacksCollections />} />
          <Route path="/products/stacks/accounting" element={<StacksAccounting />} />

          {/* FinGrid OS */}
          <Route path="/products/os" element={<FinGridOS />} />
          <Route path="/products/os/lender-os" element={<LenderOS />} />
          <Route path="/products/os/bc-os" element={<BcOS />} />
          <Route path="/products/os/dsa-os" element={<DsaOS />} />
          <Route path="/products/os/lsp-os" element={<LspOS />} />
          <Route path="/products/os/agency-os" element={<AgencyOS />} />
          <Route path="/products/os/auto-dealer-os" element={<AutoDealerOS />} />

          {/* FinGrid Network */}
          <Route path="/products/network" element={<FinGridNetwork />} />
          <Route path="/products/network/register" element={<NetworkRegister />} />
          <Route path="/products/network/profile-due-diligence" element={<ProfileDueDiligence />} />
          <Route path="/products/network/discover" element={<Discover />} />
          <Route path="/products/network/network" element={<NetworkPage />} />
          <Route path="/products/network/deal-room" element={<DealRoom />} />
          <Route path="/products/network/integrate" element={<Integrate />} />

          {/* FinGrid AI */}
          <Route path="/products/agentic-ai" element={<AgenticAI />} />

          {/* Innovation & GTM */}
          <Route path="/innovation" element={<Innovation />} />
          <Route path="/gtm-strategy" element={<GTMStrategy />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Fingrid Connect admin/internal-staff view (WF5) — a separate identity (Fingrid
            employee, not a partner channel) with its own login and token, so it's registered
            as its own subtree rather than nested inside ConnectProvider. React Router ranks
            this ahead of the more general "/connect/*" route below by specificity regardless
            of declaration order, but keeping it first here too for readability. */}
        <Route path="/connect/admin/login" element={<AdminLogin />} />
        <Route element={<ConnectAdminLayout />}>
          <Route path="/connect/admin/partners" element={<PartnerOversight />} />
          <Route path="/connect/admin/requirements" element={<RequirementModeration />} />
        </Route>

        {/* Fingrid Connect — no marketing Navbar/Footer. Wizards (onboarding/company-profile/
            requirement-listing) use the chrome-free ConnectAuthLayout; the logged-in home base
            (dashboard/directory/matches/requests/partners) uses ConnectAppLayout. */}
        <Route
          path="/connect/*"
          element={
            <TenantProvider>
            <LookupsProvider>
            <ConnectProvider>
              <Routes>
                <Route element={<ConnectAuthLayout />}>
                  <Route path="login" element={<SignIn />} />
                  {/* :channelId is optional — set when resuming an abandoned registration (see
                      OnboardingWizard's existing_registration handling), mirroring craft-frontend's
                      /register/:id, which carries the channel id in the URL once one exists. */}
                  <Route path="join/:channelId?" element={<OnboardingWizard />} />
                  <Route path="company" element={<CompanyProfileWizard />} />
                  <Route path="requirements/new" element={<RequirementWizard />} />
                  {/* Resuming an existing draft (see MyRequirements.jsx's "Continue editing")
                      loads it by id and continues its CONNECT_REQUIREMENT workflow instance from
                      the same step — matches CompanyProfileWizard's per-channel resume. */}
                  <Route path="requirements/:requirementId" element={<RequirementWizard />} />
                </Route>
                <Route element={<ConnectAppLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="directory" element={<Directory />} />
                  <Route path="requirements" element={<MyRequirements />} />
                  <Route path="matches" element={<Matches />} />
                  <Route path="requests" element={<Requests />} />
                  <Route path="partners" element={<Partners />} />
                  <Route path="partners/:channelId" element={<PartnerDetail />} />
                </Route>
              </Routes>
            </ConnectProvider>
            </LookupsProvider>
            </TenantProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
