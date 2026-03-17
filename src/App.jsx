import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Lending from './pages/Lending';
import BcDs from './pages/BcDs';
import Dsaas from './pages/Dsaas';
import OsSuite from './pages/OsSuite';
import Stacks from './pages/Stacks';

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
            <Route path="/products/lending" element={<Lending />} />
            <Route path="/products/lending/bc-ds" element={<BcDs />} />
            <Route path="/products/lending/dsaas" element={<Dsaas />} />
            <Route path="/products/os-suite" element={<OsSuite />} />
            <Route path="/products/stacks" element={<Stacks />} />
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
