import { useState, useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, ArrowLeft, Send } from 'lucide-react'
import useAppStore from '@/stores/main'
import { formatRelativeTime } from '@/lib/formatters'
import { Badge } from '@/components/ui/badge'

export function DirectMessagesSheet() {
  const {
    directMessages,
    users,
    currentUser,
    sendDirectMessage,
    markMessagesAsRead,
  } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const chatUsers = useMemo(() => {
    const userIds = new Set<string>()
    directMessages.forEach((m) => {
      if (m.senderId === currentUser.id) userIds.add(m.receiverId)
      if (m.receiverId === currentUser.id) userIds.add(m.senderId)
    })
    users
      .filter(
        (u) => u.tenantId === currentUser.tenantId && u.id !== currentUser.id,
      )
      .forEach((u) => userIds.add(u.id))

    return Array.from(userIds)
      .map((id) => users.find((u) => u.id === id)!)
      .filter(Boolean)
  }, [directMessages, currentUser.id, users, currentUser.tenantId])

  const unreadCount = directMessages.filter(
    (m) => m.receiverId === currentUser.id && !m.read,
  ).length

  const handleOpenChat = (userId: string) => {
    setActiveChatUserId(userId)
    markMessagesAsRead(userId)
  }

  const handleSend = () => {
    if (!newMessage.trim() || !activeChatUserId) return
    sendDirectMessage(activeChatUserId, newMessage)
    setNewMessage('')
  }

  const activeMessages = useMemo(() => {
    if (!activeChatUserId) return []
    return directMessages
      .filter(
        (m) =>
          (m.senderId === currentUser.id &&
            m.receiverId === activeChatUserId) ||
          (m.senderId === activeChatUserId && m.receiverId === currentUser.id),
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
  }, [activeChatUserId, directMessages, currentUser.id])

  const activeUser = users.find((u) => u.id === activeChatUserId)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) setActiveChatUserId(null)
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-rose-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {activeChatUserId ? (
          <>
            <SheetHeader className="p-4 border-b flex flex-row items-center space-y-0 gap-3 text-left">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveChatUserId(null)}
                className="h-8 w-8 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={activeUser?.avatarUrl} />
                <AvatarFallback>
                  {activeUser?.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <SheetTitle className="text-base">
                {activeUser?.fullName}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {formatRelativeTime(msg.createdAt)}
                      </span>
                    </div>
                  )
                })}
                {activeMessages.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground mt-10">
                    Envie uma mensagem para iniciar a conversa.
                  </p>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <SheetHeader className="p-6 border-b text-left">
              <SheetTitle>Mensagens Diretas</SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {chatUsers.map((user) => {
                  const userUnread = directMessages.filter(
                    (m) =>
                      m.senderId === user.id &&
                      m.receiverId === currentUser.id &&
                      !m.read,
                  ).length
                  const userMsgs = directMessages
                    .filter(
                      (m) =>
                        (m.senderId === user.id &&
                          m.receiverId === currentUser.id) ||
                        (m.senderId === currentUser.id &&
                          m.receiverId === user.id),
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime(),
                    )
                  const lastMsg = userMsgs[0]

                  return (
                    <div
                      key={user.id}
                      onClick={() => handleOpenChat(user.id)}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>
                          {user.fullName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium truncate">
                            {user.fullName}
                          </span>
                          {lastMsg && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                              {formatRelativeTime(lastMsg.createdAt)}
                            </span>
                          )}
                        </div>
                        {lastMsg ? (
                          <p
                            className={`text-sm truncate ${userUnread > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
                          >
                            {lastMsg.content}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            Nova conversa
                          </p>
                        )}
                      </div>
                      {userUnread > 0 && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-medium text-primary-foreground">
                          {userUnread}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
