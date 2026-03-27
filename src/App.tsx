import type { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AvvikScreen from './pages/AvvikScreen';
import ComponentsTestPage from './pages/ComponentsTestPage';
import GlassMottakScreen from './pages/GlassMottakScreen';
import ImageCaptureScreen from './pages/ImageCaptureScreen';
import KSMontasjeScreen from './pages/KSMontasjeScreen';
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
				<Route path="/ks-montasje"     element={pr(<KSMontasjeScreen />)} />
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
