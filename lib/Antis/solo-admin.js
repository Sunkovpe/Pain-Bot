/**
 * Sistema Solo-Admin
 * Restringe el uso de comandos solo a administradores y owners
 */

export async function handleSoloAdmin(m, conn, isAdmin, isOwner, rcanal) {
  if (!m.isGroup || !global.db.data.soloAdmin || !global.db.data.soloAdmin[m.chat]) return


  const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  let _prefix = global.prefix
  let isCommand = (_prefix instanceof RegExp ?
    _prefix.test(m.text) :
    Array.isArray(_prefix) ?
      _prefix.some(p => new RegExp(str2Regex(p)).test(m.text)) :
      typeof _prefix === 'string' ?
        new RegExp(str2Regex(_prefix)).test(m.text) :
        false
  )

  if (isCommand && !isAdmin && !isOwner) {
    try {
      await conn.sendMessage(m.chat, {
        text: `╭─「 ✦ 🔐 ᴍᴏᴅᴏ sᴏʟᴏ-ᴀᴅᴍɪɴs ✦ 」─╮\n│\n╰➺ ✧ @${m.sender.split('@')[0]} el bot está en\n╰➺ ✧ modo *Solo Administradores*\n│\n╰➺ ✧ Solo admins del grupo y\n╰➺ ✧ owners del bot pueden usar comandos\n│\n╰➺ ✧ *Estado:* 🔐 Restringido\n\n> PAIN COMMUNITY`,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
    } catch (error) {
      console.error('Error en solo-admin:', error)
    }
    return true
  }

  return false
}
