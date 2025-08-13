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
  circleFeed: [
    {
      id:'p1', user:'Alex', avatar:'🏃', visibility:'circle',
      type:'checkin', content:'Crushed HIIT 💪', actionTitle:'Morning workout', goal:'Lose 10 lbs', streak:8, goalColor:'#10B981',
      reactions:{'👏':5,'💪':3,'🔥':4}, time:'2h'
    },
    {
      id:'p3', user:'Jordan', avatar:'🧘', visibility:'circle',
      type:'checkin', content:'Finding peace in the chaos', actionTitle:'Evening meditation', goal:'Daily mindfulness', streak:21, goalColor:'#8B5CF6',
      reactions:{'🙏':8,'✨':5,'💜':3}, time:'4h'
    },
    {
      id:'p5', user:'Taylor', avatar:'📚', visibility:'circle',
      type:'status', content:'Just finished Chapter 7 of Atomic Habits. Mind = blown 🤯 The compound effect is real!',
      reactions:{'🧠':6,'💡':4,'👍':7}, time:'5h'
    },
    {
      id:'p7', user:'Cameron', avatar:'🎨', visibility:'circle',
      type:'photo', content:'Morning light hitting just right ☀️', photoUri:'https://picsum.photos/400/300',
      reactions:{'😍':12,'🌟':8,'📸':3}, time:'6h'
    },
    {
      id:'p9', user:'Riley', avatar:'💼', visibility:'circle',
      type:'checkin', content:'Deep work session complete!', actionTitle:'Focus block', goal:'Launch side project', streak:15, goalColor:'#FFD700',
      reactions:{'🚀':9,'💻':6,'🎯':4}, time:'8h'
    },
    {
      id:'p11', user:'Quinn', avatar:'🍳', visibility:'circle',
      type:'status', content:'Meal prepped for the entire week! Future me will thank present me 🙌',
      reactions:{'🥗':10,'💪':5,'👨‍🍳':3}, time:'12h'
    },
    {
      id:'p13', user:'Blake', avatar:'🏔️', visibility:'circle',
      type:'checkin', content:'5AM club checking in!', actionTitle:'Morning routine', goal:'Build discipline', streak:30, goalColor:'#FF6B6B',
      reactions:{'🌅':7,'⏰':4,'🔥':11}, time:'1d'
    }
  ],
  followFeed: [
    {
      id:'p2', user:'Jordan', avatar:'🧑‍🏫', visibility:'follow',
      type:'status', content:'Hardest thing about today was saying no to sweets 😅', reactions:{'👏':2}, time:'1h'
    },
    {
      id:'p4', user:'Morgan', avatar:'🎯', visibility:'follow',
      type:'status', content:'Sometimes the biggest win is just showing up. Even when you don\'t feel like it.',
      reactions:{'💯':15,'❤️':8,'🙌':6}, time:'3h'
    },
    {
      id:'p6', user:'Dakota', avatar:'🌱', visibility:'follow',
      type:'checkin', content:'Day 1 again, but that\'s okay', actionTitle:'No social media', goal:'Digital detox', streak:1, goalColor:'#06B6D4',
      reactions:{'💪':18,'🤗':12,'⭐':5}, time:'5h'
    },
    {
      id:'p8', user:'Avery', avatar:'🏋️', visibility:'follow',
      type:'photo', content:'New PR! 225lbs 🏋️‍♀️', photoUri:'https://picsum.photos/400/400',
      reactions:{'💪':25,'🔥':20,'🎉':15}, time:'7h'
    },
    {
      id:'p10', user:'Phoenix', avatar:'🎸', visibility:'follow',
      type:'audio', content:'Late night jam session 🎵', audioUri:'sample.mp3',
      reactions:{'🎶':8,'🤘':6,'🔥':4}, time:'10h'
    },
    {
      id:'p12', user:'River', avatar:'📖', visibility:'follow',
      type:'status', content:'The comfort zone is a beautiful place, but nothing ever grows there 🌿',
      reactions:{'🌱':22,'💭':10,'✨':14}, time:'14h'
    },
    {
      id:'p14', user:'Sage', avatar:'🧘‍♀️', visibility:'follow',
      type:'checkin', content:'Breathwork changed everything', actionTitle:'Morning breathwork', goal:'Reduce anxiety', streak:45, goalColor:'#A78BFA',
      reactions:{'🫁':5,'😌':9,'🙏':12}, time:'1d'
    },
    {
      id:'p15', user:'Drew', avatar:'☕', visibility:'follow',
      type:'status', content:'Coffee first, adulting second ☕ Who else is team caffeine?',
      reactions:{'☕':30,'😂':15,'🙋':20}, time:'1d'
    },
    {
      id:'p16', user:'Jamie', avatar:'🚴', visibility:'follow',
      type:'photo', content:'Morning ride through the city 🌆', photoUri:'https://picsum.photos/400/500',
      reactions:{'🚴':12,'🌄':8,'👌':6}, time:'2d'
    }
  ],
  react: (id, emoji, which) => set((s)=>({
    [which==='circle'?'circleFeed':'followFeed']: (which==='circle'?s.circleFeed:s.followFeed).map(p => 
      p.id===id ? ({...p, reactions:{...p.reactions, [emoji]:(p.reactions[emoji]||0)+1}}) : p)
  })),
  addPost: (p) => set((s)=> {
    if (p.visibility==='circle') return { circleFeed:[p, ...s.circleFeed] };
    return { followFeed:[p, ...s.followFeed] };
  }),
});