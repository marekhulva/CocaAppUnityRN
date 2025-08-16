export { PostCardBase } from './PostCardBase';
export { CheckinCard } from './CheckinCard';
export { StatusCard } from './StatusCard';
export { PhotoCard } from './PhotoCard';
export { AudioCard } from './AudioCard';

import React from 'react';
import { Post } from '../../../../state/slices/socialSlice';
import { CheckinCard } from './CheckinCard';
import { StatusCard } from './StatusCard';
import { PhotoCard } from './PhotoCard';
import { AudioCard } from './AudioCard';

interface PostCardProps {
  post: Post;
  onReact: (emoji: string) => void;
}

// Main PostCard component that renders the appropriate variant
export const PostCard: React.FC<PostCardProps> = ({ post, onReact }) => {
  switch (post.type) {
    case 'checkin':
      return <CheckinCard post={post} onReact={onReact} />;
    case 'status':
      return <StatusCard post={post} onReact={onReact} />;
    case 'photo':
      return <PhotoCard post={post} onReact={onReact} />;
    case 'audio':
      return <AudioCard post={post} onReact={onReact} />;
    default:
      return <StatusCard post={post} onReact={onReact} />;
  }
};