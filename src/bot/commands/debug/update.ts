import { Message } from 'discord.js'
import { CommandoMessage, CommandoClient } from 'discord.js-commando'
import * as simplegit from 'simple-git/promise'
import { Command } from '../../base'
import * as path from 'path'
import { Config } from '../../../common'
const config: Config = require('../../../../config/config.json')

export default class UpdateCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'update',
      group: 'debug',
      memberName: 'update',
      description: 'Updates the bot if a new update exists.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    const git = simplegit()

    await git.checkout('.')

    const result = await git.pull()

    try {
      try {
        const premiumPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'bot', 'plugins', 'plugin-premium')
        await git.cwd(premiumPath)
        await git.pull()
      } catch {
        if (config.optional && config.optional.premium && config.optional.premium.premiumPluginRepo) {
          const repo = config.optional.premium.premiumPluginRepo

          await git.cwd(path.resolve(__dirname, '..', '..', '..', '..', 'src', 'bot', 'plugins'))
          await git.clone(repo, 'plugin-premium')
        }
      }
    } catch (err) {
      // ¯\_(ツ)_/¯
    }

    if (!result || result.summary.changes === 0) {
      return msg.reply('I am already up to date.')
    }

    await msg.channel.send('I have evolved! I will restart now.')

    return process.exit(0)
  }
}
