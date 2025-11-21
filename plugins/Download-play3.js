import fetch from "node-fetch"

const handler = async (m, { conn, text, usedPrefix }) => {
  try {
    if (!text?.trim())
      return conn.sendMessage(m.chat, {
        text: "ඞ Ingresa el nombre o enlace de YouTube.",
        contextInfo: { ...rcanal?.contextInfo }
      }, { quoted: m })

    let apiUrl
    const isUrl = /youtu\.be|youtube\.com/.test(text)

    if (isUrl) {
      
      apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(text)}&quality=128`
    } else {
      
      apiUrl = `https://api.vreden.my.id/api/v1/download/play/audio?query=${encodeURIComponent(text)}`
    }

    const res = await fetch(apiUrl).then(r => r.json())

    if (!res?.status || !res.result?.download?.url)
      throw "⚠︎ No se pudo obtener el audio."

    const meta = res.result.metadata
    const down = res.result.download
    const vistas = formatViews(meta.views)

    const info = `╭───「 ✦ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 ✦ 」
│ ✪ *Título:* ${meta.title}
│ ✯ *Canal:* ${meta.author.name}
│ ✰ *Vistas:* ${vistas}
│ ◔ *Duración:* ${meta.timestamp}
│ ◐ *Publicado:* ${meta.ago}
│ ➪ *Enlace:* ${meta.url}
╰─`

    const thumb = (await conn.getFile(meta.thumbnail)).data
    await conn.sendMessage(
      m.chat,
      { image: thumb, caption: info, contextInfo: { ...rcanal?.contextInfo } },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      { audio: { url: down.url }, fileName: down.filename || `${meta.title}.mp3`, mimetype: "audio/mpeg" },
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

function formatViews(views) {
  if (views === undefined) return "No disponible"
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  return views.toString()
}