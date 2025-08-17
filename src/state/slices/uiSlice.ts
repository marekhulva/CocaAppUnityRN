import { StateCreator } from 'zustand';

export type Visibility = 'circle'|'follow';
export type ShareDraft = {
  type: 'checkin'|'status'|'photo'|'audio';
  visibility: Visibility;
  // check-in specific
  actionTitle?: string; 
  goal?: string; 
  streak?: number; 
  goalColor?: string;
  // content
  text?: string;
  photoUri?: string;
  audioUri?: string;
  promptSeed?: string;
};

export type AppState = 'setup' | 'main';

export type SetupState = {
  currentStep: number;
  goalData: {
    title: string;
    metric: string;
    deadline: string;
    why: string;
    privacy: 'public' | 'private';
  };
  performanceHabits: Array<{
    id: string;
    name: string;
    time?: string;
    reminder?: boolean;
  }>;
  milestones: Array<{
    name: string;
    outcome: string;
    date: string;
  }>;
  actions: Array<{
    type: 'one-time' | 'commitment';
    name: string;
    why: string;
    date?: string;
    frequency?: 'daily' | 'weekly' | 'weekdays' | 'custom';
    milestoneLink?: string;
  }>;
};

export type UiSlice = {
  feedView: Visibility;
  setFeedView: (v:Visibility)=>void;

  // Daily review modal visibility
  isDailyReviewOpen: boolean;
  openDailyReview: () => void;
  closeDailyReview: () => void;
  
  // NEW: share composer
  shareOpen: boolean;
  shareDraft?: ShareDraft;
  openShare: (draft: ShareDraft)=>void;
  closeShare: ()=>void;
  
  // App state management
  appState: AppState;
  setAppState: (state: AppState)=>void;
  currentScreen: string;
  setCurrentScreen: (screen: string)=>void;
  
  // Setup wizard state
  setupState: SetupState;
  updateSetupState: (updates: Partial<SetupState>)=>void;
  resetSetupState: ()=>void;
  finishSetup: ()=>void;
};

const initialSetupState: SetupState = {
  currentStep: 0,
  goalData: {
    title: '',
    metric: '',
    deadline: '',
    why: '',
    privacy: 'private',
  },
  performanceHabits: [],
  milestones: [],
  actions: [],
};

export const createUiSlice: StateCreator<UiSlice> = (set, get) => ({
  feedView: 'circle',
  setFeedView: (v)=>set({ feedView:v }),

  isDailyReviewOpen: false,
  openDailyReview: () => set({ isDailyReviewOpen: true }),
  closeDailyReview: () => set({ isDailyReviewOpen: false }),
  
  shareOpen: false,
  shareDraft: undefined,
  openShare: (draft)=>set({ shareOpen: true, shareDraft: draft }),
  closeShare: ()=>set({ shareOpen: false, shareDraft: undefined }),
  
  // App state management
  appState: 'setup', // Start with setup for onboarding
  setAppState: (state)=>set({ appState: state }),
  currentScreen: 'social',
  setCurrentScreen: (screen)=>set({ currentScreen: screen }),
  
  // Setup wizard state
  setupState: initialSetupState,
  updateSetupState: (updates)=>set((state) => ({
    setupState: { ...state.setupState, ...updates }
  })),
  resetSetupState: ()=>set({ setupState: initialSetupState }),
  finishSetup: ()=>set({ 
    setupState: initialSetupState, 
    appState: 'main',
    currentScreen: 'social'
  }),
});