import { useState, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import useAppStore from '@/stores/main'
import { Image as ImageIcon, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { StoriesBar } from '@/components/community/StoriesBar'
import { StoryViewer } from '@/components/community/StoryViewer'
import { DirectMessagesSheet } from '@/components/community/DirectMessagesSheet'
import { SocialPostCard } from '@/components/community/SocialPostCard'
import { Story } from '@/stores/mockData'

export default function Community() {
  const { socialPosts, currentUser, addSocialPost } = useAppStore()
  const { toast } = useToast()

  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImage, setNewPostImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeStory, setActiveStory] = useState<Story | null>(null)

  const tenantPosts = useMemo(
    () =>
      socialPosts
        .filter((p) => p.tenantId === currentUser.tenantId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [socialPosts, currentUser.tenantId],
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

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunidade</h1>
          <p className="text-muted-foreground mt-1">
            Conecte-se e interaja com os membros da consultoria.
          </p>
        </div>
        <DirectMessagesSheet />
      </div>

      <StoriesBar onSelectStory={setActiveStory} />
      <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />

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
        {tenantPosts.map((post) => (
          <SocialPostCard key={post.id} post={post} />
        ))}

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
