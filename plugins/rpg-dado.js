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
     
   
     let premio = Math.floor(Math.random() * 150) + 1
     
        
      let ganancia = 0
      let resultado = ''
      
      switch (dado) {
        case 1:
          ganancia = -premio 
          resultado = `❌ *¡Perdiste!* Has perdido ${global.moneda}`
          break
        case 2:
          ganancia = Math.floor(premio * 0.5) 
          resultado = `😔 *¡Casi!* Has ganado la mitad`
          break
        case 3:
          ganancia = premio 
          resultado = `✅ *¡Ganaste!* Premio completo`
          break
        case 4:
          ganancia = Math.floor(premio * 1.5) 
          resultado = `✅ *¡Ganaste!* Premio +50%`
          break
        case 5:
          ganancia = premio * 2 
          resultado = `🎉 *¡EXCELENTE!* Premio x2`
          break
        case 6:
          ganancia = premio * 3 
          resultado = `🎉 *¡JACKPOT!* Premio x3`
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

handler.help = ['#dado\n→ Juega al dado cada 2 minutos y gana o pierde USD según el número']
handler.tags = ['juegos', 'economía']
handler.command = ['dado', 'dice', 'dados']

export default handler 