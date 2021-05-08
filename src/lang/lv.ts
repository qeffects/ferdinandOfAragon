export default {
  translation: {
    BOT_CONFIG_NOT_FOUND:
      'Super duper mega kļūda, lūdzu sazinies ar bot uzturētāju',
    COMMAND_CHANNEL_ONLY: 'So komandu var izpildit tikai kanalos!',
    COMMAND_NOT_ALLOWED: 'Tev nav atlauts izpildits so komandu!',
    COMMAND_MISSING_ARGS: 'Tu nenoradiji nepieciesamos argumentus, {{author}}',
    COMMAND_USAGE: '\nKomandu pareizi izmanto: `{{command}} {{usage}}`',
    COMMAND_COOLDOWN:
      'ludzu uzgaidi {{seconds}} sekundi(es) pirms izsauc {{command}} komandu',
    COMMAND_UNKNOWN_ERROR: 'Radās kļūda izpildot komandu, lūdzu mēģini vēlreiz',
    INQUISITION_ADD_QUESTION_DESCRIPTION: 'Pievieno jaunu jautājumu',
    INQUISITION_ADD_QUESTION_NO_QUESTION:
      'Neizdevās pievienot jautājumu, lūdzu mēģini vēlreiz',
    INQUISITION_ADD_QUESTION_SUCCESS:
      'Jautājums pievienots, rindā kopā ir: {{questionCount}}!',
    INQUISITION_SET_CHANNEL_DESCRIPTION:
      'Inkvizīcjas jautājumu kanāla uzstādīšana',
    INQUISITION_SET_CHANNEL_NO_CHANNEL:
      'Inkvizīcjas jautājumu kanālu neizdevās uzstādīt, lūdzu mēģini vēlreiz',
    INQUISITION_SET_CHANNEL_SUCCESS:
      'Inkvizīcijas kanāls uzstādīts {{channel}}',
    INQUISITION_READY:
      'Inkvizīcija gatava, sāc rakstīt jautājumus ar {{prefix}}ask <jautājums>, nosauc nākamo inkvizējamo ar {{prefix}}target @<user>, un sāc inkvizīciju ar {{prefix}}start (apskati pilnās insturkcijas ar {{prefix}}help)',
    INQUISITION_SET_ROLE_DESCRIPTION: 'Uztādi inkvizīcijas roli',
    INQUISITION_SET_ROLE_NO_ROLE:
      'Neizdevās uzstādīt inkvizīcijas roli, lūdzu mēģini vēlreiz',
    INQUISITION_SET_ROLE_SUCCESS: 'Inkvizīcijas role uzstādīta <@&{{roleId}}>',
    INQUISITION_SET_TARGET_DESCRIPTION: 'Izvēlies inkvizējamo',
    INQUISITION_SET_TARGET_NO_TARGET:
      'Neizdevās uzstādīt inkvizējamo, lūdzu mēģini vēlreiz',
    INQUISITION_SET_TARGET_SUCCESS: 'Jauns inkvizīcijas mērķis <@{{target}}>',
    INQUISITION_CLEAR_QUESTIONS_DESCRIPTION:
      'Nodzēst visus inkvizīcijas jautājumus',
    INQUISITION_CLEAR_QUESTIONS_SUCCESS: 'Jautājumu rinda notīrīta',
    INQUISITION_START_DESCRIPTION: 'Sākt inkvizīciju',
    INQUISITION_START_NO_QUESTIONS:
      'Lai inkvizīciju uzsāktu norādi vismaz vienu jautājumu',
    INQUISITION_START_MEMBER_NOT_FOUND: 'Inkvizējamais lietotājs nav atrasts',
    INQUISITION_START_ANNOUNCEMENT:
      '**Lai inkvizīcija sākas {{username}}!** Nākamo jautājumu iegūstam ar "**Next!**"',
    INQUISITION_START_FIRST_QUESTION: 'Pirmais jautājums: **{{question}}**',
    INQUISITION_START_SUCCESS:
      'Inkvizīcija sākta! Jautājumu skaits: {{questionCount}}',
    INQUISITION_CHANNEL_INVALID:
      'Nederīgs inkvizīcijas kanāls, lūdzu mēģini to uzstādīt no jauna',
    INQUISITION_NO_MORE_QUESTIONS_LEFT:
      '**Pagaidām jautājumu nav, pagaidi nedaudz, varbūt vēl būs. Jautājumus var iesūtīt šeit: {{questionLink}}**',
    INQUISITION_NEXT_QUESTION_DESCRIPTION: 'Saņemt nākoši jautājumu',
    BOT_CONFIG_INQUISITION_ROLE_NOT_SET: 'Lūdzu uzstādi inkvizīcijas role',
    BOT_CONFIG_INQUISITION_CHANNEL_NOT_SET: 'Lūdzu uzstādi inkvizīcijas kanālu',
    INQUISITION_ROLE_INVALID:
      'Nederīgs inkvizīcijas role, lūdzu mēģini to uzstādīt no jauna',
    INQUISITION_SET_QUESTION_LINK_DESCRIPTION:
      'Uzstādi linku kur cilvēki var postot jautājumus',
    INQUISITION_SET_QUESTION_LINK_NO_LINK:
      'Neizdevās uzstādīt saiti, lūdzu mēģini vēlreiz',
    INQUISITION_QUICK_QUESTIONS_DESCRIPTION:
      'Uzdod jautājumu quick fire inkvizīcijai, ziņas sākumā ietago lietotāju',
    INQUISITION_QUICK_QUESTIONS_SUCCESS:
      'Jautājums ātrajai inkvizīcijai uzdots',
    INQUISITION_QUICK_QUESTIONS_NOUSER: 'Jautājuma sākumā jātego lietotājs',
    INQUISITION_QUICK_START_ANNOUNCEMENT:
      '**Lai free-for-all inkvizīcija sākas!** Katram ir iespēja atbildēt ar vienu ziņu, atbildes nemaināmas!',
    INQUISITION_QUICK_START_SUCCESS: 'Free for all inkvizīcija iesākta!',
  },
} as const;
