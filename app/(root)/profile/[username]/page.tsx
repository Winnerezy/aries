import { CustomButton } from '@/components/CustomButton'
import { prisma } from '@/lib/constants'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import { FriendButton } from '@/components/FriendButton'

export default async function Profile({ params: { username } }: { params: { username: string } }) {

  const userId = headers().get('userId') as string

  const user = await prisma.user.findUnique({
    where: {
      username: username
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      friends: true,
      friendRequests: true
    }
  })

  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      friends: true,
      friendRequests: true
    }
  })

  if(!user){
   redirect('/discover')
  }
  
  const userIdMatch = userId === user.id

  return (
    <section className='w-full p-2 flex justify-center items-start'>
      <main className='w-full max-w-[500px] flex flex-col gap-4 min-h-screen'>
        <div className='flex gap-8 items-center mt-8'>
          <Avatar className="border border-[--border-bg] flex items-center justify-center size-24">
            <AvatarImage src="" />
            <AvatarFallback className="font-semibold">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col justify-start'>
            <p className='text-md text-[--secondary-text] w-max'>{` ${ user?.firstname } ${ user?.lastname }` }</p>
            <p className='text-xs'>@{ user?.username }</p>
            <span className='text-sm'>
              { `${user.friends.length} Friends` }
            </span>
          </div>
          </div>

        <section className='flex gap-4 text-md items-center w-full'>


          <section>
            { 
              userIdMatch ?
              <>
                <CustomButton title='Edit Profile' redirect='edit-profile'/>
              </>
              :
              <>
               {
                user.friends.includes(userId) && currentUser?.friends.includes(user.id) ?
                <>
                  <CustomButton title='Message' redirect = {`/messages/${user.id}`}/>
                </>
                :
                <FriendButton sender={userId} receiver={user.id} friendRequests={user.friendRequests} friends={user.friends}/>
                }
              </>
            }
          </section>
        </section>
      </main>
    </section>
  )
}
