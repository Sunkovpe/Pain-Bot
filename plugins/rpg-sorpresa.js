let handler = async (m, { conn, usedPrefix, command }) => {
  let user = global.db.data.users[m.sender]
  if (!user) global.db.data.users[m.sender] = {}
  
  let time = user.lastSorpresa || 0
  let cd = 120000
  if (Date.now() - time < cd) {
    let remaining = cd - (Date.now() - time)
    let minutes = Math.floor(remaining / 60000)
    let seconds = Math.floor((remaining % 60000) / 1000)
    return conn.sendMessage(m.chat, {
      text: `《✧》Espera ${minutes} minutos y ${seconds} segundos para usar otra sorpresa.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  
  let chance = Math.random()
  if (chance < 0.25) {
  
    user.lastSorpresa = Date.now()
    let txt = `╭─「 ✦ 🎁 ꜱᴏʀᴘʀᴇꜱᴀ ✦ 」─╮\n`
    txt += `│\n`
    txt += `╰➺ ✧ Esta caja esta Vacía 😔\n`
    txt += `╰➺ ✧ Mejor suerte la próxima vez\n`
    txt += `\n> PAIN COMMUNITY`
    
    return conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })
  }

  // Ganar USD entre 450-1500
  let amount = Math.floor(Math.random() * (1500 - 450 + 1)) + 450
  global.db.data.users[m.sender].coins = (user.coins || 0) + amount
  user.lastSorpresa = Date.now()

  let txt = `╭─「 ✦ 🎁 ꜱᴏʀᴘʀᴇꜱᴀ ✦ 」─╮\n`
  txt += `│\n`
  txt += `╰➺ ✧ *Premio:* +${amount} ${global.moneda}\n`
  txt += `╰➺ ✧ *Total:* ${global.db.data.users[m.sender].coins} ${global.moneda}\n`
  txt += `╰➺ ✧ ¡Felicidades! Sigue jugando\n`
  txt += `\n> PAIN COMMUNITY`

  conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: {
      ...rcanal.contextInfo,
      mentionedJid: [m.sender]
    }
  }, { quoted: m })

}

handler.help = ['sorpresa → Obtén una sorpresa con USD (cooldown 2 min)']
handler.tags = ['rpg', 'game']
handler.command = ['sorpresa', 'surprise']

export default handler
