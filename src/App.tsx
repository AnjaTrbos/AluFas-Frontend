import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AvvikScreen from './pages/AvvikScreen';
import ComponentsTestPage from './pages/ComponentsTestPage';
import GlassMottakScreen from './pages/GlassMottakScreen';
import ImageCaptureScreen from './pages/ImageCaptureScreen';
import KSMontasjeScreen from './pages/KSMontasjeScreen';
import KSBrannprodukterScreen from './pages/KSBrannprodukterScreen';
import KSMontasjeBrannprodukterScreen from './pages/KSMontasjeBrannprodukterScreen';
import KSFastkammerScreen from './pages/KSFastkammerScreen';
import KSSmaProdukterScreen from './pages/KSSmaProdukterScreen';
import KSServiceEtterMontasjeScreen from './pages/KSServiceEtterMontasjeScreen';
import KSFasadeScreen from './pages/KSFasadeScreen';
import KSSkyvOgFoldeScreen from './pages/KSSkyvOgFoldeScreen';
import KSVerkstedScreen from './pages/KSVerkstedScreen';
import LoginScreen from './pages/LoginScreen';
import MontasjePlanScreen from './pages/MontasjePlanScreen';
import NewDocumentScreen from './pages/NewDocumentScreen';
import ProfilerMottakScreen from './pages/ProfilerMottakScreen';
import ProjectsScreen from './pages/ProjectsScreen';
import SplashScreen from './pages/SplashScreen';
import SuccessScreen from './pages/SuccessScreen';
import VarerMottakScreen from './pages/VarerMottakScreen';
import { isAuthenticated } from './utils/auth';

function ProtectedRoute({ children }: { children: ReactElement }) {
	return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {
	const pr = (el: ReactElement) => <ProtectedRoute>{el}</ProtectedRoute>;
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SplashScreen />} />
				<Route path="/login" element={<LoginScreen />} />
				<Route path="/projects"        element={pr(<ProjectsScreen />)} />
				<Route path="/new-document"    element={pr(<NewDocumentScreen />)} />
				<Route path="/avvik"           element={pr(<AvvikScreen />)} />
				<Route path="/ks-verksted"     element={pr(<KSVerkstedScreen />)} />
				<Route path="/ks-fastkammer"   element={pr(<KSFastkammerScreen />)} />
				<Route path="/ks-sma-produkter" element={pr(<KSSmaProdukterScreen />)} />
				<Route path="/ks-service-etter-montasje" element={pr(<KSServiceEtterMontasjeScreen />)} />
				<Route path="/ks-montasje"     element={pr(<KSMontasjeScreen />)} />
				<Route path="/ks-skyv-folde"      element={pr(<KSSkyvOgFoldeScreen />)} />
				<Route path="/ks-brannprodukter" element={pr(<KSBrannprodukterScreen />)} />
				<Route path="/ks-montasje-brannprodukter" element={pr(<KSMontasjeBrannprodukterScreen />)} />
				<Route path="/ks-fasade"         element={pr(<KSFasadeScreen />)} />
				<Route path="/profiler-mottak" element={pr(<ProfilerMottakScreen />)} />
				<Route path="/varer-mottak"    element={pr(<VarerMottakScreen />)} />
				<Route path="/glass-mottak"    element={pr(<GlassMottakScreen />)} />
				<Route path="/montasje-plan"   element={pr(<MontasjePlanScreen />)} />
				<Route path="/image-capture"   element={pr(<ImageCaptureScreen />)} />
				<Route path="/success"         element={pr(<SuccessScreen />)} />
				<Route path="/components-test" element={<ComponentsTestPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
