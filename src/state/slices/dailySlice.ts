import { StateCreator } from 'zustand';
export type ActionItem = { id: string; title: string; goalTitle?: string; type:'commitment'|'performance'|'one-time'; time?: string; streak: number; done?: boolean; };

export type DailySlice = {
  actions: ActionItem[];
  toggleAction: (id:string)=>void;
  addAction: (a:ActionItem)=>void;
};
export const createDailySlice: StateCreator<DailySlice> = (set) => ({
  actions: [
    { id:'1', title:'Morning workout', goalTitle:'Lose 10 lbs', type:'commitment', time:'7:00', streak:7 },
    { id:'2', title:'Meditation 10m', type:'performance', streak:3 },
  ],
  toggleAction: (id) => set((s)=>({ actions: s.actions.map(a => a.id===id ? ({...a, done: !a.done, streak: a.done ? a.streak : a.streak+1}) : a) })),
  addAction: (a) => set((s)=>({ actions: [a, ...s.actions] })),
});