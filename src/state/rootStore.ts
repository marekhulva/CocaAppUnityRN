import { create } from 'zustand';
import { createDailySlice, DailySlice } from './slices/dailySlice';
import { createGoalsSlice, GoalsSlice } from './slices/goalsSlice';
import { createSocialSlice, SocialSlice } from './slices/socialSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice';

type RootState = DailySlice & GoalsSlice & SocialSlice & UiSlice;
export const useStore = create<RootState>()((...a) => ({
  ...createUiSlice(...a),
  ...createGoalsSlice(...a),
  ...createDailySlice(...a),
  ...createSocialSlice(...a),
}));