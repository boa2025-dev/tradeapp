import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  subscribeToProfile,
  getUserProfile,
  getUserByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getStickers,
  UserProfile,
  OwnedMap,
} from '../lib/firestore'
import { sendFriendRequestEmail, sendTradeOpportunityEmail } from '../lib/email'
import { ALL_STICKERS } from '../data/stickers'

export interface FriendWithTrades {
  profile: UserProfile
  canGive: string[]
  canReceive: string[]
}

export function useFriends() {
  const { user, profile } = useAuth()
  const [friends, setFriends] = useState<UserProfile[]>([])
  const [requests, setRequests] = useState<UserProfile[]>([])
  const [sentRequests, setSentRequests] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }

    const unsub = subscribeToProfile(user.uid, async updated => {
      const [friendProfiles, requestProfiles, sentProfiles] = await Promise.all([
        Promise.all(updated.friends.map(uid => getUserProfile(uid))),
        Promise.all(updated.friendRequests.map(uid => getUserProfile(uid))),
        Promise.all((updated.sentRequests ?? []).map(uid => getUserProfile(uid))),
      ])
      setFriends(friendProfiles.filter(Boolean) as UserProfile[])
      setRequests(requestProfiles.filter(Boolean) as UserProfile[])
      setSentRequests(sentProfiles.filter(Boolean) as UserProfile[])
      setLoading(false)
    })
    return unsub
  }, [user])

  async function addByUsername(username: string): Promise<string> {
    if (!user || !profile) throw new Error('No autenticado')
    const trimmed = username.trim().toLowerCase()
    if (trimmed === profile.username) throw new Error('No podés agregarte a vos mismo.')
    const targetUid = await getUserByUsername(trimmed)
    if (!targetUid) throw new Error('Usuario no encontrado.')
    if (profile.friends.includes(targetUid)) throw new Error('Ya son amigos.')
    const targetProfile = await getUserProfile(targetUid)
    if (targetProfile?.friendRequests.includes(user.uid))
      throw new Error('Ya enviaste una solicitud.')

    await sendFriendRequest(user.uid, targetUid)

    // Email notification — fire and forget
    if (targetProfile) {
      sendFriendRequestEmail({
        toEmail:      targetProfile.email,
        toUsername:   targetProfile.username,
        fromUsername: profile.username,
      })
    }

    return `Solicitud enviada a @${trimmed}`
  }

  async function accept(requesterUid: string) {
    if (!user || !profile) return
    await acceptFriendRequest(user.uid, requesterUid)

    // After accepting, compute trades and notify both sides
    const [requesterProfile, myStickers, requesterStickers] = await Promise.all([
      getUserProfile(requesterUid),
      getStickers(user.uid),
      getStickers(requesterUid),
    ])
    if (!requesterProfile) return

    const allIds = ALL_STICKERS.map(s => s.id)
    // What the requester can give me (they have repeats, I don't have it)
    const iCanReceive = allIds.filter(id => (requesterStickers[id] ?? 0) > 1 && (myStickers[id] ?? 0) === 0)
    // What I can give them (I have repeats, they don't have it)
    const theyCanReceive = allIds.filter(id => (myStickers[id] ?? 0) > 1 && (requesterStickers[id] ?? 0) === 0)

    // Notify the requester: you can now trade with the person who accepted
    if (iCanReceive.length > 0) {
      sendTradeOpportunityEmail({
        toEmail:      requesterProfile.email,
        toUsername:   requesterProfile.username,
        fromUsername: profile.username,
        fromUid:      user.uid,
        toUid:        requesterUid,
        stickerList:  iCanReceive,
      })
    }
    // Notify me (acceptor): the new friend has stickers for me
    if (theyCanReceive.length > 0) {
      sendTradeOpportunityEmail({
        toEmail:      profile.email,
        toUsername:   profile.username,
        fromUsername: requesterProfile.username,
        fromUid:      requesterUid,
        toUid:        user.uid,
        stickerList:  theyCanReceive,
      })
    }
  }

  async function reject(requesterUid: string) {
    if (!user) return
    await rejectFriendRequest(user.uid, requesterUid)
  }

  async function cancel(toUid: string) {
    if (!user) return
    await cancelFriendRequest(user.uid, toUid)
  }

  async function remove(friendUid: string) {
    if (!user) return
    await removeFriend(user.uid, friendUid)
  }

  async function getTradesWithFriend(
    friendUid: string,
    myOwned: OwnedMap,
  ): Promise<{ canGive: string[]; canReceive: string[] }> {
    const friendOwned: OwnedMap = await getStickers(friendUid)
    const allIds = ALL_STICKERS.map(s => s.id)
    const canGive    = allIds.filter(id => (myOwned[id] ?? 0) > 1 && (friendOwned[id] ?? 0) === 0)
    const canReceive = allIds.filter(id => (friendOwned[id] ?? 0) > 1 && (myOwned[id] ?? 0) === 0)
    return { canGive, canReceive }
  }

  return { friends, requests, sentRequests, loading, addByUsername, accept, reject, cancel, remove, getTradesWithFriend }
}
