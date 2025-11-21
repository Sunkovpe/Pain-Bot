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
     
     let gananciaPequena = Math.floor(Math.random() * (200 - 50 + 1)) + 50
     let gananciaMedia = Math.floor(Math.random() * (600 - 200 + 1)) + 200
     let gananciaAlta = Math.floor(Math.random() * (1200 - 500 + 1)) + 500
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
          ganancia = gananciaPequena 
          resultado = `✅ *¡Poco pero seguro!* Ganaste ${gananciaPequena} ${global.moneda}`
          break
        case 4:
          ganancia = gananciaMedia 
          resultado = `🎯 *¡Buena tirada!* Ganaste ${gananciaMedia} ${global.moneda}`
          break
        case 5:
          ganancia = gananciaAlta 
          resultado = `🎉 *¡EXCELENTE!* Ganaste ${gananciaAlta} ${global.moneda}`
          break
        case 6:
          ganancia = jackpot 
          resultado = `👑 *¡JACKPOT MÁXIMO!* Ganaste ${jackpot} ${global.moneda}`
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

handler.help = ['#dado\n→ Juega al dado cada 2 minutos. Pérdidas: 500-1500 USD. Ganancias: 50-2500 USD según el número']
handler.tags = ['juegos', 'economía']
handler.command = ['dado', 'dice', 'dados']

export default handler 