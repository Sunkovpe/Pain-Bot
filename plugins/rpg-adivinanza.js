import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = {}
    
    let coins = user.coins || 0
    
    // Cooldown de 3 minutos
    const cooldown = 3 * 60 * 1000 
    const lastAdivinanza = user.lastAdivinanza || 0
    const timeLeft = cooldown - (Date.now() - lastAdivinanza)
    
    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes esperar *${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}* para volver a jugar a las adivinanzas.`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
    
    // Cargar adivinanzas desde el JSON
    const adivinanzasPath = join('./storage/databases/adivinanzas.json')
    let adivinanzas = []
    
    try {
      const adivinanzasData = fs.readFileSync(adivinanzasPath, 'utf8')
      adivinanzas = JSON.parse(adivinanzasData)
    } catch (error) {
      console.error('Error cargando adivinanzas:', error)
      return conn.sendMessage(m.chat, {
        text: '《✧》Error al cargar las adivinanzas. Contacta al administrador.',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
    
    // Seleccionar adivinanza aleatoria
    const adivinanza = adivinanzas[Math.floor(Math.random() * adivinanzas.length)]
    
    // Guardar la adivinanza activa en la base de datos global
    if (!global.db.data.adivinanzasActivas) global.db.data.adivinanzasActivas = {}
    global.db.data.adivinanzasActivas[m.chat] = {
      pregunta: adivinanza.pregunta,
      respuesta: adivinanza.respuesta.toLowerCase(),
      activa: true,
      creadaPor: m.sender,
      timestamp: Date.now(),
      respondida: false
    }
    
    // Actualizar cooldown del usuario
    global.db.data.users[m.sender].lastAdivinanza = Date.now()
    
    let txt = `╭─「 ✦ 🧩 ᴀᴅɪᴠɪɴᴀɴᴢᴀ ✦ 」─╮\n`
    txt += `│\n`
    txt += `╰➺ ✧ *Pregunta:* ${adivinanza.pregunta}\n`
    txt += `╰➺ ✧ *Premio:* 30 coins\n`
    txt += `╰➺ ✧ *Tiempo:* 60 segundos\n`
    txt += `╰➺ ✧ *Categoría:* ${adivinanza.categoria}\n`
    txt += `│\n`
    txt += `╰➺ ✧ *Responde directamente al mensaje*\n`
    txt += `╰➺ ✧ *Solo una respuesta por persona*\n`
    txt += `╰➺ ✧ *Próxima adivinanza: 3 min*\n`
    txt += `\n> PAIN COMMUNITY`
    
    return conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })
    
  } catch (e) {
    console.error('Error en juego de adivinanzas:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error al ejecutar el juego de adivinanzas.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['#adivinanza\n→ Juega a las adivinanzas cada 3 minutos y gana 30 coins si aciertas']
handler.tags = ['juegos', 'economía']
handler.command = ['adivinanza', 'adivinanzas', 'riddle']

export default handler
