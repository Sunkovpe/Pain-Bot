import fs from 'fs'
import path from 'path'
import { join } from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, usedPrefix, command, args, text, isOwner }) => {
  if (!isOwner) {
    return m.reply('*[❗] Solo los dueños pueden usar este comando.*')
  }

  try {
    if (conn !== global.conn) {
      return m.reply('*[❗] Este comando solo puede ser usado desde el bot principal.*')
    }

    if (!global.conns || !Array.isArray(global.conns) || global.conns.length === 0) {
      return m.reply('*[❗] No hay sub-bots conectados en este momento.*')
    }

    const connectedSubBots = global.conns.filter(subConn => 
      subConn.user && 
      subConn.user.jid && 
      subConn.ws?.socket?.readyState === 1 
    )

    if (connectedSubBots.length === 0) {
      return m.reply('*[❗] No hay sub-bots conectados en este momento.*')
    }

    if (!text) {
      let subBotsList = `╭─「 ✦ 𓆩🔴𓆪 ᴄᴇʀʀᴀʀ sᴇsɪᴏ́ɴ ✦ 」─╮\n`
      subBotsList += `│\n`
      subBotsList += `╰➺ ✧ *Sub-bots conectados:*\n`
      
      let i = 1
      for (const subConn of connectedSubBots) {
        const botNumber = subConn.user.jid.split('@')[0]
        const userName = subConn.user.name || 'Anónimo'
        subBotsList += `╰➺ ✧ *${i}.* +${botNumber} (${userName})\n`
        i++
      }
      
      subBotsList += `│\n`
      subBotsList += `╰➺ ✧ *Uso:* ${usedPrefix}${command} <número>\n`
      subBotsList += `╰➺ ✧ *Ejemplo:* ${usedPrefix}${command} 1234567890\n`
      subBotsList += `╰➺ ✧ *O:* ${usedPrefix}${command} all (cerrar todos)\n`
      subBotsList += `│\n`
      subBotsList += `╰➺ ✧ *Owner:* @${m.sender.split('@')[0]}\n`
      subBotsList += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: subBotsList,
        contextInfo: {
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
    }

    const target = text.trim().toLowerCase()
    
    if (target === 'all' || target === 'todos') {
      let killedCount = 0
      let failedCount = 0
      
      for (const subConn of connectedSubBots) {
        try {
          const botNumber = subConn.user.jid.split('@')[0]
          const botPath = path.join('./Serbot', botNumber)
          
          await subConn.logout()
          subConn.ws.close()
          subConn.ev.removeAllListeners()
          
          let i = global.conns.indexOf(subConn)
          if (i >= 0) {
            global.conns.splice(i, 1)
          }
          
          if (fs.existsSync(botPath)) {
            fs.rmdirSync(botPath, { recursive: true })
          }
          
          killedCount++
          console.log(chalk.green(`✅ Sesión cerrada: +${botNumber}`))
          
        } catch (error) {
          failedCount++
          console.error(`❌ Error cerrando sesión:`, error.message)
        }
      }
      
      const resultMessage = `╭─「 ✦ 𓆩🔴𓆪 sᴇsɪᴏɴᴇs ᴄᴇʀʀᴀᴅᴀs ✦ 」─╮\n`
      resultMessage += `│\n`
      resultMessage += `╰➺ ✧ *Owner:* @${m.sender.split('@')[0]}\n`
      resultMessage += `╰➺ ✧ *Acción:* Cerrar todas las sesiones\n`
      resultMessage += `╰➺ ✧ *Cerradas exitosamente:* ${killedCount}\n`
      resultMessage += `╰➺ ✧ *Fallidas:* ${failedCount}\n`
      resultMessage += `│\n`
      resultMessage += `╰➺ ✧ *Total sub-bots:* ${connectedSubBots.length}\n`
      resultMessage += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: resultMessage,
        contextInfo: {
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
    }

    const targetNumber = target.replace(/[^0-9]/g, '')
    
    if (!targetNumber) {
      return m.reply(`*[❗] Número inválido.*\n\n> Ejemplo: ${usedPrefix}${command} 1234567890`)
    }

    const targetSubBot = connectedSubBots.find(subConn => 
      subConn.user.jid.includes(targetNumber)
    )

    if (!targetSubBot) {
      return m.reply(`*[❗] No se encontró un sub-bot con el número +${targetNumber}.*`)
    }

    try {
      const botNumber = targetSubBot.user.jid.split('@')[0]
      const userName = targetSubBot.user.name || 'Anónimo'
      const botPath = path.join('./Serbot', botNumber)
      
      await targetSubBot.logout()
      targetSubBot.ws.close()
      targetSubBot.ev.removeAllListeners()
      
      let i = global.conns.indexOf(targetSubBot)
      if (i >= 0) {
        global.conns.splice(i, 1)
      }
      
      if (fs.existsSync(botPath)) {
        fs.rmdirSync(botPath, { recursive: true })
      }
      
      console.log(chalk.green(`✅ Sesión cerrada: +${botNumber} (${userName})`))
      
      const successMessage = `╭─「 ✦ 𓆩🔴𓆪 sᴇsɪᴏ́ɴ ᴄᴇʀʀᴀᴅᴀ ✦ 」─╮\n`
      successMessage += `│\n`
      successMessage += `╰➺ ✧ *Owner:* @${m.sender.split('@')[0]}\n`
      successMessage += `╰➺ ✧ *Sub-bot:* +${botNumber}\n`
      successMessage += `╰➺ ✧ *Usuario:* ${userName}\n`
      successMessage += `╰➺ ✧ *Estado:* Sesión cerrada ✅\n`
      successMessage += `╰➺ ✧ *Carpeta eliminada:* Sí\n`
      successMessage += `│\n`
      successMessage += `╰➺ ✧ *El sub-bot ya no está conectado*\n`
      successMessage += `\n> PAIN COMMUNITY`
      
      return conn.sendMessage(m.chat, {
        text: successMessage,
        contextInfo: {
          mentionedJid: [m.sender]
        }
      }, { quoted: m })
      
    } catch (error) {
      console.error('Error cerrando sesión específica:', error)
      return m.reply(`*[❌] Error al cerrar la sesión:* ${error.message}`)
    }

  } catch (e) {
    console.error('Error en comando kill-session:', e)
    return m.reply('❌ Hubo un error al procesar el comando.')
  }
}

handler.command = ['killsession', 'killsub', 'cerrarsesion', 'cerrarsub']
handler.help = ['#killsession <número> • #killsession all']
handler.tags = ['owner']
export default handler
