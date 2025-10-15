import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, MessageCircle, Heart, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  avatar?: string;
  // Add other fields as needed
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '1';
    console.log('Layout - Fetching profile for userId:', userId);
    
    fetch(`http://localhost:3001/api/profile?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Layout - Profile response:', data);
        if (data.success) setUserProfile(data.user);
      })
      .catch(error => {
        console.error('Layout - Profile fetch error:', error);
      });
  }, []);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: Heart, label: 'Activity', path: '/activity' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SocialHub
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
              <AvatarFallback>
                {userProfile.full_name ? userProfile.full_name.charAt(0) : userProfile.username.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-card/50">
          <nav className="flex flex-col space-y-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  className={`justify-start ${isActive ? 'shadow-glow' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Profile Card */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="rounded-lg bg-gradient-to-br from-card to-muted p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.username} />
                  <AvatarFallback>
                    {userProfile.full_name ? userProfile.full_name.charAt(0) : userProfile.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userProfile.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">@{userProfile.username}</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          <div className="mx-auto max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}