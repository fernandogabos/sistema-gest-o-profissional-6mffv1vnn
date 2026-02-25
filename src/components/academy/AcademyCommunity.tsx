import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import useAppStore from '@/stores/main'
import { formatDate } from '@/lib/formatters'
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  CornerDownRight,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function AcademyCommunity() {
  const {
    communityPosts,
    users,
    currentUser,
    academyContents,
    addCommunityPost,
    replyToPost,
    markBestAnswer,
    likePost,
  } = useAppStore()
  const { toast } = useToast()

  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const isMaster = currentUser.role === 'master_admin'

  const handlePost = () => {
    if (!newPostTitle || !newPostContent)
      return toast({
        title: 'Erro',
        description: 'Preencha título e conteúdo',
        variant: 'destructive',
      })
    addCommunityPost({ title: newPostTitle, content: newPostContent })
    setNewPostTitle('')
    setNewPostContent('')
    toast({
      title: 'Publicado',
      description: 'Sua dúvida foi enviada para a comunidade.',
    })
  }

  const handleReply = (postId: string) => {
    const content = replyContent[postId]
    if (!content) return
    replyToPost(postId, content)
    setReplyContent((prev) => ({ ...prev, [postId]: '' }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-muted/10 border-primary/20">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Iniciar nova
              discussão
            </h3>
            <Input
              placeholder="Título da sua dúvida ou tópico..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <Textarea
              placeholder="Descreva com detalhes..."
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-end">
              <Button onClick={handlePost}>Publicar no Fórum</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {communityPosts.map((post) => {
            const author = users.find((u) => u.id === post.authorId)
            const course = post.courseId
              ? academyContents.find((c) => c.id === post.courseId)
              : null
            const isExpanded = expandedPost === post.id

            return (
              <Card
                key={post.id}
                className={
                  post.isResolved ? 'border-l-4 border-l-emerald-500' : ''
                }
              >
                <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {post.title}
                      {post.isResolved && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-600 border-emerald-200"
                        >
                          Resolvido
                        </Badge>
                      )}
                    </CardTitle>
                    {course && (
                      <p className="text-xs text-muted-foreground">
                        Referente ao curso:{' '}
                        <span className="font-medium">{course.title}</span>
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch border-t pt-3 pb-3 bg-muted/5 gap-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={author?.avatarUrl} />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {author?.fullName} • {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => likePost(post.id)}
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" /> {post.likes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() =>
                          setExpandedPost(isExpanded ? null : post.id)
                        }
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />{' '}
                        {post.replies.length} Respostas
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="w-full pt-3 space-y-4 animate-fade-in-down">
                      <Separator />
                      {post.replies.map((reply) => {
                        const replier = users.find(
                          (u) => u.id === reply.authorId,
                        )
                        const isInstr =
                          replier?.role === 'instructor' ||
                          replier?.role === 'master_admin'
                        return (
                          <div
                            key={reply.id}
                            className={`flex gap-3 text-sm ${reply.isBestAnswer ? 'bg-emerald-50/50 p-2 rounded-md -mx-2' : ''}`}
                          >
                            <CornerDownRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                            <Avatar className="w-8 h-8 shrink-0">
                              <AvatarImage src={replier?.avatarUrl} />
                              <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {replier?.fullName}
                                  </span>
                                  {isInstr && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] h-4 px-1"
                                    >
                                      Instrutor
                                    </Badge>
                                  )}
                                  {reply.isBestAnswer && (
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none text-[10px] h-4 px-1">
                                      <CheckCircle2 className="w-3 h-3 mr-0.5" />{' '}
                                      Melhor Resposta
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                {reply.content}
                              </p>

                              {!post.isResolved &&
                                (post.authorId === currentUser.id ||
                                  isMaster) &&
                                !reply.isBestAnswer && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] px-2 text-emerald-600 hover:text-emerald-700 mt-1"
                                    onClick={() =>
                                      markBestAnswer(post.id, reply.id)
                                    }
                                  >
                                    Marcar como Solução
                                  </Button>
                                )}
                            </div>
                          </div>
                        )
                      })}

                      <div className="flex gap-2 items-start mt-2">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarImage src={currentUser.avatarUrl} />
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Escreva sua resposta..."
                            className="h-8 text-sm"
                            value={replyContent[post.id] || ''}
                            onChange={(e) =>
                              setReplyContent((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleReply(post.id)
                            }
                          />
                          <Button
                            size="sm"
                            className="h-8"
                            onClick={() => handleReply(post.id)}
                          >
                            Enviar
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Regras da Comunidade</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>1. Seja respeitoso e construtivo com colegas e instrutores.</p>
            <p>
              2. Busque por tópicos semelhantes antes de criar uma nova dúvida.
            </p>
            <p>
              3. Marque a resposta que resolveu seu problema como "Melhor
              Resposta".
            </p>
            <p>4. Evite autopromoção não autorizada.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
