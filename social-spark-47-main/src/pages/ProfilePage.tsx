import { useEffect, useState } from "react";
import { Edit, Settings, Camera, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/PostCard';
import { formatDistanceToNow } from 'date-fns';

/* 
// User type definition (for reference only, not used in JS files)
*/
interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  bio?: string;
  city?: string;
  avatar?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  joinedDate?: string;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: UserProfile;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  userId: string;
  author: UserProfile;
  content: string;
  createdAt: string;
  comments?: Comment[];
  likesCount: number;
  commentsCount?: number;
  isLiked?: boolean;
}

// helper to map API user -> frontend UserProfile
const mapApiUser = (u: any): UserProfile => ({
  id: String(u.id),
  fullName: u.full_name ?? u.fullName ?? '',
  username: u.username ?? '',
  bio: u.bio ?? '',
  city: u.city ?? '',
  avatar: u.avatar ?? '',
  postsCount: u.posts_count ?? 0,
  followersCount: u.followers_count ?? 0,
  followingCount: u.following_count ?? 0,
  joinedDate: u.joined_date ?? ''
});

// helper to map API post -> frontend Post
const mapApiPost = (p: any): Post => ({
  id: String(p.id),
  userId: String(p.user_id ?? p.userId ?? (p.author && p.author.id) ?? ''),
  author: p.author ? mapApiUser(p.author) : mapApiUser(p.user ?? {}),
  content: p.content ?? '',
  createdAt: p.created_at ?? p.createdAt ?? new Date().toISOString(),
  likesCount: typeof p.likes_count === 'number' ? p.likes_count : (typeof p.likesCount === 'number' ? p.likesCount : 0),
  commentsCount: p.comments_count ?? p.commentsCount ?? (p.comments ? p.comments.length : 0),
  comments: Array.isArray(p.comments) ? p.comments.map((c: any) => ({
    id: String(c.id),
    postId: String(c.post_id ?? c.postId),
    userId: String(c.user_id ?? c.userId),
    author: mapApiUser(c.author ?? c.user ?? {}),
    content: c.content ?? '',
    createdAt: c.created_at ?? c.createdAt ?? new Date().toISOString()
  })) : []
});

