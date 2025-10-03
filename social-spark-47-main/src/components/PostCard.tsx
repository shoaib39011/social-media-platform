import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';

interface User {
  id: string;
  avatar?: string;
  username?: string;
  full_name?: string;
  isOnline?: boolean;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string | Date;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  author: User;
  image?: string;
}

interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string | Date;
}

interface PostCardProps {
  post: Post;
  comments?: Comment[];
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
  showDeleteButton?: boolean;
}

export function PostCard({
  post,
  comments = [],
  onLike,
  onComment,
  onDelete,
  showDeleteButton = false
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [menuOpen, setMenuOpen] = useState(false);

  // normalize author safely
  const author = post.author ?? { id: '', username: 'unknown', full_name: 'Unknown', avatar: '' };
  const authorFullName = (author as any).full_name ?? (author as any).fullName ?? author.username ?? 'Unknown';
  const authorUsername = author.username ?? (authorFullName ? String(authorFullName).replace(/\s+/g, '').toLowerCase() : 'unknown');
  const authorInitial = authorFullName ? String(authorFullName).charAt(0) : (authorUsername ? authorUsername.charAt(0) : 'U');

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : Math.max(0, prev - 1)));
    onLike?.(post.id);
  };
  
  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment?.(post.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
  };
  
  const handleDelete = () => {
    setMenuOpen(false);
    if (confirm('Delete this post?')) {
      onDelete?.(post.id);
    }
  };

  return (
    <Card className="mb-6 overflow-hidden shadow-card hover:shadow-glow transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author?.avatar} alt={authorUsername} />
                <AvatarFallback>{authorInitial}</AvatarFallback>
              </Avatar>
              {post.author.isOnline && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{authorFullName}</p>
              <p className="text-xs text-muted-foreground">
                @{authorUsername} • {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
            </div>
          </div>

          {/* menu wrapper with onBlur to close when focus leaves */}
          <div
            className="relative"
            tabIndex={0}
            onBlur={() => setMenuOpen(false)}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-expanded={menuOpen}
              aria-label="Post actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg z-50 dark:bg-card">
                <div className="flex flex-col py-1">
                  {/* other actions can be added here */}
                  {showDeleteButton ? (
                    <button
                      onClick={handleDelete}
                      className="text-left px-4 py-2 text-sm text-destructive hover:bg-muted/50"
                    >
                      Delete
                    </button>
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">No actions</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm leading-relaxed mb-3">{post.content}</p>
        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post content"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-primary'} transition-colors`}
            >
              <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(prev => !prev)}
              className="text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {post.commentsCount}
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share className="h-5 w-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 space-y-4 w-full">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
                  <AvatarFallback>
                    {comment.author.full_name ? comment.author.full_name.charAt(0) : (comment.author.username ? comment.author.username.charAt(0) : 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium">{comment.author.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </p>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            ))}

            <div className="flex space-x-3 pt-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Your avatar" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}


