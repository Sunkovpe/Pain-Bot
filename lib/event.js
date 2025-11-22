export async function handleGroupEvents(m, conn, _isAdmin, _isBotAdmin, _isOwner, _participants) {
  
  if (!m.isGroup) return

  // Extraer texto del mensaje
  let text = ''
  if (m.message?.conversation) text = m.message.conversation
  else if (m.message?.extendedTextMessage?.text) text = m.message.extendedTextMessage.text
  else if (m.message?.imageMessage?.caption) text = m.message.imageMessage.caption
  else if (m.message?.videoMessage?.caption) text = m.message.videoMessage.caption
  else return

  text = text.toLowerCase().trim()
  if (!text) return

  
  const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await conn.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
  const participants = (m.isGroup ? groupMetadata.participants : []) || []
  const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
  const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) == conn.user.jid) : {}) || {}
  const isRAdmin = user?.admin == 'superadmin' || false
  const isAdmin = isRAdmin || user?.admin == 'admin' || false
  const isBotAdmin = bot?.admin || false

  
  const createOwnerIds = (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, '')
    return [
      cleanNumber + '@s.whatsapp.net',
      cleanNumber + '@lid'
    ]
  }

  const allOwnerIds = [
    conn.decodeJid(conn.user.id),
    ...global.owner.flatMap(([number]) => createOwnerIds(number)),
    ...(global.ownerLid || []).flatMap(([number]) => createOwnerIds(number))
  ]

  const isROwner = allOwnerIds.includes(m.sender)
  const isOwner = isROwner || m.fromMe

  
  const isAllowed = isAdmin || isOwner
  if (!isBotAdmin || !isAllowed) return

  if (text === 'abrir') {
    try {
      await conn.groupSettingUpdate(m.chat, 'not_announcement')
      await conn.sendMessage(m.chat, {
        text: `《✧》Grupo abierto por ${m.name || 'un admin'}.`,
        contextInfo: {
          ...global.rcanal.contextInfo
        }
      }, { quoted: m })
    } catch (e) {
      console.error('Error abriendo grupo:', e)
    }
  } else if (text === 'cerrar') {
    try {
      await conn.groupSettingUpdate(m.chat, 'announcement')
      await conn.sendMessage(m.chat, {
        text: `《✧》Grupo cerrado por ${m.name || 'un admin'}.`,
        contextInfo: {
          ...global.rcanal.contextInfo
        }
      }, { quoted: m })
    } catch (e) {
      console.error('Error cerrando grupo:', e)
    }
  }
}