export default function ProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<UserProfile>({
    id: "",
    fullName: "",
    username: "",
    bio: "",
    city: "",
    avatar: ""
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    // fetch profile, then fetch posts for that user
    const fetchProfileAndPosts = async () => {
      try {
        const userId = localStorage.getItem('userId') || '1';
        console.log('ProfilePage - Fetching profile for userId:', userId);
        
        const profileRes = await fetch(`http://localhost:3001/api/profile?userId=${userId}`);
        const profileJson = await profileRes.json();
        console.log('ProfilePage - Profile response:', profileJson);
        
        if (profileRes.ok && profileJson.user) {
          const user = mapApiUser(profileJson.user);
          setUserProfile(user);
          setEditData({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            bio: user.bio ?? '',
            city: user.city ?? '',
            avatar: user.avatar ?? ''
          });

          // fetch posts for this user
          const postsRes = await fetch(`http://localhost:3001/api/posts?userId=${user.id}`);
          const postsJson = await postsRes.json();
          console.log('ProfilePage - Posts response:', postsJson);
          
          if (postsRes.ok && Array.isArray(postsJson.posts)) {
            const mapped = postsJson.posts.map(mapApiPost);
            setUserPosts(mapped);
          } else {
            // fallback: try to use empty posts or mock if needed
            setUserPosts([]);
          }
        } else {
          console.error('ProfilePage - Failed to fetch profile:', profileJson);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Failed to fetch profile or posts', err);
      }
    };

    fetchProfileAndPosts();
  }, []);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId') || '1';
      console.log('ProfilePage - Updating profile for userId:', userId);
      
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          fullName: editData.fullName,
          username: editData.username,
          bio: editData.bio,
          city: editData.city
        })
      });
      const data = await res.json();
      console.log('ProfilePage - Update response:', data);
      
      if (res.ok && data.user) {
        const updated = mapApiUser(data.user);
        setUserProfile(updated);
        setEditData({
          id: updated.id,
          fullName: updated.fullName,
          username: updated.username,
          bio: updated.bio ?? '',
          city: updated.city ?? '',
          avatar: updated.avatar ?? ''
        });
        setEditOpen(false);
      } else {
        console.error('Update failed', data);
      }
    } catch (err) {
      console.error('Edit profile error', err);
    }
  };

  const handleDeletePost = (postId: string) => {
    setUserPosts(prev => prev.filter(p => p.id !== postId));
    // optionally call backend to delete:
    // fetch(`/api/posts/${postId}`, { method: 'DELETE' });
  };

  const handleLike = (postId: string) => {
    setUserPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1) } : p));
  };

  const handleComment = (postId: string, content: string) => {
    // local UI update only; implement backend call as needed
    console.log('comment', postId, content);
  };

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden shadow-card">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 relative">
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute top-4 right-4 shadow-lg"
          >
            <Camera className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>
        
        <CardContent className="relative p-6">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-6">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-card shadow-glow">
                <AvatarImage src={userProfile?.avatar} alt={userProfile?.username} />
                <AvatarFallback className="text-2xl">{userProfile?.fullName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full p-0 shadow-lg"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="flex justify-end space-x-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="mt-8 space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold">{userProfile?.fullName}</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Online
                </Badge>
              </div>
              <p className="text-muted-foreground">@{userProfile?.username}</p>
            </div>
            
            {userProfile.bio && (
              <p className="text-foreground leading-relaxed">{userProfile.bio}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{userProfile.city || "San Francisco, CA"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {userProfile.joinedDate ? new Date(userProfile.joinedDate).toLocaleDateString() : "Unknown"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon className="h-4 w-4" />
                <a href="#" className="hover:text-primary transition-colors">portfolio.com</a>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex space-x-6 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">{userProfile?.postsCount ?? userPosts.length}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{userProfile?.followersCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{userProfile?.followingCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      {editOpen && (
        <Card className="p-6 shadow-md">
          <form onSubmit={handleEditProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={editData.fullName}
                onChange={e => setEditData({ ...editData, fullName: e.target.value })}
                placeholder="Full Name"
                className="mt-1 block w-full rounded-md border border-muted bg-muted px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Username
              </label>
              <input
                type="text"
                value={editData.username}
                onChange={e => setEditData({ ...editData, username: e.target.value })}
                placeholder="Username"
                className="mt-1 block w-full rounded-md border border-muted bg-muted px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Bio
              </label>
              <textarea
                value={editData.bio}
                onChange={e => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Bio"
                className="mt-1 block w-full rounded-md border border-muted bg-muted px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                City
              </label>
              <input
                type="text"
                value={editData.city}
                onChange={e => setEditData({ ...editData, city: e.target.value })}
                placeholder="City"
                className="mt-1 block w-full rounded-md border border-muted bg-muted px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="submit" variant="default">
                Save Changes
              </Button>
              <Button type="button" onClick={() => setEditOpen(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Profile Tabs */}
      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Liked</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{ ...post, commentsCount: post.commentsCount ?? 0 }}
                comments={post.comments ?? []}
                onLike={() => handleLike(post.id)}
                onComment={(id, content) => handleComment(id, content)}
                onDelete={(id) => handleDeletePost(id)}
                showDeleteButton={post.userId === userProfile.id}
              />
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Edit className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No posts yet</h3>
                  <p className="text-muted-foreground">Share your first post to get started!</p>
                </div>
                <Button className="mt-4">Create Post</Button>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="media" className="space-y-6">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Camera className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No media yet</h3>
                <p className="text-muted-foreground">Photos and videos you share will appear here.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="likes" className="space-y-6">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <span className="text-2xl">❤️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No liked posts yet</h3>
                <p className="text-muted-foreground">Posts you like will appear here.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="replies" className="space-y-6">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No replies yet</h3>
                <p className="text-muted-foreground">Your replies to other posts will appear here.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}