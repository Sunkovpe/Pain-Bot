let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin, isOwner, isPrems }) => {
  // Verificación de admin
  const adminCheckMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}  
  const groupParticipants = (m.isGroup ? adminCheckMetadata.participants : []) || []  
  const user = (m.isGroup ? groupParticipants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}  
  const isRAdmin = user?.admin == 'superadmin' || false  
  const isAdminManual = isRAdmin || user?.admin == 'admin' || false  
  
  // Verificación adicional para owner del bot
  const isOwnerManual = global.owner.some(([number]) => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net' === m.sender) || 
                  global.ownerLid?.some(([number]) => number.replace(/[^0-9]/g, '') + '@lid' === m.sender) ||
                  m.sender === conn.user.jid
  
  if (!isAdminManual && !isRAdmin && !isOwnerManual) {
    return conn.reply(m.chat, 'ඞ Solo los administradores pueden usar este comando.', m)
  }

  if (!m.isGroup) return conn.sendMessage(m.chat, {
    text: '《✧》Este comando solo puede ser usado en grupos.',
    contextInfo: {
      ...rcanal.contextInfo
    }
  }, { quoted: m })



  const newName = args.join(' ').trim()

  if (!newName) {
    return conn.sendMessage(m.chat, {
      text: `《✧》Debes indicar el nuevo nombre del grupo.\n\n*Ejemplos:*\n- ${usedPrefix + command} KIYOMI FAMILIA\n- ${usedPrefix + command} Evento hoy 9PM`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  if (newName.length > 100) {
    return conn.sendMessage(m.chat, {
      text: `《✧》El nombre es demasiado largo.\n\n*Máximo permitido:* 100 caracteres\n*Tu nombre:* ${newName.length} caracteres` ,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  try {
    const metadata = await conn.groupMetadata(m.chat)
    const oldName = metadata?.subject || 'Sin nombre'

    await conn.groupUpdateSubject(m.chat, newName)

    return conn.sendMessage(m.chat, {
      text: `╭─「 ✦ 𝗡𝗼𝗺𝗯𝗿𝗲 𝗮𝗰𝘁𝘂𝗮𝗹𝗶𝘇𝗮𝗱𝗼 ✦ 」─╮\n│\n╰➺ ✧ *Antes:* ${oldName}\n╰➺ ✧ *Ahora:* ${newName}\n│\n╰➺ ✧ *Por:* @${m.sender.split('@')[0]}\n\n> PAIN COMMUNITY`,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })
  } catch (e) {
    console.error('Error cambiando nombre del grupo:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》No se pudo cambiar el nombre del grupo. Asegúrate de que el bot sea administrador.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.command = ['namegp']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
