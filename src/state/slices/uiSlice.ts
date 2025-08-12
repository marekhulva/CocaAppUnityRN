import { StateCreator } from 'zustand';

export type UiSlice = {
  feedView: 'circle'|'follow';
  setFeedView: (v:'circle'|'follow')=>void;

  // Daily review modal visibility
  isDailyReviewOpen: boolean;
  openDailyReview: () => void;
  closeDailyReview: () => void;
};

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  feedView: 'circle',
  setFeedView: (v)=>set({ feedView:v }),

  isDailyReviewOpen: false,
  openDailyReview: () => set({ isDailyReviewOpen: true }),
  closeDailyReview: () => set({ isDailyReviewOpen: false }),
});