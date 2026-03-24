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
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SplashScreen />} />
				<Route path="/login" element={<LoginScreen onBack={() => {}} onLoginSuccess={() => {}} />} />
				<Route
					path="/projects"
					element={
						<ProtectedRoute>
							<ProjectsScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/new-document"
					element={
						<ProtectedRoute>
							<NewDocumentScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/avvik"
					element={
						<ProtectedRoute>
							<AvvikScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ks-verksted"
					element={
						<ProtectedRoute>
							<KSVerkstedScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/ks-montasje"
					element={
						<ProtectedRoute>
							<KSMontasjeScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profiler-mottak"
					element={
						<ProtectedRoute>
							<ProfilerMottakScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/varer-mottak"
					element={
						<ProtectedRoute>
							<VarerMottakScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/glass-mottak"
					element={
						<ProtectedRoute>
							<GlassMottakScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/montasje-plan"
					element={
						<ProtectedRoute>
							<MontasjePlanScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/image-capture"
					element={
						<ProtectedRoute>
							<ImageCaptureScreen />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/success"
					element={
						<ProtectedRoute>
							<SuccessScreen />
						</ProtectedRoute>
					}
				/>
				<Route path="/components-test" element={<ComponentsTestPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
