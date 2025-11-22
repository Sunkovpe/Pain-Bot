/**
 * COMANDO TIKTOK STALK - PAIN BOT
 * Obtiene información completa de un perfil de TikTok
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return conn.sendMessage(m.chat, {
        text: `《✧》Uso correcto: ${usedPrefix}${command} [@usuario] o [https://www.tiktok.com/@usuario]\n\nEjemplo: ${usedPrefix}${command} @ricardo\n${usedPrefix}${command} https://www.tiktok.com/@ricardo`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    let username = args[0].trim()

    // Extraer username de la URL si es proporcionada
    if (username.startsWith('https://') || username.startsWith('www.')) {
      const match = username.match(/tiktok\.com\/@([^/?]+)/)
      if (match) {
        username = match[1]
      } else {
        return conn.sendMessage(m.chat, {
          text: '《✧》URL de TikTok inválida. Usa el formato: https://www.tiktok.com/@usuario',
          contextInfo: {
            ...rcanal.contextInfo
          }
        }, { quoted: m })
      }
    } else if (username.startsWith('@')) {
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


    const url = `https://www.tiktok.com/@${username}`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error('Perfil no encontrado o privado')
    }

    const html = await response.text()

    // Buscar el JSON embebido
    const jsonMatch = html.match(/__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*({.+?});/)
    if (!jsonMatch) {
      throw new Error('No se pudo extraer la información del perfil')
    }

    const data = JSON.parse(jsonMatch[1])
    const userData = data.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user

    if (!userData) {
      throw new Error('Perfil no encontrado o privado')
    }

    // Extraer información
    const {
      avatarLarger: profilePic,
      nickname: displayName,
      uniqueId: username_,
      followerCount: followers,
      followingCount: following,
      heartCount: likes,
      videoCount: videos,
      signature: bio
    } = userData

    // Formatear números
    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    }

    const infoText = `
╭───「 ✦ 𝗧𝗜𝗞𝗧𝗢𝗞 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 ✦ 」
│
│  *Nombre:* ${displayName || 'N/A'}
│  *Usuario:* @${username_ || username}
│  *Seguidores:* ${followers ? formatNumber(followers) : 'N/A'}
│  *Siguiendo:* ${following ? formatNumber(following) : 'N/A'}
│  *Likes:* ${likes ? formatNumber(likes) : 'N/A'}
│  *Videos:* ${videos ? formatNumber(videos) : 'N/A'}
│
│  *Biografía:*
│  ${bio || 'Sin biografía'}
│
╰───「 ✦ ${global.packname} ✦ 」
`

    // Enviar imagen del perfil con la información
    if (profilePic) {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: profilePic },
          caption: infoText,
          contextInfo: {
            ...rcanal.contextInfo,
            mentionedJid: [m.sender]
          }
        }, { quoted: m })
      } catch (error) {
        console.log('Error al enviar imagen:', error.message)
        // Si falla la imagen, enviar solo texto
        await conn.sendMessage(m.chat, {
          text: infoText,
          contextInfo: {
            ...rcanal.contextInfo,
            mentionedJid: [m.sender]
          }
        }, { quoted: m })
      }
    } else {
      // Sin imagen, enviar solo texto
      await conn.sendMessage(m.chat, {
        text: infoText,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
    }

  } catch (error) {
    console.error('Error en tiktokstalk:', error)
    conn.sendMessage(m.chat, {
      text: `《✧》Error: ${error.message || 'No se pudo obtener la información del perfil'}`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['tiktokstalk <@usuario> o <URL>', 'tiktok <@usuario> o <URL> → Obtiene información completa de un perfil de TikTok']
handler.tags = ['herramientas', 'osint']
handler.command = ['tik']

export default handler
