/**
 * COMANDO TIKTOK STALK - PAIN BOT
 * Obtiene información completa de un perfil de TikTok
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return conn.sendMessage(m.chat, {
        text: `《✧》Uso correcto: ${usedPrefix}${command} <usuario>\n\nEjemplo: ${usedPrefix}${command} Sunkovv`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    let username = args[0].trim()
        
    if (username.startsWith('@')) {
      username = username.slice(1)
    }

    if (username.length < 1) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Username inválido.',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }


    const apiUrl = `https://bytebazz-api.koyeb.app/api/stalker/tiktok2?username=${encodeURIComponent(username)}&apikey=8jkh5icbf05`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data.status || !data.resultado) {
      throw new Error('Perfil no encontrado o API no disponible')
    }

    const profile = data.resultado

    
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    }

    const infoText = `
╭───「 ✦ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ✦ 」
│
│  *Nombre:* ${profile.apodo || 'N/A'}
│  *Usuario:* @${profile.nombre_usuario || username}
│  *Seguidores:* ${profile.seguidores ? formatNumber(profile.seguidores) : 'N/A'}
│  *Siguiendo:* ${profile.siguiendo ? formatNumber(profile.siguiendo) : 'N/A'}
│  *Likes:* ${profile.me_gusta ? formatNumber(profile.me_gusta) : 'N/A'}
│  *Videos:* ${profile.videos ? formatNumber(profile.videos) : 'N/A'}
│  *Verificado:* ${profile.verificado ? '✅ Sí' : '❌ No'}
│  *Privada:* ${profile.cuenta_privada ? '✅ Sí' : '❌ No'}
│
│  *Biografía:*
│  ${profile.biografia || 'Sin biografía'}
│
╰───「 ✦ ${global.packname} ✦ 」
`


    if (profile.avatar) {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: profile.avatar },
          caption: infoText,
          contextInfo: {
            ...rcanal.contextInfo,
            mentionedJid: [m.sender]
          }
        }, { quoted: m })
      } catch (error) {
        console.log('Error al enviar imagen:', error.message)
        
        await conn.sendMessage(m.chat, {
          text: infoText,
          contextInfo: {
            ...rcanal.contextInfo,
            mentionedJid: [m.sender]
          }
        }, { quoted: m })
      }
    } else {
      
      await conn.sendMessage(m.chat, {
        text: infoText,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
    }

  } catch (error) {
    console.error('Error en tik:', error)
    conn.sendMessage(m.chat, {
      text: `《✧》Error: ${error.message || 'No se pudo obtener la información del perfil'}`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['tik <usuario> → Obtiene información completa de un perfil de TikTok']
handler.tags = ['herramientas', 'osint']
handler.command = ['tik']

export default handler
