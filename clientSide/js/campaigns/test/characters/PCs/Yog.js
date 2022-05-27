window.pc.yog = {
  characterName: 'Yog',
  classes: 'Ancestral Barbarian',
  background: 'Nomad',
  race: 'Tortle',
  alignment: 'Neutral-Good',
  experience: '1,000,000',

  tools: {
    modCalc: function (baseStat) {
      let mod = -6
      if (baseStat > 0) {
        for (let i = 0; i <= baseStat; i++) {
          if (i % 2 === 0) {
            mod = mod + 1
          }
        }
      }
      return mod
    },
    addAtk: function (name, dmg, type, mod, prof, description) {
      this.name = name
      this.dmg = dmg
      this.type = type
      this.mod = mod
      this.prof = prof
      this.description = description
    },
    addEquip: function (name, description) {
      this.name = name
      this.description = description
    },
    addAbility: function (name, description, active) {
      this.name = name
      this.description = description
      this.active = active
    }
  },

  hp: {
    max: 295,
    temp: 0,
    damage: 60,
    current: this.hp.max + this.hp.temp + this.hp.damage
  },
  deathSaves: {
    pass: 0,
    fail: 0
  },
  hitDice: 20,

  stats: {
    str: {
      base: 24,
      mod: this.tools.modCalc(this.stats.str.base),
      save: true
    },
    dex: {
      base: 3,
      mod: this.tools.modCalc(this.stats.dex.base),
      save: false
    },
    con: {
      base: 24,
      mod: this.tools.modCalc(this.stats.con.base),
      save: true
    },
    int: {
      base: 3,
      mod: this.tools.modCalc(this.stats.int.base),
      save: false
    },
    wis: {
      base: 11,
      mod: this.tools.modCalc(this.stats.wis.base),
      save: false
    },
    cha: {
      base: 7,
      mod: this.tools.modCalc(this.stats.cha.base),
      save: false
    }
  },
  skills: {
    acrobatics: { proficiency: false, mod: 'dex' },
    animalHandling: { proficiency: true, mod: 'wis' },
    arcana: { proficiency: false, mod: 'int' },
    athletics: { proficiency: false, mod: 'str' },
    deceptions: { proficiency: false, mod: 'cha' },
    history: { proficiency: false, mod: 'int' },
    insight: { proficiency: false, mod: 'wis' },
    intimidation: { proficiency: false, mod: 'cha' },
    investigation: { proficiency: false, mod: 'int' },
    medicine: { proficiency: false, mod: 'wis' },
    nature: { proficiency: true, mod: 'int' },
    percetpion: { proficiency: false, mod: 'wis' },
    performance: { proficiency: false, mod: 'cha' },
    persuasion: { proficiency: false, mod: 'cha' },
    religion: { proficiency: false, mod: 'int' },
    slightOfHand: { proficiency: false, mod: 'dex' },
    stealth: { proficiency: false, mod: 'dex' },
    survival: { proficiency: false, mod: 'wis' }
  },

  pasPerception: this.stats.wis.mod,
  proficiencyBonus: 6,
  insperation: 0,
  ac: 10 + this.stats.dex.mod + this.stats.con.mod,
  initiative: this.stats.dex.mod,
  speed: 40,

  attacks: [
    this.tools.addAtk(
      'Family Sword',
      '2d10+16',
      'slashing',
      'str',
      'true',
      'A spectral blue sword resembling those forged by the Tortle\'s long ago')
  ],
  equipment: [
    this.tools.addEquip(
      'Half Pipe',
      'A totally rad smoking tool'
    ),
    this.tools.addEquip(
      'Corn!',
      'The best food'
    ),
    this.tools.addEquip(
      'Noggle',
      'No one really knows what this is'
    ),
    this.tools.addEquip(
      'Skelespook',
      'I don\'t remember'
    ),
    this.tools.addEquip(
      'Family',
      'when you need to phone a friend, your family is there for you'
    ),
    this.tools.addEquip(
      'Skelly Bro',
      'All of the spooky and scary you could need'
    )
  ],
  currency: {
    platnium: 0,
    gold: 10,
    electrum: 0,
    silver: 0,
    copper: 0
  },

  abilities: {
    passive: [
      this.tools.addAbility(
        'Bare Back',
        'No armor, Ac= 17+Con+Dex',
        true
      ),
      this.tools.addAbility(
        'Dead Man',
        '+2 Ac, can use action to become fully spectral for rest of turn',
        true
      ),
      this.tools.addAbility(
        'Danger Sense',
        'Advn on Dex rolls against things seen',
        true
      ),
      this.tools.addAbility(
        'Feral Instinct',
        'Advn on Initiative, can rage to not be affected by surprise',
        true
      ),
      this.tools.addAbility(
        'Brutal Critical',
        'Add 3 more damage die to crits',
        true
      ),
      this.tools.addAbility(
        'Relentles Rage',
        'If hp goes to 0, roll dc 10 Con save, if pass have 1hp (while raging)',
        true
      ),
      this.tools.addAbility(
        'Persistant Rage',
        'Rage only ends by choice or knock out',
        true
      ),
      this.tools.addAbility(
        'Sentinal',
        'Opportunity attack bring creature speed to 0, disengage doesn’t work, friends within 5 feet getting attacked causes opportunity attack',
        true
      ),
      this.tools.addAbility(
        'Blade Master',
        '+1 to greatswords, opportunity attacks get advantage',
        true
      ),
      this.tools.addAbility(
        'Champion',
        'Can\'t roll less than 24 on STR rolls',
        true
      )
    ],
    active: [
      this.tools.addAbility(
        'Rage',
        'Advn on Stg rolls, +4dam, phys resist, (Bns Act)',
        false
      ),
      this.tools.addAbility(
        'Ancesteral Rage',
        'First target you hit on your turn has disadvn & ½ dam on attacks not on you',
        false
      ),
      this.tools.addAbility(
        'Spirit Sheild',
        'In rage, can reflect dam you see within 30 feet of you by 4d6 to attacker',
        false
      ),
      this.tools.addAbility(
        'Reckless Attack',
        '1st attack can be reckless, giving advn on attack rolls from and against you',
        false
      ),
      this.tools.addAbility(
        'Extra Attack',
        'Can attack twice per turn',
        false
      ),
      this.tools.addAbility(
        'Phone Friend',
        'Talk to dad for advantage on Int and Wis rolls 3/ a day',
        false
      ),
      this.tools.addAbility(
        'Parry Stance',
        'On your turn, use reaction to gain +1 ac till next turn',
        false
      ),
      this.tools.addAbility(
        'Aggression',
        'Use bonus action to move towards opponent, up to characters speed',
        false
      )
    ]
  }
}
