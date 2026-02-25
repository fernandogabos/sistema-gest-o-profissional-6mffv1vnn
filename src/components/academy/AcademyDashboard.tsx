import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useAppStore from '@/stores/main'
import { Trophy, Star, Target, ShieldCheck } from 'lucide-react'

export function AcademyDashboard() {
  const { gamificationProfiles, currentUser, users } = useAppStore()

  const myProfile = gamificationProfiles.find(
    (p) => p.userId === currentUser.id,
  ) || { points: 0, level: 1, badges: [] }
  const pointsForNextLevel = myProfile.level * 500
  const progressPercent = Math.min(((myProfile.points % 500) / 500) * 100, 100)

  const leaderboard = [...gamificationProfiles]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={currentUser.avatarUrl} />
                <AvatarFallback>
                  {currentUser.fullName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                L{myProfile.level}
              </div>
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left w-full">
              <h2 className="text-2xl font-bold">{currentUser.fullName}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-foreground">
                  {myProfile.points} pontos
                </span>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-xs">
                  <span>Nível Atual: {myProfile.level}</span>
                  <span className="text-muted-foreground">
                    Faltam {pointsForNextLevel - (myProfile.points % 500)} pts
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Badges Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {myProfile.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Complete trilhas para ganhar badges.
              </p>
            ) : (
              myProfile.badges.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col items-center gap-1 group relative"
                >
                  <img
                    src={b.iconUrl}
                    alt={b.name}
                    className="w-12 h-12 drop-shadow-sm"
                  />
                  <span className="text-[10px] text-center max-w-[60px] leading-tight font-medium">
                    {b.name}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Ranking
            Global (Leaderboard)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {leaderboard.map((prof, idx) => {
              const u = users.find((user) => user.id === prof.userId)
              if (!u) return null
              const isMe = u.id === currentUser.id
              return (
                <div
                  key={prof.userId}
                  className={`flex items-center justify-between p-4 ${isMe ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-6 text-center font-bold ${idx < 3 ? 'text-amber-500 text-lg' : 'text-muted-foreground'}`}
                    >
                      {idx + 1}º
                    </span>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={u.avatarUrl} />
                      <AvatarFallback>
                        {u.fullName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p
                        className={`font-semibold ${isMe ? 'text-primary' : ''}`}
                      >
                        {u.fullName} {isMe && '(Você)'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Nível {prof.level} • {prof.badges.length} Badges
                      </p>
                    </div>
                  </div>
                  <div className="font-bold font-mono text-lg">
                    {prof.points} pts
                  </div>
                </div>
              )
            })}
            {leaderboard.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum dado de ranking.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
