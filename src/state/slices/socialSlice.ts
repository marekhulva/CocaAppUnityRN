import { StateCreator } from 'zustand';

export type PostType = 'checkin'|'status'|'photo'|'audio'|'goal';
export type Visibility = 'circle'|'follow';

export type Post = {
  id: string;
  user: string;
  avatar?: string;              // emoji or URL
  type: PostType;
  visibility: Visibility;
  content: string;              // status/insight or caption
  time: string;                 // "2h"
  reactions: Record<string, number>;
  comments?: number;
  // media
  photoUri?: string;
  audioUri?: string;
  // check-in metadata
  actionTitle?: string;
  goal?: string;
  streak?: number;
  goalColor?: string;           // hex used for chip/glow
};

export type SocialSlice = {
  circleFeed: Post[]; 
  followFeed: Post[];
  react: (id:string, emoji:string, which:Visibility)=>void;
  addPost: (p:Post)=>void; // routes by p.visibility
};

export const createSocialSlice: StateCreator<SocialSlice> = (set) => ({
  circleFeed: [{
    id:'p1', user:'Sarah', avatar:'👩‍💼', visibility:'circle',
    type:'checkin', content:'Crushed HIIT 💪', actionTitle:'Morning workout', goal:'Lose 10 lbs', streak:8, goalColor:'#10B981',
    reactions:{'👏':5,'💪':3,'🔥':4}, time:'2h'
  }],
  followFeed: [{
    id:'p2', user:'Jordan', avatar:'🧑‍🏫', visibility:'follow',
    type:'status', content:'Hardest thing about today was saying no to sweets 😅', reactions:{'👏':2}, time:'1h'
  }],
  react: (id, emoji, which) => set((s)=>({
    [which==='circle'?'circleFeed':'followFeed']: (which==='circle'?s.circleFeed:s.followFeed).map(p => 
      p.id===id ? ({...p, reactions:{...p.reactions, [emoji]:(p.reactions[emoji]||0)+1}}) : p)
  })),
  addPost: (p) => set((s)=> {
    if (p.visibility==='circle') return { circleFeed:[p, ...s.circleFeed] };
    return { followFeed:[p, ...s.followFeed] };
  }),
});