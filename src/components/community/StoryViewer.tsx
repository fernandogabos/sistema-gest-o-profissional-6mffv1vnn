import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Story } from '@/stores/mockData'
import useAppStore from '@/stores/main'
import { formatRelativeTime } from '@/lib/formatters'

export function StoryViewer({
  story,
  onClose,
}: {
  story: Story | null
  onClose: () => void
}) {
  const { users } = useAppStore()
  if (!story) return null

  const author = users.find((u) => u.id === story.authorId)

  return (
    <Dialog open={!!story} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-black border-none text-white h-[80vh] flex flex-col justify-center">
        <DialogTitle className="sr-only">
          Visualizar Story de {author?.fullName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Foto ou vídeo temporário publicado pelo usuário na comunidade.
        </DialogDescription>

        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <img
            src={story.imageUrl}
            alt="Story"
            className="w-full h-full object-contain"
          />

          <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-3">
            <Avatar className="border border-white/20">
              <AvatarImage src={author?.avatarUrl} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {author?.fullName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm drop-shadow-md">
                {author?.fullName}
              </p>
              <p className="text-xs text-white/80 drop-shadow-md">
                {formatRelativeTime(story.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
