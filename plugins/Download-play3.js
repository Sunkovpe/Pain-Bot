import fetch from "node-fetch"
import yts from "yt-search"

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    if (!text?.trim())
      return conn.sendMessage(m.chat, {
        text: "ඞ Ingresa el nombre o enlace de YouTube.",
        contextInfo: { ...rcanal?.contextInfo }
      }, { quoted: m })

    let videoUrl
    let searchResult

    const isUrl = /youtu\.be|youtube\.com/.test(text)

    if (isUrl) {
      
      videoUrl = text
    } else {
    
      const search = await yts(text)
      if (!search || !search.videos || search.videos.length === 0)
        throw "⚠︎ No se encontraron resultados para la búsqueda."

      
      searchResult = search.videos[0]
      videoUrl = searchResult.url
    }

    
    const apiUrl = `https://api.delirius.store/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(apiUrl).then(r => r.json())

    if (!res?.status || !res.data?.download?.url)
      throw "⚠︎ No se pudo obtener el audio."

    const data = res.data
    const vistas = formatViews(data.views)

    
    const title = searchResult?.title || data.title
    const author = searchResult?.author?.name || data.author
    const thumbnail = searchResult?.thumbnail || data.image
    const duration = searchResult?.timestamp || formatDuration(data.duration)
    const ago = searchResult?.ago || "No disponible"

    const info = `╭───「 ✦ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 ✦ 」
│ ✪ *Título:* ${title}
│ ✯ *Canal:* ${author}
│ ✰ *Vistas:* ${vistas}
│ ◔ *Duración:* ${duration}
│ ◐ *Publicado:* ${ago}
│ ➪ *Enlace:* ${videoUrl}
╰─`

    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(
      m.chat,
      { image: thumb, caption: info, contextInfo: { ...rcanal?.contextInfo } },
      { quoted: m }
    )

    
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: data.download.url },
        fileName: data.download.filename || `${title}.mp3`,
        mimetype: "audio/mpeg"
      },
      { quoted: m }
    )

  } catch (e) {
    return conn.sendMessage(m.chat, {
      text: typeof e === "string"
        ? e
        : `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n${e.message}`,
      contextInfo: { ...rcanal?.contextInfo }
    }, { quoted: m })
  }
}

handler.command = ["play", "ytmp3", "playaudio"]
handler.tags = ["descargas"]
handler.group = true

export default handler

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "No disponible"
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}