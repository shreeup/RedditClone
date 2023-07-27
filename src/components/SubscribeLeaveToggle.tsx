'use client'
import { Button } from '@/components/ui/Button'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { toast } from 'react-hot-toast'
// import { useToast } from '../hooks/use-toast'
// import { useCustomToasts } from '@/hooks/use-custom-toasts'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  subredditId: string
  subredditName: string
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: SubscribeLeaveToggleProps) => {
//   const { toast } = useToast()
//   const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
            toast.error("Unauthorised");
            return 
        }
      }
      toast.error("There was a problem.Something went wrong. Please try again.");
      return;
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast.success("Subscribed!. " +`You are now subscribed to r/${subredditName}`);
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }

      const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
      return data as string
    },
    onError: (err: AxiosError) => {
      toast.error(`Error: ${err.response?.data as string}`);
    },
    onSuccess: () => {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      
      toast.success("Unsubscribed!. " +`You are now unsubscribed from r/${subredditName}`);
    },
  })

  return isSubscribed ? (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isUnsubLoading}
      onClick={() => unsubscribe()}>
      Leave community
    </Button>
  ) : (
    <Button
      className='w-full mt-1 mb-4'
      isLoading={isSubLoading}
      onClick={() => subscribe()}>
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle