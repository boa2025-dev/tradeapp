import emailjs from '@emailjs/browser'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const TMPL_FRIEND = import.meta.env.VITE_EMAILJS_TEMPLATE_FRIEND
const TMPL_TRADE  = import.meta.env.VITE_EMAILJS_TEMPLATE_TRADE

const CONFIGURED = Boolean(SERVICE_ID && PUBLIC_KEY && TMPL_FRIEND && TMPL_TRADE)

const APP_URL = 'https://tradeapp26.vercel.app'

// Key: fromUid_toUid — prevents spamming trade notifications
const TRADE_NOTIF_KEY = (a: string, b: string) => `tradeNotif_${a}_${b}`
const TRADE_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24h

function wasTradeSentRecently(fromUid: string, toUid: string): boolean {
  const key = TRADE_NOTIF_KEY(fromUid, toUid)
  const last = localStorage.getItem(key)
  if (!last) return false
  return Date.now() - parseInt(last) < TRADE_COOLDOWN_MS
}

function markTradeSent(fromUid: string, toUid: string) {
  localStorage.setItem(TRADE_NOTIF_KEY(fromUid, toUid), String(Date.now()))
}

export async function sendFriendRequestEmail(params: {
  toEmail: string
  toUsername: string
  fromUsername: string
}) {
  if (!CONFIGURED) return
  try {
    await emailjs.send(SERVICE_ID, TMPL_FRIEND, {
      to_email:      params.toEmail,
      to_username:   params.toUsername,
      from_username: params.fromUsername,
      app_url:       APP_URL,
    }, PUBLIC_KEY)
  } catch (e) {
    console.warn('Email not sent:', e)
  }
}

export async function sendTradeOpportunityEmail(params: {
  toEmail: string
  toUsername: string
  fromUsername: string
  fromUid: string
  toUid: string
  stickerList: string[]   // stickers the recipient can get
}) {
  if (!CONFIGURED) return
  if (wasTradeSentRecently(params.fromUid, params.toUid)) return
  if (params.stickerList.length === 0) return

  try {
    await emailjs.send(SERVICE_ID, TMPL_TRADE, {
      to_email:      params.toEmail,
      to_username:   params.toUsername,
      from_username: params.fromUsername,
      count:         params.stickerList.length,
      sticker_list:  params.stickerList.slice(0, 20).join(', ') + (params.stickerList.length > 20 ? '...' : ''),
      app_url:       APP_URL,
    }, PUBLIC_KEY)
    markTradeSent(params.fromUid, params.toUid)
  } catch (e) {
    console.warn('Email not sent:', e)
  }
}
