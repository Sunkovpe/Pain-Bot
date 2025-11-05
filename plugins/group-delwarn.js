let handler = async (m, { conn, args, participants, isAdmin, isBotAdmin, isOwner, isPrems, usedPrefix, command }) => {
  if (!m.isGroup) return conn.sendMessage(m.chat, {
    text: '《✧》Este comando solo puede ser usado en grupos.',
    contextInfo: {
      ...rcanal.contextInfo
    }
  }, { quoted: m })
  


  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    return conn.sendMessage(m.chat, {
      text: `《✧》Debes mencionar al usuario al que deseas eliminar las advertencias.\n\n> Ejemplo: ${usedPrefix + command} @usuario`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
  
  const who = m.mentionedJid[0]
  
  if (!global.db.data.warnings) global.db.data.warnings = {}
  if (!global.db.data.warnings[m.chat]) global.db.data.warnings[m.chat] = {}
  
  if (!global.db.data.warnings[m.chat][who] || global.db.data.warnings[m.chat][who].count === 0) {
    return conn.sendMessage(m.chat, {
      text: `《✧》@${who.split('@')[0]} no tiene advertencias registradas.`,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [who]
      }
    }, { quoted: m })
  }

  
  const previousWarnings = global.db.data.warnings[m.chat][who].count
  delete global.db.data.warnings[m.chat][who]
  
  const userName = await conn.getName(who)
  const adminName = await conn.getName(m.sender)
  const groupMetadata = await conn.groupMetadata(m.chat)
  const groupName = groupMetadata.subject

  return conn.sendMessage(m.chat, {
    text: `╭─「 ✅ 𝗔𝗱𝘃𝗲𝗿𝘁𝗲𝗻𝗰𝗶𝗮𝘀 𝗘𝗹𝗶𝗺𝗶𝗻𝗮𝗱𝗮𝘀 ✅ 」─╮\n│\n╰➺ ✧ *Usuario:* @${who.split('@')[0]}\n╰➺ ✧ *Admin:* @${m.sender.split('@')[0]}\n╰➺ ✧ *Advertencias eliminadas:* ${previousWarnings}\n│\n╰➺ ✧ *Grupo:* ${groupName}\n╰➺ ✧ *Estado:* Expediente limpio ✅\n\n> PAIN COMMUNITY`,
    contextInfo: {
      ...rcanal.contextInfo,
      mentionedJid: [who, m.sender]
    }
  }, { quoted: m })
}

handler.command = ['delwarn', 'delwarns', 'eliminaradvertencia', 'limpiaradvertencias']
handler.group = true
handler.admin = true

export default handler
