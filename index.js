require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const jsonfile = require('jsonfile')

const messages = {
    setupHelp: `Sāc ar inkvizīcijas kanāla piešķiršanu, %inqChannel #<kanāls>
Pēc tam pastāsti man kādu role jādod inkvizīcijas dalībniekam lai tikai viņš spētu atbildēt uz apsūdzībām ar %inqRole @<role>`,
    fullHelp: `Inkvizīcija gatava, sāc rakstīt jautājumus ar %ask <jautājums>,
nosauc nākamo inkvizējamo ar %target @<user>,
un sāc inkvizīciju ar %start
pārtrauc inkvizīciju ar %stop
nodzēs jautājumu rindu ar %clear
nodzēs pēdējo pievienoto jautājumu ar %pop
apskaties jautājumu rindu ar %queue <maximālais skaits>`,

};

const TOKEN = process.env.TOKEN;

const guilds = {};

client.login(TOKEN);

const findUser = (gld, userid) => {
    return gld.guild.member(userid);
}

const findRole = (gld, roleid) => {
    return gld.guild.roles.fetch(roleid);
}

const findChannel = (gld, channelid) => {
    return gld.guild.channels.resolve(channelid);
}

const loadGuild = (gld) => {
    jsonfile.readFile(gld.id+'.json').then((obj) => {
        guilds[gld.id] = obj;
        guilds[gld.id].guild = gld;
    })
}

const saveGuild = (gld) => {
    jsonfile.writeFile(gld.guild.id+'.json', {
        status: gld.status,
        inquisition_channel: gld.inquisition_channel,
        inquisition_role: gld.inquisition_role,
        inquisition_target: gld.inquisition_target,
        messages: gld.messages,
    }, {flag: 'w'}).catch(reason => console.log(reason));
}

client.on('ready', () => {
    console.log('I am ready!');
    if (client.guilds){
        client.guilds.cache.each((gld) => loadGuild(gld));
    }
});

client.on('guildCreate', (gld) => {
    console.log('added to a new guild');
    guilds[gld.id] = {guild: gld, status: 'no-channel', messages: {}};
    jsonfile.writeFile(gld.id+'.json', {status: 'setup'});
});

client.on('message', (message) => {
    if (!message.guild) message.reply('Neslīdi man dm-os 😉');

    console.log(message.content);

    const gld = guilds[message.guild.id];

    if (gld.status === 'setup' && message.member.hasPermission('ADMINISTRATOR')){
        if (message.content.startsWith('%help')){
            message.channel.send(messages.setupHelp);
        } else if (message.content.startsWith('%inqChannel')){
            console.log('added inquisition channel');
            gld.inquisition_channel = message.mentions.channels.first(1)[0].id;
            message.channel.send(`Inkvizīcijas kanāls uzstādīts ${message.mentions.channels.first(1)[0]}`);
            if (gld.inquisition_channel && gld.inquisition_role){
                gld.status = 'ready';
                saveGuild(gld);
                message.channel.send('Inkvizīcija gatava, sāc rakstīt jautājumus ar %ask <jautājums>, nosauc nākamo inkvizējamo ar %target @<user>, un sāc inkvizīciju ar %start (pilnās insturkcijas ar %help)');
            }
        } else if (message.content.startsWith('%inqRole')){
            console.log('added inqusition role');
            gld.inquisition_role = message.mentions.roles.first(1)[0].id;
            message.channel.send(`Inkvizīcijas role uzstādīta ${message.mentions.roles.first(1)[0]}`);
            //console.log(guilds[message.guild.id])
            if (gld.inquisition_channel && gld.inquisition_role){
                console.log('ready');
                gld.status = 'ready';
                saveGuild(gld);
                message.channel.send('Inkvizīcija gatava, sāc rakstīt jautājumus ar %ask <jautājums>, nosauc nākamo inkvizējamo ar %target @<user>, un sāc inkvizīciju ar %start (pilnās insturkcijas ar %help)');
            }
        }
    }

    
    if ((gld.status === 'ready'||gld.status === 'in-progress') && message.member.hasPermission('ADMINISTRATOR')){
        if (message.content.startsWith('%help')){
            message.channel.send(messages.fullHelp);
        } else if (message.content.startsWith('%ask')){
            gld.messages.push(message.content.slice(5));
            saveGuild(gld);
        } else if (message.content.startsWith('%target')){
            gld.inquisition_target = message.mentions.members.first(1)[0].id;
            saveGuild(gld);
            message.channel.send(`Jauns inkvizīcijas mērķis ${message.mentions.members.first(1)[0]}`);
        } else if (message.content.startsWith('%start')){
            const user = findUser(gld, gld.inquisition_target);
            user.roles.add(gld.inquisition_role, 'Sākam inkvizīciju');
            findChannel(gld, gld.inquisition_channel).send(`**Lai inkvizīcija sākas ${user}!** Nākamo jautājumu iegūstam ar "**Next!**", kad vairs inkvizīciju nevari pavilkt "**Enough!**"`);
            findChannel(gld, gld.inquisition_channel).send(`Pirmais jautājums: **${gld.messages[0]}**`);
            message.channel.send('Inkvizīcija sākta! Jautājumu skaits: '+gld.messages.length);
            gld.messages.shift();
            if (gld.messages.length>0) {
                gld.status = 'in-progress';
            }else{
                findChannel(gld, gld.inquisition_channel).send(`Diemžēl tas bija arī vienīgais jautājums :/`);
            }
            saveGuild(gld);
        }
    }
    if (gld.status === 'in-progress' && message.channel.id === gld.inquisition_channel){
        if (message.content.startsWith('Next!')){
            if (!gld.messages.length>0){
                findChannel(gld, gld.inquisition_channel).send(`**Inkvizīcija izturēta! ✅**`);
                gld.status = 'ready';
                findUser(gld, gld.inquisition_target).roles.remove(gld.inquisition_role, 'Beidzam inkvizīciju');
            }
            if (gld.messages.length==1){
                findChannel(gld, gld.inquisition_channel).send(`Pēdējais jautājums: **${gld.messages[0]}**`);
            } else if (gld.messages.length>0) {
                findChannel(gld, gld.inquisition_channel).send(`**${gld.messages[0]}**`);
            }
            gld.messages.shift();
            saveGuild(gld);
        } else if (message.content.startsWith('Enough!')){
            findChannel(gld, gld.inquisition_channel).send(`**Inkvizīcija neizturēta! ❎**`);
            gld.messages = [];
            gld.status = 'ready';
            findUser(gld, gld.inquisition_target).roles.remove(gld.inquisition_role, 'Beidzam inkvizīciju');
            saveGuild(gld);
        }
    }
})