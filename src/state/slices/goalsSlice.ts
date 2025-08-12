import { StateCreator } from 'zustand';

export type Goal = {
  id: string; title: string; metric: string; deadline: string; why?: string;
  consistency: number; status: 'On Track'|'Needs Attention'|'Critical';
};
export type GoalsSlice = {
  goals: Goal[];
  addGoal: (g: Goal)=>void;
};
export const createGoalsSlice: StateCreator<GoalsSlice> = (set) => ({
  goals: [],
  addGoal: (g) => set((s)=>({ goals: [g, ...s.goals] })),
});