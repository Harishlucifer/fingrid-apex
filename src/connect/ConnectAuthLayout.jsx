import { Outlet } from 'react-router-dom';
import '../connect/connect-theme.css';

// Centered, chrome-free layout for onboarding + the Company Profile / Requirement wizards.
// Deliberately has NO persistent topbar or nav rail — see 03-html-ui-reconciliation.md's
// "Restructure pass": a persistent app-shell during a linear wizard is what read as an
// internal admin console. stage1_email (4).html independently uses this exact centered,
// chrome-free pattern, which is why L8 carries it forward rather than adding a sidebar back.
// Font is Inter — same as the rest of fingrid-apex, already loaded via index.html's Google
// Fonts link, so no separate font injection is needed here (previously loaded its own
// Work Sans/Crimson Pro, which didn't match the site theme at all).
export default function ConnectAuthLayout() {
  return (
    <div className="connect-app min-h-screen flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-[640px]">
        <Outlet />
      </div>
    </div>
  );
}
