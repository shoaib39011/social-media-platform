import { useState } from 'react';
import { Send, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockUsers, currentUser } from '@/lib/mockData';
import { formatDistanceToNow } from 'date-fns';


export default function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState(mockUsers[0]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: mockUsers[0].id,
      content: 'Hey! How are you doing?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: '2',
      senderId: currentUser.id,
      content: 'Hi! I\'m doing great, thanks for asking! How about you?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      senderId: mockUsers[0].id,
      content: 'I\'m good too! Are you free this weekend? Want to grab coffee?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '4',
      senderId: currentUser.id,
      content: 'That sounds perfect! I know a great place downtown. What time works for you?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Contacts Sidebar */}
      <Card className="w-80 flex flex-col shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser.id === user.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{user.fullName}</p>
                      <span className="text-xs text-muted-foreground">2h</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.id === mockUsers[0].id 
                        ? 'That sounds perfect! I know a great...' 
                        : 'Hey, how are you doing today?'
                      }
                    </p>
                  </div>
                  
                  {user.id === mockUsers[0].id && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      2
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col shadow-card">
        {/* Chat Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.username} />
                  <AvatarFallback>{selectedUser.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-card"></div>
                )}
              </div>
              <div>
                <p className="font-medium">{selectedUser.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedUser.isOnline ? 'Active now' : 'Last seen 2h ago'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === currentUser.id;
                const sender = isOwnMessage ? currentUser : selectedUser;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={sender.avatar} alt={sender.username} />
                        <AvatarFallback>{sender.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}