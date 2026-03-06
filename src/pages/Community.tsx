import { useState, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import useAppStore from '@/stores/main'
import { formatRelativeTime } from '@/lib/formatters'
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  X,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Community() {
  const {
    socialPosts,
    users,
    currentUser,
    addSocialPost,
    likeSocialPost,
    addSocialComment,
  } = useAppStore()
  const { toast } = useToast()

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [commentText, setCommentText] = useState<Record<string, string>>({})
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({})

  const tenantPosts = socialPosts.filter(
    (p) => p.tenantId === currentUser.tenantId,
  )

  const handlePost = () => {
    if (!newPostContent.trim() && !newPostImage) return
    addSocialPost(newPostContent, newPostImage || undefined)
    setNewPostContent('')
    setNewPostImage(null)
    toast({
      title: 'Publicado!',
      description: 'Sua postagem foi enviada para a comunidade.',
    })
  }

  const handleComment = (postId: string) => {
    const text = commentText[postId]
    if (!text?.trim()) return
    addSocialComment(postId, text)
    setCommentText((prev) => ({ ...prev, [postId]: '' }))
    setExpandedComments((prev) => ({ ...prev, [postId]: true }))
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Comunidade</h1>
        <p className="text-muted-foreground mt-1">
          Conecte-se e interaja com os membros da consultoria.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>
                {currentUser.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Compartilhe uma foto de treino, uma conquista ou uma novidade..."
                className="resize-none min-h-[80px] border-none focus-visible:ring-0 p-0 text-base bg-transparent"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              {newPostImage && (
                <div className="relative inline-block rounded-lg overflow-hidden border">
                  <img
                    src={newPostImage}
                    alt="Preview"
                    className="max-h-64 object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setNewPostImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between pt-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setNewPostImage(URL.createObjectURL(file))
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary"
            >
              <ImageIcon className="w-4 h-4 mr-2" /> Foto / Vídeo
            </Button>
            <Button
              onClick={handlePost}
              disabled={!newPostContent.trim() && !newPostImage}
            >
              Publicar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {tenantPosts.map((post) => {
          const author = users.find((u) => u.id === post.authorId)
          const isLiked = post.likes.includes(currentUser.id)

          return (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="p-4 sm:p-6 pb-3 flex flex-row items-start gap-4 space-y-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={author?.avatarUrl} />
                  <AvatarFallback>
                    {author?.fullName.substring(0, 2)}
                  </AvatarFallback>
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
                    />
                  </div>
                )}
              </CardContent>

              <Separator />

              <CardFooter className="p-2 sm:px-6 flex flex-col items-stretch gap-2 bg-muted/5">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${isLiked ? 'text-rose-500 hover:text-rose-600' : 'text-muted-foreground'}`}
                      onClick={() => likeSocialPost(post.id)}
                    >
                      <Heart
                        className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                      />{' '}
                      <span>{post.likes.length || ''}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground"
                      onClick={() =>
                        setExpandedComments((prev) => ({
                          ...prev,
                          [post.id]: !prev[post.id],
                        }))
                      }
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
                      toast({
                        title: 'Link copiado!',
                        description:
                          'O link foi copiado para a área de transferência.',
                      })
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {(expandedComments[post.id] || post.comments.length > 0) && (
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
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Escreva um comentário..."
                          className="rounded-full pr-10 bg-muted/30 border-none h-9 text-sm"
                          value={commentText[post.id] || ''}
                          onChange={(e) =>
                            setCommentText((p) => ({
                              ...p,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) =>
                            e.key === 'Enter' && handleComment(post.id)
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-primary"
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText[post.id]?.trim()}
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
        })}

        {tenantPosts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
            Nenhuma publicação ainda. Seja o primeiro a compartilhar algo com a
            comunidade!
          </div>
        )}
      </div>
    </div>
  )
}
