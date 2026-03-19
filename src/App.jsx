import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
