import yts from 'yt-search'
import axios from 'axios'


let DY_SCRAP
try {
  DY_SCRAP = (await import('@dark-yasiya/scrap')).default
} catch (error) {
  DY_SCRAP = null
}

function cleanTitle(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100);
}

function cleanYouTubeUrl(url) {
  let cleanUrl = url.trim()
  cleanUrl = cleanUrl.replace(/\s+/g, "")
  cleanUrl = cleanUrl.replace(/https:\/\/youtube\.com\/\/+/g, "https://youtube.com/")
  cleanUrl = cleanUrl.replace(/https:\/\/www\.youtube\.com\/\/+/g, "https://www.youtube.com/")
  if (cleanUrl.includes('youtube.com/watch?v=')) return cleanUrl
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return `https://www.youtube.com/watch?v=${cleanUrl}`
  return cleanUrl
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return conn.sendMessage(m.chat, {
        text: `《✧》Proporciona un enlace o texto para buscar el video.\n\n📝 *Ejemplos:*\n1️⃣ ${usedPrefix}play https://youtube.com/watch?v=kJQP7kiw5Fk\n2️⃣ ${usedPrefix}play Despacito`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    let query = args.join(" ").trim()
    let youtubeUrl = query
    let video = null

    if (!/^https?:\/\//i.test(youtubeUrl)) {
      const searchResults = await yts(query)
      if (!searchResults || !searchResults.videos || searchResults.videos.length === 0) {
        return conn.sendMessage(m.chat, {
          text: '《✧》No se encontró ningún video para tu búsqueda.',
          contextInfo: {
            ...rcanal.contextInfo
          }
        }, { quoted: m })
      }
      video = searchResults.videos[0]
      const durationInSeconds = video.duration.seconds || 0
      if (durationInSeconds > 1800) {
        return conn.sendMessage(m.chat, {
          text: '《✧》El video es demasiado largo. El límite es de 30 minutos.',
          contextInfo: {
            ...rcanal.contextInfo
          }
        }, { quoted: m })
      }
      youtubeUrl = video.url
      const views = video.views ? video.views.toLocaleString() : "-"
      await conn.sendMessage(m.chat, {
        text: `╭─「 ✦ 𓆩🎵𓆪 ʏᴏᴜᴛᴜʙᴇ ᴍᴘ3 ✦ 」─╮\n│\n╰➺ ✧ *Título:* ${video.title}\n╰➺ ✧ *Duración:* ${video.timestamp}\n╰➺ ✧ *Publicado:* ${video.ago}\n╰➺ ✧ *Canal:* ${video.author.name}\n╰➺ ✧ *Vistas:* ${views}\n╰➺ ✧ *ID:* ${video.videoId}\n╰➺ ✧ *Url:* ${video.url}\n│\n╰➺ ✧ *Generando tu audio, por favor espera un momento...*\n\n> PAIN COMMUNITY`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
      query = video.title
    }

    youtubeUrl = cleanYouTubeUrl(youtubeUrl)

    if (!DY_SCRAP) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Error: La librería de descarga no está disponible. Por favor, instala @dark-yasiya/scrap con: npm i @dark-yasiya/scrap',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    try {
      const dy_scrap = new DY_SCRAP()
      const data = await dy_scrap.ytmp3_v2(youtubeUrl)
      if (!data.status) {
        throw new Error(`La librería retornó status false: ${data.error || 'Error desconocido'}`)
      }
      if (!data.result || !data.result.data) {
        throw new Error('No se pudo obtener información del video')
      }
      if (!data.result.download || !data.result.download.url) {
        throw new Error('No se pudo obtener la URL de descarga')
      }
      const downloadUrl = data.result.download.url
      const videoInfo = data.result.data
      const response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
        maxContentLength: 100 * 1024 * 1024
      })
      const audioBuffer = Buffer.from(response.data)
      const safeTitle = cleanTitle(query || videoInfo.title).replace(/[^a-zA-Z0-9_\-.]/g, "_")
      await conn.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        fileName: `${safeTitle}.mp3`,
        ptt: false
      }, { quoted: m })
    } catch (downloadError) {
      let errorMessage = '《✧》Error al generar el audio. Por favor, inténtalo de nuevo más tarde.'
      if (downloadError.message.includes('URL de YouTube no válida')) {
        errorMessage = '《✧》Error: La URL de YouTube no es válida o no se pudo procesar.'
      } else if (downloadError.message.includes('No se pudo obtener la URL de descarga')) {
        errorMessage = '《✧》Error: No se pudo obtener la URL de descarga del video.'
      } else if (downloadError.message.includes('Librería @dark-yasiya/scrap no está disponible')) {
        errorMessage = '《✧》Error: La librería de descarga no está disponible. Contacta al administrador.'
      } else if (downloadError.message.includes('La librería retornó status false')) {
        errorMessage = '《✧》Error: El servicio de descarga no está disponible en este momento.'
      } else if (downloadError.message.includes('Tiempo de espera')) {
        errorMessage = '《✧》Error: Tiempo de espera agotado. El video puede ser muy largo o la conexión es lenta.'
      } else if (downloadError.message.includes('404')) {
        errorMessage = '《✧》Error: El video no se encontró o no está disponible.'
      }
      await conn.sendMessage(m.chat, {
        text: errorMessage,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
  } catch (error) {
    await conn.sendMessage(m.chat, {
      text: `《✧》Error: ${error.message}`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['#play <enlace o título>']
handler.tags = ['downloader', 'audio']
//handler.command = ['play', 'ytmp3', 'mp3']

export default handler 