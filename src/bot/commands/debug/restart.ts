import { Message } from 'discord.js'
import { Command, CommandoMessage, CommandoClient } from 'discord.js-commando'

export default class RestartCommand extends Command {
  constructor (client: CommandoClient) {
    super(client, {
      name: 'restart',
      group: 'debug',
      memberName: 'restart',
      description: 'Restarts the bot.',
      guildOnly: false,
      throttling: {
        usages: 2,
        duration: 3
      },
      ownerOnly: true
    })
  }

  public async run (msg: CommandoMessage): Promise<Message | Message[]> {
    await msg.channel.send('Restarting...')

    return process.exit(1)
  }
}