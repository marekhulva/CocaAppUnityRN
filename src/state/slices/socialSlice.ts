import { StateCreator } from 'zustand';
export type Post = { id:string; user:string; type:'checkin'|'goal'|'prompt'|'free'; content:string; reactions: Record<string, number>; time:string; };
export type SocialSlice = {
  circleFeed: Post[]; followFeed: Post[];
  react: (id:string, emoji:string, which:'circle'|'follow')=>void;
  addPost: (p:Post, which:'circle'|'follow')=>void;
};
export const createSocialSlice: StateCreator<SocialSlice> = (set) => ({
  circleFeed: [{ id:'p1', user:'Sarah', type:'checkin', content:'Crushed HIIT 💪', reactions:{'👏':5,'🔥':3}, time:'2h' }],
  followFeed: [{ id:'p2', user:'Jordan', type:'prompt', content:'Hardest part was skipping donuts', reactions:{'👏':2}, time:'1h' }],
  react: (id, emoji, which) => set((s)=>({
    [which==='circle'?'circleFeed':'followFeed']: (which==='circle'?s.circleFeed:s.followFeed).map(p => p.id===id ? ({...p, reactions:{...p.reactions, [emoji]:(p.reactions[emoji]||0)+1}}) : p)
  })),
  addPost: (p, which) => set((s)=>({ [which==='circle'?'circleFeed':'followFeed']: [p, ...(which==='circle'?s.circleFeed:s.followFeed)] } as any)),
});