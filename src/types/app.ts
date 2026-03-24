export type ScreenType =
  | 'splash'
  | 'login'
  | 'projects'
  | 'projectDetail'
  | 'newDocument'
  | 'profilerMottak'
  | 'varerMottak'
  | 'ksVerksted'
  | 'ksMontasje'
  | 'glassMottak'
  | 'avvik'
  | 'montasjePlan'
  | 'success'
  | 'imageCapture';

export type MontasjeType = 'vindu' | 'dor' | 'glass' | null;

export type DocumentTypeId =
  | 'avvik'
  | 'ks-verksted'
  | 'ks-montasje'
  | 'vindu-montasje'
  | 'dor-montasje'
  | 'glass-montasje'
  | 'glass-mottak'
  | 'montasje-plan'
  | 'profiler-mottak'
  | 'varer-mottak';

export type Language = 'no' | 'en';

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  location: string;
  lastUpdated: string;
  status: 'active' | 'closed';
  type: 'window' | 'facade' | 'door' | 'general';
}

export type ProjectType = Project['type'];
export type ProjectStatus = Project['status'];

export interface SelectedProject {
  id: string;
  number: string;
  name: string;
}

export interface Document {
  id: string;
  type: 'deviation' | 'quality' | 'process' | 'material';
  title: string;
  date: string;
  status: 'pending' | 'completed';
}

export type DocumentCategory = Document['type'];

export interface DocumentTypeOption {
  id: string;
  label: string;
  icon: unknown;
  color: string;
  subItems?: Array<{
    id: string;
    label: string;
  }>;
}

export interface CheckPoint {
  id: string;
  label: string;
  ok: boolean;
  notOk: boolean;
  remark: string;
}

export interface CheckItem {
  id: number;
  title: string;
  items: string[];
  checkedItems: Record<string, boolean>;
  materials: {
    alu: boolean;
    tre: boolean;
    pvc: boolean;
  };
}

export interface AvvikFormData {
  projectNumber: string;
  projectName: string;
  location: {
    verksted: boolean;
    kontor: boolean;
    montasje: boolean;
  };
  deviationType: string;
  immediateActions: string;
  discoveredBy: string;
  reportedTo: string;
  actionType: string;
  responsible: string;
  monitoringResult: string;
  preventionMeasures: string;
  date: string;
  createdBy: string;
  timestamp: string;
}

export interface KSMontasjeFormData {
  projectNumber: string;
  projectName: string;
  posNumber: string;
  checkPoints: CheckPoint[];
  defectsFixed: string;
  otherRemarks: string;
  installerSignature: string;
  signatureDate: string;
  timestamp: string;
}

export interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export interface ProjectsScreenProps {
  onProjectSelect: (projectId: string, projectNumber: string, projectName: string) => void;
  onProfilerMottakClick: () => void;
}

export interface ProjectDetailScreenProps {
  projectId: string;
  projectNumber: string;
  projectName: string;
  onBack: () => void;
  onNewDocument: () => void;
}

export interface NewDocumentScreenProps {
  projectNumber: string;
  projectName: string;
  onBack: () => void;
  onSelectType: (type: string) => void;
}

export interface ProfilerMottakScreenProps {
  onBack: () => void;
  projectNumber?: string;
  projectName?: string;
  onSubmit?: (type: string) => void;
  onDirectSubmit?: (type: string) => void;
}

export interface KSVerkstedScreenProps {
  onBack: () => void;
  projectNumber?: string;
  projectName?: string;
  onSubmit?: (type: string) => void;
}

export interface KSMontasjeScreenProps {
  onBack: () => void;
  projectNumber: string;
  projectName: string;
  onSubmit?: (type: string) => void;
  onDirectSubmit?: (type: string) => void;
  montasjeType?: MontasjeType;
}

export interface GlassMottakScreenProps {
  onBack: () => void;
  projectNumber: string;
  projectName: string;
  onSubmit?: (type: string) => void;
  onDirectSubmit?: (type: string) => void;
}

export interface AvvikScreenProps {
  onBack: () => void;
  projectNumber?: string;
  projectName?: string;
  onSubmit?: (type: string) => void;
  onDirectSubmit?: (type: string) => void;
}

export interface SuccessScreenProps {
  documentType: string;
  projectNumber?: string;
  projectName?: string;
  onBackToProject: () => void;
  onBackToHome: () => void;
}

export interface ImageCaptureScreenProps {
  onBack: () => void;
  onImagesSelected: (images: string[]) => void;
  existingImages?: string[];
  maxImages?: number;
}