let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    
    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = {}
    
    let coins = user.coins || 0
    
    
    const cooldown = 2 * 60 * 1000 
    const lastDado = user.lastDado || 0
    const timeLeft = cooldown - (Date.now() - lastDado)
    
    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes esperar *${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}* para volver a jugar al dado.`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
    
        
     let dado = Math.floor(Math.random() * 6) + 1
     
   
     let premioBase = Math.floor(Math.random() * (1500 - 100 + 1)) + 100
     
     let perdidaAlta = Math.floor(Math.random() * (1500 - 500 + 1)) + 500
     let perdidaMedia = Math.floor(Math.random() * (1500 - 500 + 1)) + 500
     
     let gananciaPequena = Math.floor(Math.random() * (400 - 250 + 1)) + 250
     let gananciaMedia = Math.floor(Math.random() * (1200 - 800 + 1)) + 800
     let gananciaAlta = Math.floor(Math.random() * (2500 - 1500 + 1)) + 1500
     let jackpot = Math.floor(Math.random() * (2500 - 1000 + 1)) + 1000
     
     
      let ganancia = 0
      let resultado = ''
      
      switch (dado) {
        case 1:
          ganancia = -perdidaAlta 
          resultado = `❌ *¡PÉRDIDA TOTAL!* Has perdido ${perdidaAlta} ${global.moneda}`
          break
        case 2:
          ganancia = -perdidaMedia 
          resultado = `😔 *¡Mala suerte!* Has perdido ${perdidaMedia} ${global.moneda}`
          break
        case 3:
          ganancia = -perdidaAlta 
          resultado = `💸 *¡Qué lástima!* Has perdido ${perdidaAlta} ${global.moneda}`
          break
        case 4:
          ganancia = gananciaPequena 
          resultado = `✅ *¡Poco pero seguro!* Ganaste ${gananciaPequena} ${global.moneda}`
          break
        case 5:
          ganancia = gananciaMedia 
          resultado = `🎯 *¡Buena tirada!* Ganaste ${gananciaMedia} ${global.moneda}`
          break
        case 6:
          ganancia = gananciaAlta 
          resultado = `👑 *¡JACKPOT MÁXIMO!* Ganaste ${gananciaAlta} ${global.moneda}`
          break
      }
    
        
     global.db.data.users[m.sender].coins = coins + ganancia
     global.db.data.users[m.sender].lastDado = Date.now()
    
   
    const emojisDado = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']
    
              let txt = `╭─「 ✦ 🎲 ᴅᴀᴅᴏ ✦ 」─╮\n`
     txt += `│\n`
     txt += `╰➺ ✧ *Dado:* ${emojisDado[dado-1]} (${dado})\n`
     txt += `╰➺ ✧ *Resultado:* ${ganancia > 0 ? '+' : ''}${ganancia} ${global.moneda}\n`
     txt += `╰➺ ✧ *Total:* ${coins + ganancia} ${global.moneda}\n`
     txt += `│\n`
     txt += `╰➺ ✧ ${resultado}\n`
     txt += `╰➺ ✧ *Próximo: 2 min*\n`
     txt += `\n> PAIN COMMUNITY`
    
    return conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })
    
  } catch (e) {
    console.error('Error en juego del dado:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error al ejecutar el juego del dado.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['#dado\n→ Juega al dado cada 2 minutos. 50% chance de perder 500-1500 USD. Ganancias: 250-2500 USD']
handler.tags = ['juegos', 'economía']
handler.command = ['dado', 'dice', 'dados']

export default handler 