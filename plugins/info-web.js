/**
 * COMANDO DE INFORMACIÓN WEB - PAIN BOT
 * Analiza y muestra información completa de una página web
 */

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    
    if (!args[0]) {
      return conn.sendMessage(m.chat, {
        text: `《✧》Uso correcto: ${usedPrefix}${command} [URL]\n\nEjemplo: ${usedPrefix}${command} https://github.com\n\n*Nota:* La URL debe incluir http:// o https://`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    const url = args[0].trim()

    
    try {
      new URL(url)
    } catch (error) {
      return conn.sendMessage(m.chat, {
        text: '《✧》URL inválida. Asegúrate de incluir http:// o https://',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }


    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      const contentType = response.headers.get('content-type') || ''
      const contentLength = response.headers.get('content-length') || 'Desconocido'
      const server = response.headers.get('server') || 'Desconocido'

      
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : 'Sin título'

      const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                              html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i)
      const description = descriptionMatch ? descriptionMatch[1].trim() : 'Sin descripción'

      const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                           html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']keywords["'][^>]*>/i)
      const keywords = keywordsMatch ? keywordsMatch[1].trim() : 'Sin palabras clave'

      
      const images = (html.match(/<img[^>]+>/gi) || []).length
      const links = (html.match(/<a[^>]+href=["'][^"']+["'][^>]*>/gi) || []).length
      const scripts = (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).length
      const styles = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length + (html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || []).length

      
      const urlObj = new URL(url)
      const domain = urlObj.hostname

      
      const sizeKB = Math.round(html.length / 1024)

      clearTimeout(timeoutId)

      
      let infoText = `╭─「 WEB INFO 」─╮\n`
      infoText += `│\n`
      infoText += `╰➺ ✧ *URL:* ${url}\n`
      infoText += `╰➺ ✧ *Dominio:* ${domain}\n`
      infoText += `╰➺ ✧ *Título:* ${title}\n`
      infoText += `╰➺ ✧ *Descripción:* ${description}\n`
      infoText += `╰➺ ✧ *Palabras clave:* ${keywords}\n`
      infoText += `│\n`
      infoText += `╰➺ ✧ ESTADÍSTICAS: \n`
      infoText += `╰➺ ✧ Tamaño aproximado: ${sizeKB} KB\n`
      infoText += `╰➺ ✧ Imágenes: ${images}\n`
      infoText += `╰➺ ✧ Enlaces: ${links}\n`
      infoText += `╰➺ ✧ Scripts: ${scripts}\n`
      infoText += `╰➺ ✧ Hojas de estilo: ${styles}\n`
      infoText += `│\n`
      infoText += `╰➺ ✧ ADICIONAL: \n`
      infoText += `╰➺ ✧ Content-Type: ${contentType}\n`
      infoText += `╰➺ ✧ Content-Length: ${contentLength}\n`
      infoText += `╰➺ ✧ Servidor: ${server}\n`
      infoText += `╰➺ ✧ Status: ${response.status} ${response.statusText}\n`
      infoText += `\n> PAIN COMMUNITY`

      await conn.sendMessage(m.chat, {
        text: infoText,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [m.sender]
        }
      }, { quoted: m })

    } catch (error) {
      clearTimeout(timeoutId)
      return conn.sendMessage(m.chat, {
        text: `❌ Error al acceder a la página web: ${error.message}`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

  } catch (error) {
    console.error('Error en comando webinfo:', error)
    return conn.sendMessage(m.chat, {
      text: '❌ Ocurrió un error al analizar la página web.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['webinfo', 'web', 'pagina → Analiza información completa de una página web']
handler.tags = ['herramientas', 'utilidades']
handler.command = ['webinfo', 'web', 'pagina']

export default handler
