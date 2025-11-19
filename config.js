import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51901437507', 'Sunkovv', true],
  ['5218448582376', 'Fernando', true],
]


global.ownerLid = [
  ['114263544885392', 'Sunkovv', true],
  ['275878953148477', 'Fernando', true],
]

global.sessions = 'Sessions'
global.bot = 'Serbot' 
global.AFBots = true

global.packname = '𓆩 𝗣𝗔𝗜𝗡 𝗖𝗢𝗠𝗠𝗨𝗡𝗜𝗧𝗬 𓆪'
global.namebot = 'PAIN BOT'
global.author = 'Sunkovv'
global.moneda = 'USD'


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
