import { useRef } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-react'
import useAppStore from '@/stores/main'
import { useToast } from '@/hooks/use-toast'
import { Story } from '@/stores/mockData'

export function StoriesBar({
  onSelectStory,
}: {
  onSelectStory: (story: Story) => void
}) {
  const { stories, users, currentUser, addStory, viewStory } = useAppStore()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tenantStories = stories
    .filter((s) => s.tenantId === currentUser.tenantId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addStory(URL.createObjectURL(file))
      toast({ title: 'Story publicado!' })
    }
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4 mb-4">
      <div className="flex w-max space-x-4 p-1">
        <div
          className="flex flex-col items-center space-y-1 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted flex items-center justify-center bg-muted/50 hover:bg-muted transition-colors relative overflow-hidden">
            <Avatar className="w-full h-full opacity-50">
              <AvatarImage src={currentUser.avatarUrl} />
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-background/20">
              <Plus className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <span className="text-xs font-medium">Seu story</span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleUpload}
        />

        {tenantStories.map((story) => {
          const author = users.find((u) => u.id === story.authorId)
          return (
            <div
              key={story.id}
              className="flex flex-col items-center space-y-1 cursor-pointer"
              onClick={() => {
                viewStory(story.id)
                onSelectStory(story)
              }}
            >
              <div
                className={`w-16 h-16 rounded-full p-[2px] ${story.viewed ? 'bg-muted' : 'bg-gradient-to-tr from-pink-500 to-orange-400'}`}
              >
                <Avatar className="w-full h-full border-2 border-background">
                  <AvatarImage src={author?.avatarUrl} />
                  <AvatarFallback>
                    {author?.fullName.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs font-medium truncate w-16 text-center">
                {author?.fullName.split(' ')[0]}
              </span>
            </div>
          )
        })}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  )
}
