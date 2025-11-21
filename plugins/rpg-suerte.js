/**
 * 🍀 SISTEMA DE SUERTE - PAIN BOT
 * Situaciones afortunadas con recompensas aleatorias
 */

const cooldownTime = 10 * 60 * 1000 // 10 minutos

// Array de situaciones de suerte (todas positivas)
const situacionesSuerte = [
  { descripcion: 'Encontraste una moneda de oro en la calle y la vendiste', recompensa: [100, 200] },
  { descripcion: 'Ganaste la lotería local con un boleto olvidado', recompensa: [150, 300] },
  { descripcion: 'Un turista te dio una propina exagerada por ayudar', recompensa: [120, 250] },
  { descripcion: 'Encontraste una billetera con dinero y el dueño te recompensó', recompensa: [180, 350] },
  { descripcion: 'Herenciaste una pequeña fortuna de un familiar lejano', recompensa: [200, 400] },
  { descripcion: 'Vendiste un objeto viejo que resultó ser valioso', recompensa: [130, 260] },
  { descripcion: 'Ganaste un concurso de redes sociales', recompensa: [160, 320] },
  { descripcion: 'Encontraste trabajo freelance bien pagado', recompensa: [190, 380] },
  { descripcion: 'Un amigo te devolvió una deuda olvidada', recompensa: [140, 280] },
  { descripcion: 'Recibiste un bono sorpresa en tu trabajo', recompensa: [170, 340] },
  { descripcion: 'Vendiste fotos tuyas a una revista', recompensa: [110, 220] },
  { descripcion: 'Ganaste un sorteo en una tienda', recompensa: [125, 250] },
  { descripcion: 'Encontraste monedas antiguas en una casa vieja', recompensa: [135, 270] },
  { descripcion: 'Un inversionista notó tu talento y te financió', recompensa: [250, 500] },
  { descripcion: 'Descubriste que tenías acciones olvidadas', recompensa: [200, 450] },
  { descripcion: 'Ganaste un premio por ser buen ciudadano', recompensa: [145, 290] },
  { descripcion: 'Un conocido te regaló entradas para un evento VIP', recompensa: [155, 310] },
  { descripcion: 'Encontraste un tesoro escondido en el jardín', recompensa: [175, 350] },
  { descripcion: 'Tu video viralizó y monetizaste', recompensa: [220, 440] },
  { descripcion: 'Ganaste una beca inesperada', recompensa: [185, 370] },
  { descripcion: 'Un cliente satisfecho te dio una gratificación extra', recompensa: [165, 330] },
  { descripcion: 'Descubriste criptomonedas olvidadas', recompensa: [240, 480] },
  { descripcion: 'Ganaste un viaje pagado por un concurso', recompensa: [195, 390] },
  { descripcion: 'Encontraste diamantes en una mina abandonada', recompensa: [300, 500] },
  { descripcion: 'Un famoso te mencionó en sus redes', recompensa: [210, 420] },
  { descripcion: 'Herenciaste una colección de arte valiosa', recompensa: [280, 500] },
  { descripcion: 'Ganaste derechos de autor por una canción tuya', recompensa: [230, 460] },
  { descripcion: 'Un millonario te adoptó como ahijado', recompensa: [350, 500] },
  { descripcion: 'Descubriste petróleo en tus tierras', recompensa: [400, 500] },
  { descripcion: 'Ganaste el premio mayor de una rifa', recompensa: [250, 500] }
]

let handler = async (m, { conn, usedPrefix, command }) => {
  try {

    if (!m.isGroup) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Este comando solo puede ser usado en grupos.',
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }


    let user = global.db.data.users[m.sender]
    if (!user) {
      global.db.data.users[m.sender] = {
        coins: 100,
        exp: 0,
        level: 0,
        registered: true,
        name: m.name || m.pushName || 'Usuario'
      }
      user = global.db.data.users[m.sender]
    }

    if (!user.lastLuck) user.lastLuck = 0
    const timeSinceLastLuck = Date.now() - user.lastLuck

    if (timeSinceLastLuck < cooldownTime) {
      const minutes = Math.ceil((cooldownTime - timeSinceLastLuck) / 60000)
      return conn.sendMessage(m.chat, {
        text: `《✧》Debes esperar *${minutes} minuto${minutes !== 1 ? 's' : ''}* para probar suerte de nuevo.`,
        contextInfo: {
          ...rcanal.contextInfo
        }
      }, { quoted: m })
    }

    user.lastLuck = Date.now()

    // Seleccionar situación aleatoria
    const situacionSeleccionada = situacionesSuerte[Math.floor(Math.random() * situacionesSuerte.length)]

    // Calcular recompensa aleatoria
    const [min, max] = situacionSeleccionada.recompensa
    const recompensa = Math.floor(Math.random() * (max - min + 1)) + min
    user.coins += recompensa

    // Mensajes motivacionales
    const mensajesFelicitacion = [
      '¡Qué fortuna tienes!',
      '¡La suerte te sonríe!',
      '¡Eres un afortunado!',
      '¡Bendecido por la suerte!',
      '¡Increíble suerte!',
      '¡La fortuna te acompaña!',
      '¡Qué buena fortuna!',
      '¡Suerte extraordinaria!',
    ]

    const mensajeFelicitacion = mensajesFelicitacion[Math.floor(Math.random() * mensajesFelicitacion.length)]

    let txt = `╭─「 ✦  ꜱᴜᴇʀᴛᴇ ✦ 」─╮\n│\n`
    txt += `╰➺ ✧ Situación: ${situacionSeleccionada.descripcion}\n`
    txt += `╰➺ ✧ ¡Felicidades!\n`
    txt += `╰➺ ✧ Recompensa: +${recompensa} ${global.moneda}\n`
    txt += `╰➺ ✧ Total: ${user.coins} ${global.moneda}\n│\n`
    txt += `╰➺ ✧ ${mensajeFelicitacion}\n`
    txt += `╰➺ ✧  Próxima suerte: 10 min\n`
    txt += `\n> PAIN COMMUNITY`

    return conn.sendMessage(m.chat, {
      text: txt,
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })

  } catch (e) {
    console.error('Error en suerte:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error al probar suerte.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
  }
}

handler.help = ['suerte', 'luck', 'fortuna']
handler.tags = ['juegos', 'economía', 'rpg']
handler.command = ['suerte', 'luck', 'fortuna']

export default handler
