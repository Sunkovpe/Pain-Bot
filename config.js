import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51901437507', 'Sunkovv', true],
  ['584125888002', 'Gxbo(Mod)', true],
  ['5219991034993', 'Kevin(Mod)', true],
]


global.ownerLid = [
  ['114263544885392', 'Sunkovv', true],
  ['58540639154396', 'Kevin', true],
  ['270613105139841', 'Gxbo', true],


]

global.sessions = 'Sessions'
global.bot = 'Serbot' 
global.AFBots = true

global.packname = '𓆩 𝗣𝗔𝗜𝗡 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬 𓆪'
global.namebot = 'PAIN BOT'
global.author = 'Sunkovv'


global.canal = 'https://whatsapp.com/channel/0029Vb5Vinf72WTo11c5hJ3O'

global.ch = {
ch1: '120363403162100537@newsletter',
}

global.mods =   []
global.prems = []

global.multiplier = 69 
global.maxwarn = '2'

global.APIs = {
vreden: { url: "https://api.vreden.web.id", key: null },
delirius: { url: "https://api.delirius.store", key: null },
zenzxz: { url: "https://api.zenzxz.my.id", key: null },
siputzx: { url: "https://api.siputzx.my.id", key: null }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
