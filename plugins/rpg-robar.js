/**
 *  SISTEMA DE ROBO - PAIN BOT
 * Sistema de robo con riesgos y probabilidades
 */

const cooldownRobo = 10 * 60 * 1000 
const multaRoboFallido = 25 
const probabilidadRoboExitoso = 0.65 


function getUserName(userId) {
  if (!userId || typeof userId !== 'string') return 'Usuario'
  try {
    return userId.split('@')[0] || 'Usuario'
  } catch (e) {
    return 'Usuario'
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    if (!m.isGroup) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Este comando solo puede ser usado en grupos.',
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }

    
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes mencionar a quien quieres robar.\nEjemplo: ${usedPrefix + command} @usuario`,
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }

    const victima = m.mentionedJid[0]
    const ladron = m.sender

    
    if (victima === ladron) {
      return conn.sendMessage(m.chat, {
        text: '《✧》No puedes robarte a ti mismo.',
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }

    
    let userLadron = global.db.data.users[ladron]
    if (!userLadron) {
      global.db.data.users[ladron] = {
        coins: 100,
        exp: 0,
        level: 0,
        registered: true,
        name: m.name || m.pushName || 'Usuario'
      }
      userLadron = global.db.data.users[ladron]
    }

    
    let userVictima = global.db.data.users[victima]
    if (!userVictima) {
      global.db.data.users[victima] = {
        coins: 100,
        exp: 0,
        level: 0,
        registered: true,
        name: 'Usuario'
      }
      userVictima = global.db.data.users[victima]
    }

    if (!userLadron.banco) userLadron.banco = null
    if (!userLadron.bancoDinero) userLadron.bancoDinero = 0
    if (!userVictima.banco) userVictima.banco = null
    if (!userVictima.bancoDinero) userVictima.bancoDinero = 0

    
    if (!userLadron.lastRobo) userLadron.lastRobo = 0
    const timeSinceLastRobo = Date.now() - userLadron.lastRobo

    if (timeSinceLastRobo < cooldownRobo) {
      const minutes = Math.ceil((cooldownRobo - timeSinceLastRobo) / 60000)
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes esperar *${minutes} minuto${minutes !== 1 ? 's' : ''}* para volver a robar.`,
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }

    
    if (userVictima.coins <= 0) {
      
      userLadron.lastRobo = Date.now()

      
      let multa = multaRoboFallido
      if (userLadron.coins < multa) multa = userLadron.coins
      if (multa > 0) userLadron.coins -= multa

      let txt = `╭─「 ✦ ROBO FALLIDO ✦ 」─╮\n│\n`
      txt += `╰➺ ✧ Ladrón: @${getUserName(ladron)}\n`
      txt += `╰➺ ✧ Víctima: @${getUserName(victima)}\n│\n`
      txt += `╰➺ ✧ Resultado: Robo fallido\n`
      txt += `╰➺ ✧ La víctima no tiene dinero!\n`
      txt += `╰➺ ✧ Multa: -${multa} ${global.moneda}\n`
      txt += `╰➺ ✧ Total: ${userLadron.coins} ${global.moneda}\n│\n`
      txt += `╰➺ ✧ Mejor suerte la próxima vez\n\n> PAIN COMMUNITY`

      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [ladron, victima]
        }
      }, { quoted: m })
    }

    
    userLadron.lastRobo = Date.now()


    const roboExitoso = Math.random() < probabilidadRoboExitoso

    if (roboExitoso) {
      
      let cantidadRobada = Math.floor(userVictima.coins * 0.2) 

      
      if (userVictima.coins <= 100) cantidadRobada = Math.floor(userVictima.coins * 0.15) // 15% para cantidades pequeñas
      else if (userVictima.coins <= 500) cantidadRobada = Math.floor(userVictima.coins * 0.18) // 18% para medianas
      else if (userVictima.coins <= 1000) cantidadRobada = Math.floor(userVictima.coins * 0.20) // 20% para grandes
      else cantidadRobada = Math.floor(userVictima.coins * 0.15) 

      
      if (cantidadRobada < 1) cantidadRobada = 1

    
      userVictima.coins -= cantidadRobada
      userLadron.coins += cantidadRobada

      let txt = `╭─「 ✦ ROBO EXITOSO ✦ 」─╮\n│\n`
      txt += `╰➺ ✧ Ladrón: @${getUserName(ladron)}\n`
      txt += `╰➺ ✧ Víctima: @${getUserName(victima)}\n│\n`
      txt += `╰➺ ✧ Resultado: Robo exitoso\n`
      txt += `╰➺ ✧ Robado: ${cantidadRobada} ${global.moneda}\n`
      txt += `╰➺ ✧ Víctima queda con: ${userVictima.coins} ${global.moneda}\n`
      txt += `╰➺ ✧ Ladrón tiene: ${userLadron.coins} ${global.moneda}\n│\n`
      txt += `╰➺ ✧ Robo perfecto!\n\n> PAIN COMMUNITY`

      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [ladron, victima]
        }
      }, { quoted: m })

    } else {
      
      let multa = Math.floor(userLadron.coins * 0.1) 
      if (multa < multaRoboFallido) multa = multaRoboFallido
      if (userLadron.coins < multa) multa = userLadron.coins
      if (multa > 0) userLadron.coins -= multa

      let txt = `╭─「 ✦ ROBO FALLIDO ✦ 」─╮\n│\n`
      txt += `╰➺ ✧ Ladrón: @${getUserName(ladron)}\n`
      txt += `╰➺ ✧ Víctima: @${getUserName(victima)}\n│\n`
      txt += `╰➺ ✧ Resultado: Robo fallido\n`
      txt += `╰➺ ✧ La policía te atrapó!\n`
      txt += `╰➺ ✧ Multa: -${multa} ${global.moneda}\n`
      txt += `╰➺ ✧ Total: ${userLadron.coins} ${global.moneda}\n│\n`
      txt += `╰➺ ✧ Escapa antes de que sea tarde!\n\n> PAIN COMMUNITY`

      return conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
          ...rcanal.contextInfo,
          mentionedJid: [ladron, victima]
        }
      }, { quoted: m })
    }

  } catch (e) {
    console.error('Error en robo:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error en el sistema de robo.',
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }
}

handler.help = ['robar', 'rob', 'steal']
handler.tags = ['juegos', 'economía', 'rpg']
handler.command = ['robar', 'rob', 'steal']

export default handler
