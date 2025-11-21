import fetch from "node-fetch"
import yts from "yt-search"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `╭─「 ✦ 𓆩🎵𓆪 ᴍᴜsɪᴄ ᴘʟᴀʏᴇʀ ✦ 」─╮\n│\n╰➺ ✧ *Uso:* ${usedPrefix}play2 <canción>\n╰➺ ✧ *Ejemplo:* ${usedPrefix}play2 mi camino funk\n\n> PAIN COMMUNITY`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    text: `╭─「 ✦ 𓆩🕒𓆪 ᴘʀᴏᴄᴇsᴀɴᴅᴏ ✦ 」─╮\n│\n╰➺ ✧ *Canción:* ${text}\n╰➺ ✧ *Estado:* Buscando...\n\n> PAIN COMMUNITY`,
    contextInfo: {
      ...rcanal.contextInfo
    }
  }, { quoted: m })

  try {
    
    const search = await yts(text)
    if (!search || !search.videos || search.videos.length === 0) {
      return conn.sendMessage(m.chat, {
        text: `╭─「 ✦ 𓆩❌𓆪 ɴᴏ ʀᴇsᴜʟᴛᴀᴅᴏs ✦ 」─╮\n│\n╰➺ ✧ *Búsqueda:* ${text}\n╰➺ ✧ *Estado:* No se encontró la canción\n\n> PAIN COMMUNITY`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    const video = search.videos[0]

    
    const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(video.url)}&quality=128`
    const res = await fetch(apiUrl).then(r => r.json())

    if (!res?.status || !res.result?.download?.url) {
      return conn.sendMessage(m.chat, {
        text: `╭─「 ✦ 𓆩❌𓆪 ɴᴏ ʀᴇsᴜʟᴛᴀᴅᴏs ✦ 」─╮\n│\n╰➺ ✧ *Búsqueda:* ${text}\n╰➺ ✧ *Estado:* No se pudo descargar el audio\n\n> PAIN COMMUNITY`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    const meta = res.result.metadata
    const down = res.result.download

    
    await conn.sendMessage(m.chat, {
      audio: { url: down.url },
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: {
        externalAdReply: {
          title: `✰ 𝐓𝐢𝐭𝐮𝐥𝐨: ${meta.title}`,
          body: `✰ 𝐀𝐮𝐭𝐨𝐫: ${meta.author.name} | Duración: ${meta.timestamp}`,
          thumbnailUrl: meta.thumbnail,
          mediaType: 4,
          renderLargerThumbnail: false,
          sourceUrl: meta.url
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error('Error en play2:', e)
    await conn.sendMessage(m.chat, {
      text: `╭─「 ✦ 𓆩❌𓆪 ᴇʀʀᴏʀ ✦ 」─╮\n│\n╰➺ ✧ *Error:* ${e.message}\n╰➺ ✧ *Sugerencia:* Inténtalo más tarde\n\n> PAIN COMMUNITY`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.command = ['play2', 'music2', 'song2', 'audio2']
handler.tags = ['musica', 'audio', 'entretenimiento']
handler.help = ['play2 <canción> - Reproducir música desde YouTube']

export default handler 