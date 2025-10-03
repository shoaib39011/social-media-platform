export interface User {
  city: string;
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  author: User;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}
export const mockUsers: User[] = [
  {
    id: '1',
    city: 'San Francisco',
    email: 'alice@example.com',
    username: 'alice123',
    fullName: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    bio: 'Nature lover and adventure seeker.',
    isOnline: true,
    followersCount: 120,
    followingCount: 200,
    postsCount: 34
  },
  {
    id: '2',
    city: 'New York',
    email: 'bob@example.com',
    username: 'bob_the_artist',
    fullName: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
    bio: 'Painter and creative soul.',
    isOnline: false,
    followersCount: 98,
    followingCount: 180,
    postsCount: 27
  },
  {
    id: '3',
    city: 'Los Angeles',
    email: 'carol@example.com',
    username: 'carol_fit',
    fullName: 'Carol Lee',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    bio: 'Fitness enthusiast and motivator.',
    isOnline: true,
    followersCount: 150,
    followingCount: 210,
    postsCount: 41
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking. Nature never fails to inspire me. 🏔️ #hiking #nature #adventure',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 42,
    commentsCount: 8,
    isLiked: false,
    author: mockUsers[0]
  },
  {
    id: '2',
    userId: '2',
    content: 'Working on a new painting today. The creative process is so therapeutic and fulfilling. Art is my way of expressing emotions that words cannot capture. 🎨✨',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likesCount: 28,
    commentsCount: 5,
    isLiked: true,
    author: mockUsers[1]
  },
  {
    id: '3',
    userId: '3',
    content: 'Morning workout done! Remember, consistency is key to achieving your fitness goals. Every small step counts towards your bigger dreams. Keep pushing! 💪 #fitness #motivation',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likesCount: 67,
    commentsCount: 12,
    isLiked: false,
    author: mockUsers[2]
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    content: 'Wow, that view is incredible! Which mountain is this?',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    author: mockUsers[1]
  },
  {
    id: '2',
    postId: '1',
    userId: '3',
    content: 'I need to go hiking more often. This is so inspiring!',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    author: mockUsers[2]
  }
];

// Current user (for authentication simulation)
export const currentUser: User = {
  id: 'current',
  city: 'Your City',
  email: 'you@example.com',
  username: 'your_username',
  fullName: 'Your Name',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf3477bb?w=150&h=150&fit=crop&crop=face',
  bio: 'Welcome to my profile! 👋',
  isOnline: true,
  followersCount: 42,
  followingCount: 158,
  postsCount: 23
};