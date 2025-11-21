import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, command, args, text, isOwner }) => {
  if (!isOwner) {
    return m.reply('*[❗] Solo los dueños pueden usar este comando.*')
  }

  try {

    
    const restartMessage = `╭─「 ✦ 𓆩🔄𓆪 ʀᴇɪɴɪᴄɪᴏ ᴅᴇ ʙᴏᴛ ✦ 」─╮

╰➺ ✧ *Iniciado por:* @${m.sender.split('@')[0]}
╰➺ ✧ *Estado:* Bot reiniciado con éxito. 

> PAIN COMMUNITY`

   
    await conn.sendMessage(m.chat, {
      text: restartMessage,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender]
      }
    }, { quoted: m })

    
    setTimeout(() => {
      console.log(chalk.yellow('🔄 Reinicio iniciado por owner:', m.sender))
      process.exit(0) 
    }, 3000)

  } catch (e) {
    console.error('Error en comando restart:', e)
    conn.reply(m.chat, '❌ Hubo un error al reiniciar el bot.', m, rcanal)
  }
}

handler.command = ['restart', 'reiniciar', 'reboot']
handler.tags = ['owner']
handler.help = ['restart - Reiniciar el bot (solo owners)']
handler.rowner = true

export default handler 