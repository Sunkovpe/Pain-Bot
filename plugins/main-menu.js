import fs from 'fs'
import { join } from 'path'

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor((ms % 3600000) / 60000)
  let s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    let nombreBot = global.namebot || 'PAIN BOT'
    let imgBot = 'https://files.catbox.moe/iomah1.jpg'
    let mainImg = './storage/img/menu3.jpg'
    const botActual = conn.user?.jid?.split('@')[0]?.replace(/\D/g, '')
    const tipo = botActual === '+5218442600752'.replace(/\D/g, '') ? 'Principal Bot' : 'Sub Bot'
    
    
    if (tipo === 'Sub Bot') {
      const configGlobalPath = join('./Serbot', botActual, 'config.json')
      if (fs.existsSync(configGlobalPath)) {
        const globalConfig = JSON.parse(fs.readFileSync(configGlobalPath, 'utf8'))
        if (globalConfig.img) {
          mainImg = globalConfig.img
        }
        if (globalConfig.name) {
          nombreBot = globalConfig.name
        }
      }
    }
    
   
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
          const user = participants.find(u => conn.decodeJid(u.id) === m.sender) || {}
          isRAdmin = user?.admin == 'superadmin' || false
          isAdmin = isRAdmin || user?.admin == 'admin' || false
          
         
          isGroupCreator = groupMetadata.owner === m.sender || 
                          groupMetadata.subjectOwner === m.sender ||
                          user?.admin === 'superadmin'
        }
      } catch (error) {
        console.error('Error obteniendo metadata del grupo:', error)
      }
    }

  
    let userRole = '👤 Miembro'
    
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
      userRole = '👑 Creador del Grupo'
    } else if (isRAdmin || isAdmin) {
      userRole = '𖢠 Admin del Grupo'
    }
    
    let botUptime = 0
    if (conn.startTime) {
      botUptime = Date.now() - conn.startTime
    }
    let botFormatUptime = clockString(botUptime)
    
   
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length
    
    
    const memoryUsage = process.memoryUsage()
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024)

    const text = `
╭─「 ✦ 𓆩🪐𓆪 ʙɪᴇɴᴠᴇɴɪᴅᴏ ✦ 」─╮
╰➺ ඞ *Usuario:* @${m.sender.split('@')[0]}
╰➺ ✪ *Rol:* ${userRole}
╰➺ ߷ *Bot:* ${nombreBot}
╰➺ ≛ *Tipo:* ${tipo}
╰➺ ❖ *Librería:* Baileys MD
╰➺ ☉ *Tiempo Activo:* ${botFormatUptime}
╰➺ ✥ *Plugins:* ${totalf}
╰➺ ❐ *Memoria:* ${memoryMB} MB

╭─「 ✦ 𓆩👑𓆪 ᴘʀᴏᴘɪᴇᴛᴀʀɪᴏs ✦ 」─╮
╰➺ ඩා +51901437507 ➺ 𝐒𝐮𝐧𝐤𝐨𝐯𝐯

╭─「 ✦ 𓆩💎𓆪 ᴄᴀɴᴀʟᴇs ᴏғɪᴄɪᴀʟᴇs ✦ 」─╮
╰➺ 〘 https://whatsapp.com/channel/0029Vb5Vinf72WTo11c5hJ3O 〙

╭─「 ✦ 𓆩🐦‍🔥𓆪 ᴄᴏᴍᴀɴᴅᴏs ᴅɪsᴘᴏɴɪʙʟᴇs ✦ 」─╮
│
╰➺ ✧ *\`𝗢𝗪𝗡𝗘𝗥𝗦\`* 𖤓
│   • ${usedPrefix}verplugin <nombre.js>
│   • ${usedPrefix}replugin <nombre.js>
│   • ${usedPrefix}addplugin <nombre.js>
│   • ${usedPrefix}nameplugins <archivo.js> > <nuevo.js>
│   • ${usedPrefix}update
│   • ${usedPrefix}restart
│   • ${usedPrefix}subme <mensaje>
│
╰➺ ✧ *\`𝗖𝗠𝗗 𝗦𝗨𝗕 𝗕𝗢𝗧\`* 𖤓
│   • ${usedPrefix}qr
│   • ${usedPrefix}code
│   • ${usedPrefix}bots
│   • ${usedPrefix}botinfo
│   • ${usedPrefix}reconnect
│   • ${usedPrefix}setbotname
│   • ${usedPrefix}setbotimg
│   • ${usedPrefix}setautoread
│
╰➺ ✧ *\`𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔 𝗥𝗣𝗚\`* 𖤓
│   • ${usedPrefix}balance
│   • ${usedPrefix}bal
│   • ${usedPrefix}coins
│   • ${usedPrefix}transf @usuario <cantidad>
│
╰➺ ✧ *\`𝗣𝗘𝗥𝗙𝗜𝗟 𝗥𝗣𝗚\`* 𖤓
│   • ${usedPrefix}perfil
│   • ${usedPrefix}setbirth <fecha>
│   • ${usedPrefix}setdesc <descripción>
│   • ${usedPrefix}setfav <personaje>
│   • ${usedPrefix}setgenre <hombre/mujer>
│   • ${usedPrefix}birthdays
│   • ${usedPrefix}setname <nombre>
│
╰➺ ✧ *\`𝗧𝗢𝗣 𝗥𝗣𝗚\`* 𖤓
│   • ${usedPrefix}topcoins
│
╰➺ ✧ *\`𝗚𝗔𝗠𝗘 𝗥𝗣𝗚\`* 𖤓
│   • ${usedPrefix}dado
│   • ${usedPrefix}daily / day
│
╰➺ ✧ *\`𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔𝗦\`* 𖤓
│   • ${usedPrefix}google <búsqueda>
│   • ${usedPrefix}yt <búsqueda>
│   • ${usedPrefix}tiktok <búsqueda>
│   • ${usedPrefix}tiktok2 <búsqueda>
│   • ${usedPrefix}onlyfans <username>
│   • ${usedPrefix}imagen <busqueda>
│   • ${usedPrefix}pinterest <busqueda> 
│
╰➺ ✧ *\`𝗜𝗡𝗧𝗘𝗟𝗜𝗚𝗘𝗡𝗖𝗜𝗔 𝗔.\`* 𖤓
│   • ${usedPrefix}gemini <texto>
│   • ${usedPrefix}deepseek <texto>
│   • ${usedPrefix}llama <texto>
│   • ${usedPrefix}exaone <texto>
│
╰➺ ✧ *\`𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦\`* 𖤓
│   • ${usedPrefix}play <búsqueda/url>
│   • ${usedPrefix}play2 <búsqueda>
│   • ${usedPrefix}ytvideo <búsqueda>
│   • ${usedPrefix}aptoide <app>
│   • ${usedPrefix}git <url>
│   • ${usedPrefix}tiktok2 <link>
│
╰➺ ✧ *\`𝗔𝗗𝗜𝗖𝗜𝗢𝗡𝗔𝗟𝗘𝗦\`* 𖤓
│   • ${usedPrefix}nota <contenido>
│   • ${usedPrefix}delnota <numero>
│   • ${usedPrefix}vernotas
│   • ${usedPrefix}id 
│
╰➺ ✧ *\`𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦\`* 𖤓
│   • ${usedPrefix}sticker
│   • ${usedPrefix}toimg
│   • ${usedPrefix}setmeta <autor> | <pack>
│   • ${usedPrefix}delmeta
│
╰➺ ✧ *\`𝗔𝗗𝗠𝗜𝗡𝗦\`* 𖤓
│   • ${usedPrefix}ban @usuario
│   • ${usedPrefix}promote @usuario
│   • ${usedPrefix}demote @usuario
│   • ${usedPrefix}warn @usuario <motivo>
│   • ${usedPrefix}delwarn @usuario
│   • ${usedPrefix}warnings @usuario
│   • ${usedPrefix}tag
│   • ${usedPrefix}open
│   • ${usedPrefix}close
│   • ${usedPrefix}delete
│   • ${usedPrefix}namegp <nombre>
│   • ${usedPrefix}desgp <descripción>
│   • ${usedPrefix}photogp
│   • ${usedPrefix}adg <numero>
│   • ${usedPrefix}grupo on/off
│   • ${usedPrefix}antilink on/off
│   • ${usedPrefix}antiimg on/off
│   • ${usedPrefix}antiaudio on/off
│   • ${usedPrefix}antivideo on/off
│   • ${usedPrefix}antisticker on/off
│   • ${usedPrefix}antispam on/off
│   • ${usedPrefix}anticontact on/off
│   • ${usedPrefix}antimention on/off
│   • ${usedPrefix}antidocument on/off
│   • ${usedPrefix}anticaracter on/off <limite>
│   • ${usedPrefix}soloadmin on/off
│   • ${usedPrefix}welcome on/off
│   • ${usedPrefix}savep
│   • ${usedPrefix}publicg on/off
│   • ${usedPrefix}publicg time <tiempo>
│   • ${usedPrefix}modoia on/off
│   • ${usedPrefix}modohot on/off
│   • ${usedPrefix}modoilegal on/off
│
╰➺ ✧ *\`𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡\`* 𖤓
│   • ${usedPrefix}topgays
│   • ${usedPrefix}topfeos
│   • ${usedPrefix}toplindos
│   • ${usedPrefix}topburros
│   • ${usedPrefix}topmachos
│   • ${usedPrefix}topparejas
│   • ${usedPrefix}toppajeros
│   • ${usedPrefix}topmancos
│   • ${usedPrefix}topinfieles
│
╰➺ ✧ *\`𝗡𝗦𝗙𝗪\`* 𖤓
│   • ${usedPrefix}waifu
│   • ${usedPrefix}waifu2
│   • ${usedPrefix}neko
│   • ${usedPrefix}xnxx <url>
│   • ${usedPrefix}xnxx <búsqueda>
│   • ${usedPrefix}hentai <url>
│   • ${usedPrefix}hentai <búsqueda>
│   • ${usedPrefix}xvideos <url>
│   • ${usedPrefix}xvideos <búsqueda>
╰─

> PAIN COMMUNITY`.trim()

    
    const externalAdReply = {
      title: `✦ ${nombreBot} | WhatsApp Bot\n`,
      body: `𝗖𝗼𝗺𝗮𝗻𝗱𝗼𝘀 𝗱𝗲 ${nombreBot} By @Sunkovv`,
      thumbnailUrl: imgBot,
      mediaType: 1,
      showAdAttribution: true,
      renderLargerThumbnail: true
    }

    await conn.sendFile(m.chat, mainImg, 'thumbnail.jpg', text, m, null, { 
      contextInfo: {
        ...rcanal.contextInfo,
        mentionedJid: [m.sender],
        externalAdReply: externalAdReply
      }
    })

  } catch (e) {
    console.error('Error en menú:', e)
    conn.sendMessage(m.chat, {
      text: '❎ Hubo un error al mostrar el menú.',
      contextInfo: {
        ...rcanal.contextInfo
      }
    }, { quoted: m })
    throw e
  }
}

handler.command = ['menu', 'help', 'menú']
export default handler