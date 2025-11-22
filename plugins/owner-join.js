/**
 * COMANDO OWNER JOIN - PAIN BOT
 * Permite al owner hacer que el bot se una a un grupo via link de invitación
 */

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return conn.sendMessage(m.chat, {
      text: '《✧》Este comando solo puede ser usado por el owner del bot.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  if (!args[0]) {
    return conn.sendMessage(m.chat, {
      text: `《✧》Uso correcto: ${usedPrefix}${command} <link del grupo>\n\nEjemplo: ${usedPrefix}${command} https://chat.whatsapp.com/ABC123`,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  let link = args[0].trim()

  
  const inviteCode = link.match(/chat\.whatsapp\.com\/(?:invite\/)?([A-Za-z0-9]+)/)?.[1]

  if (!inviteCode) {
    return conn.sendMessage(m.chat, {
      text: '《✧》Link de invitación inválido. Usa el formato: https://chat.whatsapp.com/<código>',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }

  try {
    
    // Intentar unirse al grupo
    await conn.groupAcceptInvite(inviteCode)

    conn.sendMessage(m.chat, {
      text: '《✧》Bot se ha unido exitosamente al grupo.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })

  } catch (error) {
    console.error('Error al unirse al grupo:', error)
    
    if (error.data == 401) {
      conn.sendMessage(m.chat, {
        text: '《✧》Código de invitación inválido, expirado o el bot no tiene permisos para unirse.',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    } else {
      conn.sendMessage(m.chat, {
        text: `《✧》Error al unirse al grupo: ${error.message || 'Desconocido'}`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }
  }
}

handler.help = ['join <link> → Hace que el bot se una a un grupo (solo owner)']
handler.tags = ['owner']
handler.command = ['join']
handler.owner = true

export default handler
