// types.ts

export type Language = 'uz-Latn' | 'uz-Cyrl' | 'ru' | 'en';

export interface IdeaConfiguration {
  industry: string;
  investment: string;
  ideaTopic?: string;
  briefInfo?: string;

  complexity: string;
  businessModel: string[];
  isGoldenTicket: boolean;
}

export interface LeanCanvas {
  problem: string[];
  solution:string[];
  keyMetrics: string[];
  uniqueValueProposition: string;
  unfairAdvantage: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PESTLEAnalysis {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  legal: string[];
  environmental: string[];
}

export interface FinancialProjections {
  revenueForecast: { year: number; revenue: number }[];
  breakEvenAnalysis: string;
  keyAssumptions: string[];
}

export interface MarketingStrategy {
  targetAudience: string;
  channels: string[];
  keyMessage: string;
}

export interface ProjectCharter {
  mission: string;
  vision: string;
  objectives: string[];
  scope: string;
  successMetrics: string[];
  governance: string; // nizom va boshqaruv tamoyillari
  values: string[];
  stakeholders: string[];
  assumptions: string[];
  constraints: string[];
  outOfScope: string[];
  dependencies: string[];
  budgetOverview: string;
  successCriteria: string[];
}

export interface RoadmapTask {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  durationDays: number;
  dependencies: string[];
}

export interface ProjectRoadmap {
  phases: {
    name: string;
    tasks: RoadmapTask[];
  }[];
}

export interface PitchDeckSlide {
  title: string;
  content: string[];
  visualSuggestion?: string;
  investorQuestion?: string;
}

export interface PitchDeckSlideSuggestion {
  rewrittenTitle: string;
  rewrittenContent: string[];
  visualSuggestion: string;
  justification: string;
}


export interface LegalTemplate {
  name: string;
  description: string;
}

export interface BrandingGuide {
  colorPalette: { hex: string; name: string }[];
  typography: { fontFamily: string; usage: string };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ActionableChecklist {
  title: string;
  items: ChecklistItem[];
}


// New Detailed Types
export interface Competitor {
    name: string;
    strengths: string[];
    weaknesses: string[];
    strategyToBeat: string;
}
export interface CompetitiveAnalysis {
    competitors: Competitor[];
    marketPositioningStatement: string;
}

export interface Persona {
    name: string;
    demographics: string;
    goals: string[];
    painPoints: string[];
    story: string;
}
export interface TargetAudiencePersonas {
    personas: Persona[];
    summary: string;
}

export interface PricingTier {
    name: string;
    price: string;
    features: string[];
}
export interface MonetizationStrategy {
    primaryModel: string;
    description: string;
    pricingTiers: PricingTier[];
    justification: string;
}

export interface TeamRole {
    role: string;
    responsibilities: string[];
    requiredSkills: string[];
}
export interface TeamStructure {
    roles: TeamRole[];
    hiringPriorities: string;
}

export interface RiskItem {
    description: string;
    likelihood: 'Past' | 'O\'rta' | 'Yuqori' | 'Низкая' | 'Средняя' | 'Высокая' | 'Low' | 'Medium' | 'High';
    impact: 'Past' | 'O\'rta' | 'Yuqori' | 'Низкая' | 'Средняя' | 'Высокая' | 'Low' | 'Medium' | 'High';
    mitigation: string;
}
export interface RiskAnalysis {
    risks: RiskItem[];
    summary: string;
}

export interface OptimizedMonetizationSuggestion {
    optimizedTiers: PricingTier[];
    justification: string;
}

export interface StrategicSuggestion {
    area: string;
    observation: string;
    recommendation: string;
}

export interface StrategicReview {
    summary: string;
    suggestions: StrategicSuggestion[];
}


export interface StartupIdea {
  id: string; // Unique identifier for the project
  projectName: string;
  description: string;
  projectCharter: ProjectCharter;
  leanCanvas: LeanCanvas;
  swotAnalysis: SWOTAnalysis;
  pestleAnalysis: PESTLEAnalysis;
  financialProjections: FinancialProjections;
  marketingStrategy: MarketingStrategy;
  projectRoadmap: ProjectRoadmap;
  pitchDeck: PitchDeckSlide[];
  legalTemplates: LegalTemplate[];
  brandingGuide: BrandingGuide;
  actionableChecklist: ActionableChecklist;
  investorPrepAnswers?: Record<string, string>;

  // NEW DETAILED SECTIONS
  competitiveAnalysis: CompetitiveAnalysis;
  targetAudiencePersonas: TargetAudiencePersonas;
  monetizationStrategy: MonetizationStrategy;
  teamStructure: TeamStructure;
  riskAnalysis: RiskAnalysis;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LegalDocumentData {
    companyName: string;
    founderName: string;
    passportSerial: string;
    passportNumber: string;
    address: string;
    directorName: string;
    projectName: string;
}

// Kanban types
export interface KanbanTask {
    id: string;
    content: string;
}

export interface KanbanColumn {
    id: string;
    title: string;
    taskIds: string[];
}

export interface KanbanData {
    tasks: Record<string, KanbanTask>;
    columns: Record<string, KanbanColumn>;
    columnOrder: string[];
}

// New Types for User and Marketplace
export interface User {
    email: string;
    isSubscribed: boolean;
    balance: number;
    isInvestor?: boolean;
}

export interface ListedProject {
    projectId: string;
    projectName: string;
    description: string;
    fundingSought: number;
    equityOffered: number;
    pitch: string;
    founderEmail: string;
}

// New Types for Pitch Deck Simulator
export interface AISlideAnalysis {
    keyMessage: string;
    strengths: string[];
    improvements: string[];
    visualSuggestion: string;
    investorQuestion: string;
}

export interface AIPitchHealthCheck {
    readinessScore: number;
    summary: string;
    strongestSlides: string[];
    weakestSlides: string[];
    strategicRecommendations: string[];
}

export interface AnswerFeedback {
    strengths: string[];
    weaknesses: string[];
    suggestedImprovement: string;
}

export interface Notification {
    id: number;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  image_url?: string | null;
  rules_url?: string;
  submission_link?: string;
  deadline?: string | null; // ISO
  tags: string[];
  is_active: boolean;
  created_at: string;
}
