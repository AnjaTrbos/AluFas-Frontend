import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SplashScreen />} />
				<Route path="/login" element={<LoginScreen onBack={() => {}} onLoginSuccess={() => {}} />} />
				<Route path="/projects" element={<ProjectsScreen />} />
				<Route path="/new-document" element={<NewDocumentScreen />} />
				<Route path="/avvik" element={<AvvikScreen />} />
				<Route path="/ks-verksted" element={<KSVerkstedScreen />} />
				<Route path="/ks-montasje" element={<KSMontasjeScreen />} />
				<Route path="/profiler-mottak" element={<ProfilerMottakScreen />} />
				<Route path="/varer-mottak" element={<VarerMottakScreen />} />
				<Route path="/glass-mottak" element={<GlassMottakScreen />} />
				<Route path="/montasje-plan" element={<MontasjePlanScreen />} />
				<Route path="/image-capture" element={<ImageCaptureScreen />} />
				<Route path="/success" element={<SuccessScreen />} />
				<Route path="/components-test" element={<ComponentsTestPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
