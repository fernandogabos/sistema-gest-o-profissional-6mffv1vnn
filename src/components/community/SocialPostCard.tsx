import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MessageCircle, Share2, Send, SmilePlus } from 'lucide-react'
import { formatRelativeTime } from '@/lib/formatters'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { SocialPost } from '@/stores/mockData'

const reactionEmojis = { heart: '❤️', fire: '🔥', thumbs_up: '👍', party: '🎉' }

export function SocialPostCard({ post }: { post: SocialPost }) {
  const { users, currentUser, reactToSocialPost, addSocialComment } =
    useAppStore()
  const { toast } = useToast()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)

  const author = users.find((u) => u.id === post.authorId)
  const myReaction = post.reactions?.find((r) => r.userId === currentUser.id)

  const handleComment = () => {
    if (!commentText.trim()) return
    addSocialComment(post.id, commentText)
    setCommentText('')
    setShowComments(true)
  }

  const handleReact = (type: keyof typeof reactionEmojis) => {
    reactToSocialPost(post.id, type)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-6 pb-3 flex flex-row items-start gap-4 space-y-0">
        <Avatar className="w-10 h-10">
          <AvatarImage src={author?.avatarUrl} />
          <AvatarFallback>{author?.fullName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{author?.fullName}</span>
            {author?.role === 'professional_owner' && (
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                Treinador
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
        {post.content && (
          <p className="whitespace-pre-wrap text-sm sm:text-base">
            {post.content}
          </p>
        )}
        {post.imageUrl && (
          <div className="rounded-lg overflow-hidden border bg-muted flex justify-center">
            <img
              src={post.imageUrl}
              alt="Mídia"
              className="max-h-[500px] object-contain w-full"
              loading="lazy"
            />
          </div>
        )}
        {post.reactions && post.reactions.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
            <div className="flex -space-x-1">
              {Array.from(new Set(post.reactions.map((r) => r.type)))
                .slice(0, 3)
                .map((type) => (
                  <span
                    key={type}
                    className="w-5 h-5 text-[10px] bg-muted rounded-full flex items-center justify-center z-10 border border-background"
                  >
                    {reactionEmojis[type as keyof typeof reactionEmojis]}
                  </span>
                ))}
            </div>
            <span>
              {post.reactions.length}{' '}
              {post.reactions.length === 1 ? 'reação' : 'reações'}
            </span>
          </div>
        )}
      </CardContent>

      <Separator />

      <CardFooter className="p-2 sm:px-6 flex flex-col items-stretch gap-2 bg-muted/5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${myReaction ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {myReaction ? (
                    <span className="text-lg">
                      {reactionEmojis[myReaction.type]}
                    </span>
                  ) : (
                    <SmilePlus className="w-5 h-5" />
                  )}
                  <span>Reagir</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-2 flex gap-2 rounded-full"
                side="top"
              >
                {(
                  Object.entries(reactionEmojis) as [
                    keyof typeof reactionEmojis,
                    string,
                  ][]
                ).map(([type, emoji]) => (
                  <button
                    key={type}
                    onClick={() => handleReact(type)}
                    className="text-2xl hover:scale-125 transition-transform w-10 h-10 flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-5 h-5" />{' '}
              <span>{post.comments.length || ''}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin)
              toast({ title: 'Link copiado!' })
            }}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {(showComments || post.comments.length > 0) && (
          <div className="w-full space-y-3 pt-2 animate-fade-in">
            {post.comments.map((c) => {
              const ca = users.find((u) => u.id === c.authorId)
              return (
                <div key={c.id} className="flex gap-3 text-sm">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarImage src={ca?.avatarUrl} />
                    <AvatarFallback>
                      {ca?.fullName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/50 rounded-2xl px-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs">
                        {ca?.fullName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{c.content}</p>
                  </div>
                </div>
              )
            })}
            <div className="flex gap-2 items-center mt-2 pt-2">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={currentUser.avatarUrl} />
              </Avatar>
              <div className="flex-1 flex items-center relative">
                <Input
                  placeholder="Escreva um comentário..."
                  className="rounded-full pr-10 bg-muted/30 border-none h-9 text-sm"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 h-7 w-7 text-primary"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
