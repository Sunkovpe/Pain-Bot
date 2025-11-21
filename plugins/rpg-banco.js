/**
 *  SISTEMA BANCARIO - PAIN BOT
 * 3 bancos con sistema de membresía y protección de fondos
 */

const bancos = {
  'konoha': {
    nombre: 'BANK KONOHA',
    emoji: 'K',
    descripcion: 'Banco tradicional con intereses moderados'
  },
  'akatsuki': {
    nombre: 'BANK AKATSUKI',
    emoji: 'A',
    descripcion: 'Banco misterioso con altos riesgos y recompensas'
  },
  'boys': {
    nombre: 'BANK BOYS',
    emoji: 'B',
    descripcion: 'Banco juvenil con servicios modernos'
  }
}

const costoCambioBanco = 350


global.bancos = bancos

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!m.isGroup) {
      return conn.sendMessage(m.chat, {
        text: '《✧》Este comando solo puede ser usado en grupos.',
        contextInfo: { ...rcanal.contextInfo }
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

    
    if (!user.banco) user.banco = null
    if (!user.bancoDinero) user.bancoDinero = 0

    
    switch (command) {
      case 'banco':
      case 'bank':
        return mostrarInfoBancoUsuario(user, conn, m)

      case 'deposit':
        return depositarDinero(user, args[0], conn, m, usedPrefix)

      case 'withdraw':
        return retirarDinero(user, args[0], conn, m, usedPrefix)

      case 'change':
        return cambiarBanco(user, args[0], conn, m, usedPrefix)

      case 'unirsebank':
        return unirseBanco(user, args[0], conn, m, usedPrefix)

      default:
        return mostrarInfoBancoUsuario(user, conn, m)
    }

  } catch (e) {
    console.error('Error en banco:', e)
    return conn.sendMessage(m.chat, {
      text: '《✧》Ocurrió un error en el sistema bancario.',
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }
}

function mostrarInfoBancoUsuario(user, conn, m) {
  if (!user.banco) {
    return conn.sendMessage(m.chat, {
      text: `╭─「 ✦ BANCO ✦ 」─╮\n│\n╰➺ ✧ No perteneces a ningun banco\n╰➺ ✧ Usa .unirsebank <banco>\n│\n╰➺ ✧ Bancos: konoha, akatsuki, boys\n\n> PAIN COMMUNITY`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  const banco = bancos[user.banco]
  const totalDinero = user.coins + user.bancoDinero

  let txt = `╭─「 ✦ ${banco.nombre} ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ Banco: ${banco.nombre}\n`
  txt += `╰➺ ✧ Dinero disponible: ${user.coins} ${global.moneda}\n`
  txt += `╰➺ ✧ Dinero en banco: ${user.bancoDinero} ${global.moneda}\n`
  txt += `╰➺ ✧ Total: ${totalDinero} ${global.moneda}\n│\n`
  txt += `╰➺ ✧ Comandos:\n`
  txt += `╰➺ ✧ .deposit <cantidad/all> - Depositar\n`
  txt += `╰➺ ✧ .withdraw <cantidad/all> - Retirar\n`
  txt += `╰➺ ✧ .change <banco> - Cambiar banco\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function unirseBanco(user, bancoElegido, conn, m, usedPrefix) {
  if (user.banco) {
    return conn.sendMessage(m.chat, {
      text: `Ya perteneces a ${bancos[user.banco].nombre}.\nUsa .change <banco> para cambiar.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (!bancoElegido || !bancos[bancoElegido]) {
    return conn.sendMessage(m.chat, {
      text: `Banco no valido. Elige: konoha, akatsuki, o boys`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  user.banco = bancoElegido
  const banco = bancos[bancoElegido]

  let txt = `╭─「 ✦ UNION AL BANCO ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ Bienvenido a ${banco.nombre}\n`
  txt += `╰➺ ✧ Descripcion: ${banco.descripcion}\n│\n`
  txt += `╰➺ ✧ Membresia activada\n`
  txt += `╰➺ ✧ Dinero en banco: ${user.bancoDinero} ${global.moneda}\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function cambiarBanco(user, bancoElegido, conn, m, usedPrefix) {
  if (!user.banco) {
    return conn.sendMessage(m.chat, {
      text: `No perteneces a ningun banco.\nUsa .unirsebank <banco> para unirte.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (!bancoElegido || !bancos[bancoElegido]) {
    return conn.sendMessage(m.chat, {
      text: `Banco no valido. Elige: konoha, akatsuki, o boys`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (user.banco === bancoElegido) {
    return conn.sendMessage(m.chat, {
      text: `Ya perteneces a ${bancos[user.banco].nombre}.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (user.coins < costoCambioBanco) {
    return conn.sendMessage(m.chat, {
      text: `Cambio de banco cuesta ${costoCambioBanco} ${global.moneda}.\nTienes: ${user.coins} ${global.moneda}`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  const bancoAnterior = bancos[user.banco]
  user.coins -= costoCambioBanco
  user.banco = bancoElegido
  const bancoNuevo = bancos[bancoElegido]

  let txt = `╭─「 ✦ CAMBIO DE BANCO ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ De: ${bancoAnterior.nombre}\n`
  txt += `╰➺ ✧ A: ${bancoNuevo.nombre}\n│\n`
  txt += `╰➺ ✧ Costo: -${costoCambioBanco} ${global.moneda}\n`
  txt += `╰➺ ✧ Total: ${user.coins} ${global.moneda}\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function depositarDinero(user, cantidad, conn, m, usedPrefix) {
  if (!user.banco) {
    return conn.sendMessage(m.chat, {
      text: `No perteneces a ningun banco.\nUsa .unirsebank <banco> para unirte.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  let monto = 0

  if (cantidad === 'all' || cantidad === 'todo') {
    
    if (user.coins === 0) {
      return conn.sendMessage(m.chat, {
        text: `Tu dinero ya esta completamente en el banco.\nDinero en banco: ${user.bancoDinero} ${global.moneda}\nUsa .withdraw <cantidad> para retirar.`,
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }
    monto = user.coins
  } else {
    monto = parseInt(cantidad)
  }

  if (!monto || isNaN(monto) || monto <= 0) {
    return conn.sendMessage(m.chat, {
      text: `Cantidad invalida. Usa: .deposit <cantidad> o .deposit all`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (user.coins < monto) {
    return conn.sendMessage(m.chat, {
      text: `No tienes suficientes ${global.moneda}.\nTienes: ${user.coins} ${global.moneda}`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  user.coins -= monto
  user.bancoDinero += monto
  const banco = bancos[user.banco]

  let txt = `╭─「 ✦ DEPOSITO ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ ${banco.nombre}\n│\n`
  txt += `╰➺ ✧ Depositado: ${monto} ${global.moneda}\n`
  txt += `╰➺ ✧ En banco: ${user.bancoDinero} ${global.moneda}\n`
  txt += `╰➺ ✧ Disponible: ${user.coins} ${global.moneda}\n│\n`
  txt += `╰➺ ✧ Dinero protegido del robo\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function retirarDinero(user, cantidad, conn, m, usedPrefix) {
  if (!user.banco) {
    return conn.sendMessage(m.chat, {
      text: `No perteneces a ningun banco.\nUsa .unirsebank <banco> para unirte.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  let monto = 0

  if (cantidad === 'all' || cantidad === 'todo') {
    
    if (user.bancoDinero === 0) {
      return conn.sendMessage(m.chat, {
        text: `No tienes dinero en el banco.\nDinero disponible: ${user.coins} ${global.moneda}\nUsa .deposit <cantidad> para guardar dinero.`,
        contextInfo: { ...rcanal.contextInfo }
      }, { quoted: m })
    }
    monto = user.bancoDinero
  } else {
    monto = parseInt(cantidad)
  }

  if (!monto || isNaN(monto) || monto <= 0) {
    return conn.sendMessage(m.chat, {
      text: `Cantidad invalida. Usa: .withdraw <cantidad> o .withdraw all`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  if (user.bancoDinero < monto) {
    return conn.sendMessage(m.chat, {
      text: `No tienes suficientes ${global.moneda} en el banco.\nEn banco: ${user.bancoDinero} ${global.moneda}`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  user.coins += monto
  user.bancoDinero -= monto
  const banco = bancos[user.banco]

  let txt = `╭─「 ✦ RETIRO ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ ${banco.nombre}\n│\n`
  txt += `╰➺ ✧ Retirado: ${monto} ${global.moneda}\n`
  txt += `╰➺ ✧ En banco: ${user.bancoDinero} ${global.moneda}\n`
  txt += `╰➺ ✧ Disponible: ${user.coins} ${global.moneda}\n│\n`
  txt += `╰➺ ✧ Dinero vulnerable al robo\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function verSaldoBanco(user, conn, m) {
  if (!user.banco) {
    return conn.sendMessage(m.chat, {
      text: `《✧》No perteneces a ningún banco.\nUsa *${usedPrefix}banco unirse <banco>* para unirte.`,
      contextInfo: { ...rcanal.contextInfo }
    }, { quoted: m })
  }

  const banco = bancos[user.banco]
  const totalDinero = user.coins + user.bancoDinero

  let txt = `╭─「 ✦  ꜱᴀʟᴅᴏ ʙᴀɴᴄᴀʀɪᴏ ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ ${banco.emoji} ${banco.nombre}\n│\n`
  txt += `╰➺ ✧  Dinero disponible: ${user.coins} ${global.moneda}\n`
  txt += `╰➺ ✧  Dinero en banco: ${user.bancoDinero} ${global.moneda}\n`
  txt += `╰➺ ✧  Total: ${totalDinero} ${global.moneda}\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

function mostrarInfoBanco(user, conn, m) {
  let txt = `╭─「 ✦ INFORMACION BANCARIA ✦ 」─╮\n│\n`
  txt += `╰➺ ✧ K - BANK KONOHA (tradicional)\n│\n`
  txt += `╰➺ ✧ A - BANK AKATSUKI (misterioso)\n│\n`
  txt += `╰➺ ✧ B - BANK BOYS (juvenil)\n│\n`
  txt += `╰➺ ✧ Cambio de banco: ${costoCambioBanco} ${global.moneda}\n`
  txt += `╰➺ ✧ Proteccion: Dinero en banco esta seguro\n`
  txt += `╰➺ ✧ Riesgo: Dinero fuera puede ser robado\n\n> PAIN COMMUNITY`

  return conn.sendMessage(m.chat, {
    text: txt,
    contextInfo: { ...rcanal.contextInfo }
  }, { quoted: m })
}

handler.help = ['banco', 'bank']
handler.tags = ['juegos', 'economía', 'rpg']
handler.command = ['banco', 'bank', 'deposit', 'withdraw', 'change', 'unirsebank']

export default handler
