let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let user = global.db.data.users[m.sender]
    if (!user) global.db.data.users[m.sender] = {}

    let coins = user.coins || 0

    
    const cooldown = 2 * 60 * 1000
    const lastPescar = user.lastPescar || 0
    const timeLeft = cooldown - (Date.now() - lastPescar)

    if (timeLeft > 0) {
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = Math.floor((timeLeft % 60000) / 1000)
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes esperar *${minutes} minuto${minutes !== 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}* para volver a pescar.`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    
    const pescados = [
    
      { nombre: '🐟 Pececillo', valor: 1, emoji: '🐟', rareza: 'Común' },
      { nombre: '🐠 Pez Payaso', valor: 2, emoji: '🐠', rareza: 'Común' },
      { nombre: '🦐 Camarón', valor: 3, emoji: '🦐', rareza: 'Común' },
      { nombre: '🦞 Langosta', valor: 4, emoji: '🦞', rareza: 'Común' },
      { nombre: '🐡 Pez Globo', valor: 5, emoji: '🐡', rareza: 'Común' },

      
      { nombre: '🐙 Pulpo', valor: 8, emoji: '🐙', rareza: 'Poco Común' },
      { nombre: '🦑 Calamar', valor: 10, emoji: '🦑', rareza: 'Poco Común' },
      { nombre: '🦀 Cangrejo', valor: 12, emoji: '🦀', rareza: 'Poco Común' },
      { nombre: '🐢 Tortuga Marina', valor: 15, emoji: '🐢', rareza: 'Poco Común' },

      
      { nombre: '🦈 Tiburón', valor: 25, emoji: '🦈', rareza: 'Raro' },
      { nombre: '🐬 Delfín', valor: 30, emoji: '🐬', rareza: 'Raro' },
      { nombre: '🦭 Foca', valor: 35, emoji: '🦭', rareza: 'Raro' },

      
      { nombre: '🐋 Ballena', valor: 50, emoji: '🐋', rareza: 'Épico' },
      { nombre: '🦭 León Marino', valor: 60, emoji: '🦭', rareza: 'Épico' },

      
      { nombre: '🦕 Megalodón', valor: 100, emoji: '🦕', rareza: 'Legendario' },
      { nombre: '🐉 Dragón Marino', valor: 200, emoji: '🐉', rareza: 'Legendario' }
    ]

    
    const rand = Math.random() * 100

    let pescado
    if (rand < 60) {
      // 60% - Comunes
      const comunes = pescados.filter(p => p.rareza === 'Común')
      pescado = comunes[Math.floor(Math.random() * comunes.length)]
    } else if (rand < 85) {
      // 25% - Poco comunes
      const pocoComunes = pescados.filter(p => p.rareza === 'Poco Común')
      pescado = pocoComunes[Math.floor(Math.random() * pocoComunes.length)]
    } else if (rand < 95) {
      // 10% - Raros
      const raros = pescados.filter(p => p.rareza === 'Raro')
      pescado = raros[Math.floor(Math.random() * raros.length)]
    } else if (rand < 99) {
      // 4% - Épicos
      const epicos = pescados.filter(p => p.rareza === 'Épico')
      pescado = epicos[Math.floor(Math.random() * epicos.length)]
    } else {
      // 1% - Legendarios
      const legendarios = pescados.filter(p => p.rareza === 'Legendario')
      pescado = legendarios[Math.floor(Math.random() * legendarios.length)]
    }

    
    global.db.data.users[m.sender].coins = coins + pescado.valor
    global.db.data.users[m.sender].lastPescar = Date.now()

    
    let mensajeRareza = ''
    switch (pescado.rareza) {
      case 'Común':
        mensajeRareza = '🎣 *¡Buena pesca!*'
        break
      case 'Poco Común':
        mensajeRareza = '🎣 *¡Pesca decente!*'
        break
      case 'Raro':
        mensajeRareza = '🎉 *¡Excelente pesca!*'
        break
      case 'Épico':
        mensajeRareza = '🏆 *¡PESCA ÉPICA!*'
        break
      case 'Legendario':
        mensajeRareza = '👑 *¡PESCA LEGENDARIA!*'
        break
    }

    let txt = `╭─「 ✦ 🎣 ᴘᴇsᴄᴀʀ ✦ 」─╮\n`
    txt += `│\n`
    txt += `╰➺ ✧ ${mensajeRareza}\n`
    txt += `╰➺ ✧ *Pez capturado:* ${pescado.nombre} ${pescado.emoji}\n`
    txt += `╰➺ ✧ *Valor:* +${pescado.valor} ${global.moneda}\n`
    txt += `╰➺ ✧ *Total:* ${coins + pescado.valor} ${global.moneda}\n`
    txt += `╰➺ ✧ *Rareza:* ${pescado.rareza}\n`
    txt += `│\n`
    txt += `╰➺ ✧ *Próxima pesca: 2 min*\n`
    txt += `\n> PAIN COMMUNITY`

    return conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })

  } catch (e) {
    console.error('Error en juego de pescar:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error al pescar. Contacta al administrador.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['#pescar\n→ Pesca peces aleatorios cada 2 minutos y gana USD según el pez capturado']
handler.tags = ['juegos', 'economía']
handler.command = ['pescar', 'fish', 'fishing']

export default handler
