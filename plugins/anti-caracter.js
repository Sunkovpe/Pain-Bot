let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  try {
    if (!m.isGroup) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Este comando solo funciona en grupos.',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
    
    
    const action = args[0]?.toLowerCase()
    const limit = parseInt(args[1])
    
    if (!global.db.data.antiCaracter) global.db.data.antiCaracter = {}
    if (!global.db.data.antiCaracter[m.chat]) {
      global.db.data.antiCaracter[m.chat] = {
        enabled: false,
        limit: 500
      }
    }
    
    if (action === 'on') {
      if (!limit || isNaN(limit) || limit < 1 || limit > 10000) {
        return conn.sendMessage(m.chat, {
          text: `《✧》Debes especificar un límite válido entre 1 y 10000 caracteres.\n\n> Ejemplo: ${usedPrefix}anticaracter on 599\n> Ejemplo: ${usedPrefix}anticaracter on 1000`,
          contextInfo: {
            ...rcanal.contextInfo
          }
        }, { quoted: m })
      }
      
      global.db.data.antiCaracter[m.chat].enabled = true
      global.db.data.antiCaracter[m.chat].limit = limit
      
      let txt = `╭─「 ✦ 📝 ᴀɴᴛɪ-ᴄᴀʀᴀᴄᴛᴇʀ ᴀᴄᴛɪᴠᴀᴅᴏ ✦ 」─╮\n`
      txt += `│\n`
      txt += `╰➺ ✧ *Estado:* Activado\n`
      txt += `╰➺ ✧ *Límite:* ${limit} caracteres\n`
      txt += `╰➺ ✧ *Acción:* Eliminar mensaje + Expulsar del grupo\n`
      txt += `╰➺ ✧ *Excepción:* Administradores\n`
      txt += `│\n`
      txt += `╰➺ ✧ *Usuario:* @${m.sender.split('@')[0]}\n`
      txt += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
      
    } else if (action === 'off') {
      global.db.data.antiCaracter[m.chat].enabled = false
      
      let txt = `╭─「 ✦ 📝 ᴀɴᴛɪ-ᴄᴀʀᴀᴄᴛᴇʀ ᴅᴇsᴀᴄᴛɪᴠᴀᴅᴏ ✦ 」─╮\n`
      txt += `│\n`
      txt += `╰➺ ✧ *Estado:* Desactivado\n`
      txt += `╰➺ ✧ *Usuario:* @${m.sender.split('@')[0]}\n`
      txt += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
      
    } else if (action === 'status' || action === 'estado') {
      const status = global.db.data.antiCaracter[m.chat].enabled ? 'Activado' : 'Desactivado'
      const limit = global.db.data.antiCaracter[m.chat].limit
      
      let txt = `╭─「 ✦ 📝 ᴀɴᴛɪ-ᴄᴀʀᴀᴄᴛᴇʀ ᴇsᴛᴀᴅᴏ ✦ 」─╮\n`
      txt += `│\n`
      txt += `╰➺ ✧ *Estado:* ${status}\n`
      txt += `╰➺ ✧ *Límite:* ${limit} caracteres\n`
      txt += `╰➺ ✧ *Usuario:* @${m.sender.split('@')[0]}\n`
      txt += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
      
    } else {
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes especificar una acción.\n\n> Ejemplo: ${usedPrefix}anticaracter on 599\n> Ejemplo: ${usedPrefix}anticaracter off\n> Ejemplo: ${usedPrefix}anticaracter status`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
    
  } catch (e) {
    console.error('Error en anticaracter:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error al configurar el anti-caracteres.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.command = ['anticaracter', 'anticaracteres']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler 