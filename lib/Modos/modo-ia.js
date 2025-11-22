/**
 * Modo IA Normal
 * Respuestas automáticas usando Gemini AI
 */

export async function handleModoIA(m, conn) {
  if (!m.isGroup || !global.db.data.modoIA || !global.db.data.modoIA[m.chat] || !m.text || m.fromMe) return

  try {
    const { callGeminiAPI, isLikelyCommand } = await import('../geminiAPI.js')

    
    if (isLikelyCommand(m.text)) return

    
    if (m.text.trim().length < 3) return

    
    if (/^[\s\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]*$/u.test(m.text)) return

    const rcanal = global.rcanal || {
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363403162100537@newsletter',
          serverMessageId: 100,
          newsletterName: 'PAIN COMMUNITY'
        }
      }
    }

    const userName = m.pushName || m.name || 'Usuario'
    const groupName = await conn.getName(m.chat) || 'Grupo'

    
    await conn.sendPresenceUpdate('composing', m.chat)

    const response = await callGeminiAPI(m.text, userName, groupName, m.chat)

    
    if (response && response.length > 0) {
      // Verificar si la respuesta contiene un comando para ejecutar
      const commandMatch = response.match(/\[COMANDO:\s*([^\]]+)\]/)
      if (commandMatch) {
        const commandText = commandMatch[1].trim()
        // Remover el marcador del comando de la respuesta
        const cleanResponse = response.replace(/\[COMANDO:[^\]]+\]/, '').trim()
        
        // Enviar respuesta limpia
        if (cleanResponse) {
          await conn.sendMessage(m.chat, {
            text: cleanResponse,
            contextInfo: {
              ...rcanal.contextInfo
            }
          }, { quoted: m })
        }
        
        // Simular mensaje con el comando
        const fakeMessage = {
          ...m,
          text: global.usedPrefix + commandText,
          body: global.usedPrefix + commandText,
          message: {
            conversation: global.usedPrefix + commandText,
            extendedTextMessage: { text: global.usedPrefix + commandText }
          }
        }
        
        // Llamar al handler con el mensaje simulado
        try {
          const handlerModule = await import('../../handler.js')
          await handlerModule.handler(fakeMessage, { conn })
        } catch (error) {
          console.error('Error ejecutando comando desde IA:', error)
        }
        
        return // No enviar respuesta adicional
      }
      
      // Respuesta normal
      await conn.sendMessage(m.chat, {
        text: response,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

  } catch (error) {
    console.error('Error en Modo IA:', error)
  }
}
