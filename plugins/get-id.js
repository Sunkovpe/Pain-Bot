let handler = async (m, { conn, usedPrefix }) => {

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[who]
  
  let txt = `╭─「 ✦ 𓆩🆔𓆪 ɪᴅ ᴅᴇʟ ᴜsᴜᴀʀɪᴏ ✦ 」─╮\n`
  txt += `│\n`
  txt += `╰➺ ✧ *ID:* ${who}\n`
  txt += `╰➺ ✧ *Nombre:* ${user?.name || 'Sin registrar'}\n`
  txt += `│\n`
  txt += `\n> PAIN COMMUNITY`
  
  await conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: {
      ...rcanal.contextInfo
    }
  }, { quoted: m })
}

handler.help = ['#id • #getid\n→ Obtener ID del usuario actual o mencionado']
handler.tags = ['info']
handler.command = ['id', 'getid', 'detid']

export default handler 