import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, command }) => {
  const user = m.sender
  const data = global.db.data.users[user]

  
  if (!data || !data.registered) {
    
    if (!global.db.data.users[user]) {
      global.db.data.users[user] = {
        registered: true,
        name: m.name || m.pushName || 'Usuario',
        regTime: Date.now(),
        age: -1,
        level: 0,
        coins: 0,
        exp: 0,
        genre: 'No establecido',
        birth: 'No registrado',
        desc: 'Sin descripción',
        favourite: 'No establecido',
        partner: '',
        banned: false,
        prem: false
      }
      console.log(`✅ Usuario registrado automáticamente desde perfil: ${user}`)
    }
  }

  
  const userData = global.db.data.users[user]



  const createOwnerIds = (number) => {
    const cleanNumber = number.replace(/[^0-9]/g, '')
    return [
      cleanNumber + '@s.whatsapp.net',
      cleanNumber + '@lid'
    ]
  }

  const allOwnerIds = [
    conn.decodeJid(conn.user.id),
    ...global.owner.flatMap(([number]) => createOwnerIds(number)),
    ...(global.ownerLid || []).flatMap(([number]) => createOwnerIds(number))
  ]

  const isROwner = allOwnerIds.includes(m.sender)
  const isOwner = isROwner || m.fromMe
  const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  const _user = global.db.data?.users?.[m.sender]
  const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.prem == true

  let isRAdmin = false
  let isAdmin = false
  let isGroupCreator = false
  if (m.isGroup) {
    try {
      const groupMetadata = conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(_ => null)
      if (groupMetadata) {
        const participants = groupMetadata.participants || []
        const userData = participants.find(u => conn.decodeJid(u.id) === m.sender) || {}
        isRAdmin = userData?.admin == 'superadmin' || false
        isAdmin = isRAdmin || userData?.admin == 'admin' || false
        isGroupCreator = groupMetadata.owner === m.sender || 
                        groupMetadata.subjectOwner === m.sender ||
                        userData?.admin === 'superadmin'
      }
    } catch (error) {
      console.error('Error obteniendo metadata del grupo:', error)
    }
  }

  let userRole = 'Miembro'
  if (isROwner || isOwner) {
    if (isGroupCreator) {
      userRole = '👑 Creador del Bot y Grupo'
    } else if (isRAdmin || isAdmin) {
      userRole = '👑 Creador del Bot y Admin'
    } else {
      userRole = '👑 Creador del Bot'
    }
  } else if (isMods) {
    if (isGroupCreator) {
      userRole = 'Moderador del Bot y Creador'
    } else if (isRAdmin || isAdmin) {
      userRole = 'Moderador del Bot y Admin'
    } else {
      userRole = 'Moderador del Bot'
    }
  } else if (isGroupCreator) {
    userRole = 'Creador del Grupo'
  } else if (isRAdmin || isAdmin) {
    userRole = 'Admin del Grupo'
  }

  const texto = `

𓂃 ࣪ ִֶָ☾. 𝙿𝙴𝚁𝙵𝙸𝙻 𝙳𝙴 𝚄𝚂𝚄𝙰𝚁𝙸𝙾 𓂃 ࣪ ִֶָ☾.


╭─╮  𓍯  𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝙲𝙸𝙾𝙽 𝙿𝙴𝚁𝚂𝙾𝙽𝙰𝙻  𓍯  
│  𓂃 ࣪ ִֶָ☾.  𝙽𝙾𝙼𝙱𝚁𝙴:  ${userData.name || 'No establecido'}
│  𓂃 ࣪ ִֶָ☾.  𝙶𝙴𝙽𝙴𝚁𝙾:  ${userData.genre || 'No establecido'}
│  𓂃 ࣪ ִֶָ☾.  𝙲𝚄𝙼𝙿𝙻𝙴𝙰𝙽𝙾𝚂:  ${userData.birth || 'No registrado'}
│  𓂃 ࣪ ִֶָ☾.  𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝙲𝙸𝙾𝙽:  ${userData.desc || 'Sin descripción'}
│  𓂃 ࣪ ִֶָ☾.  𝙵𝙰𝚅𝙾𝚁𝙸𝚃𝙾:  ${userData.favourite || 'No establecido'}
╰─╯

╭─╮  𓍯  𝙴𝚂𝚃𝙰𝙳𝙸𝚂𝚃𝙸𝙲𝙰𝚂  𓍯  
│  𓂃 ࣪ ִֶָ☾.  𝙽𝙸𝚅𝙴𝙻:  ${userData.level || 0}
│  𓂃 ࣪ ִֶָ☾.  𝙲𝙾𝙸𝙽𝚂:  ${userData.coins || 0} ${global.moneda}
│  𓂃 ࣪ ִֶָ☾.  𝙴𝚇𝙿𝙴𝚁𝙸𝙴𝙽𝙲𝙸𝙰:  ${userData.exp || 0}
╰─╯

╭─╮  𓍯  𝙸𝙽𝙵𝙾 𝙶𝙴𝙽𝙴𝚁𝙰𝙻  𓍯  
│  𓂃 ࣪ ִֶָ☾.  𝙸𝙳:  ${user}
│  𓂃 ࣪ ִֶָ☾.  𝚁𝙾𝙻:  ${userRole}
│  𓂃 ࣪ ִֶָ☾.  𝚁𝙴𝙶𝙸𝚂𝚃𝚁𝙰𝙳𝙾:  ${userData.registered ? 'Sí' : 'No'}
╰─╯

> PAIN COMMUNITY`.trim()

  const botNumber = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
  const configPath = join('./Serbot', botNumber, 'config.json')

  let imgBot = './storage/img/menu3.jpg'
  let hasUserPP = false

  try {
    const pp = await conn.profilePictureUrl(user, 'image')
    if (pp) {
      imgBot = pp
      hasUserPP = true
    }
  } catch (e) {
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        if (config.img) imgBot = config.img
      } catch {}
    }
  }

  if (hasUserPP) {
    await conn.sendMessage(m.chat, {
      image: { url: imgBot },
      caption: texto,
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [userData.partner || user]
      }
    }, { quoted: m })
  } else {
    await conn.sendFile(m.chat, imgBot, 'profile.jpg', texto, m, null, rcanal, { mentions: [userData.partner || user] })
  }
}

handler.help = ['#profile • #perfil\n→ Revisa tu perfil completo con estadísticas y logros']
handler.tags = ['perfiles']
handler.command = ['profile', 'perfil']
export default handler