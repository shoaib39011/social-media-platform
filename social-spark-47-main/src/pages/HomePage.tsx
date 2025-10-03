import { useEffect, useState } from 'react';
import { Plus, Image, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostCard } from '@/components/PostCard.tsx';
import { mockPosts, mockComments } from '@/lib/mockData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  avatar?: string;
  username?: string;
  fullName?: string;
  city?: string;
  email?: string;
  isOnline?: boolean;
};

type Post = {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  author: User;
};

export default function HomePage() {
  const [posts, setPosts] = useLocalStorage<Post[]>('posts', mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // fetch currently logged in user from backend
    fetch('http://localhost:3001/api/profile?userId=1')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.user) {
          setUserProfile({
            id: String(data.user.id),
            avatar: data.user.avatar ?? '',
            username: data.user.username ?? '',
            fullName: data.user.full_name ?? data.user.fullName ?? '',
            city: data.user.city ?? '',
            email: data.user.email ?? '',
            isOnline: true,
          });
        }
      })
      .catch(() => {});
  }, []);

  // normalize posts so each has an author object (use userProfile for matching userId)
  useEffect(() => {
    if (!userProfile) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.author) return p;
        if (String(p.userId) === String(userProfile.id)) {
          return { ...p, author: { id: userProfile.id, avatar: userProfile.avatar, username: userProfile.username, full_name: userProfile.fullName } };
        }
        return p;
      })
    );
  }, [userProfile]);

  const handleCreatePost = () => {
    if (!userProfile || !newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      userId: userProfile.id,
      content: newPostContent,
      createdAt: new Date(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
      author: { id: userProfile.id, avatar: userProfile.avatar, username: userProfile.username, fullName: userProfile.fullName }
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast({
      title: "Post created!",
      description: "Your post has been shared with your followers.",
    });
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1 }
        : post
    ));
  };

  const handleComment = (postId: string, content: string) => {
    toast({
      title: "Comment added!",
      description: "Your comment has been posted.",
    });
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post deleted!",
      description: "Your post has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userProfile?.avatar} alt={userProfile?.username} />
              <AvatarFallback>
                {userProfile?.fullName
                  ? userProfile.fullName.charAt(0)
                  : userProfile?.username
                    ? userProfile.username.charAt(0)
                    : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
              />

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Image className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Smile className="h-4 w-4 mr-2" />
                    Emoji
                  </Button>
                </div>

                <Button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            comments={mockComments.filter(c => c.postId === post.id)}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDeletePost}
            showDeleteButton={post.userId === userProfile?.id}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No posts yet</h3>
              <p className="text-muted-foreground">Be the first to share something amazing!</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
