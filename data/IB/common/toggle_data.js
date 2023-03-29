const toggleData = {
  // Items
  "PWC": {
    group: 2,
    name: 180,
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*4,0],
      crop: [64,64],
      width: 32
    }
  },
  "PWT": {
    group: 2,
    name: 182,
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*5,0],
      crop: [64,64],
      width: 32
    }
  },
  "DDG": {
    group: 2,
    name: 42,
    incompatible: "MDD",
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*1,0],
      crop: [64,64],
      width: 32
    }
  },
  "MDD": {
    group: 2,
    name: 44,
    incompatible: "DDG",
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*2,0],
      crop: [64,64],
      width: 32
    }
  },
  "MTS": {
    group: 2,
    name: 40,
    incompatible: "MTP",
    sprite: {
      src: '/icon/buffitems.png',
      pos: [0,0],
      crop: [64,64],
      width: 32
    }
  },
  "MTP": {
    group: 2,
    name: 46,
    incompatible: "MTS",
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*3,0],
      crop: [64,64],
      width: 32
    }
  },
  "DPR": {
    group: 2,
    name: 60,
    sprite: {
      src: '/icon/buffitems.png',
      pos: [64*4,0],
      crop: [64,64],
      width: 32
    }
  },

  // Food
  "AUL": {
    group: 1,
    name: 104,
    sprite: {
      src: '/icon/foodbuff.png',
      pos: [0,0],
      crop: [64,64],
      width: 32
    }
  },
  "DUL": {
    group: 1,
    name: 107,
    sprite: {
      src: '/icon/foodbuff.png',
      pos: [64,0],
      crop: [64,64],
      width: 32
    }
  },
  "EUL": {
    group: 1,
    name: 110,
    sprite: {
      src: '/icon/foodbuff.png',
      pos: [64*2,0],
      crop: [64,64],
      width: 32
    }
  },

  // Skills
  "WEX": {
    group: 0,
    skill: 50,
    name: 150,
    nick: "WEX",
    incompatible: "WX+"
  },
  "WX+": {
    group: 0,
    skill: 50,
    name: 150,
      append: "+",
    nick: "WEX+",
    incompatible: "WEX" 
  },
  "AGI": {
    group: 0,
    skill: 62,
    name: 186,
    nick: "AGI"
  },
  "PPE": {
    group: 0,
    skill: 63,
    name: 189,
    nick: "PP"
  },
  "HRO": {
    group: 0,
    skill: 64,
    name: 192,
    nick: "HERO"
  },
  "FRT": {
    group: 0,
    skill: 65,
    name: 195,
    nick: "FORT",
    incompatible: "FT+"
  },
  "FT+": {
    group: 0,
    skill: 65,
    name: 195,
      append: "+",
    nick: "FORT+",
    incompatible: "FRT"
  },
  "RES": {
    group: 0,
    skill: 66,
    name: 198,
    nick: "RES"
  },
  "MMT": {
    group: 0,
    skill: 101,
    name: 303,
    nick: "MM"
  },
  "OFG": {
    group: 0,
    skill: 185,
    name: 555,
    nick: "OFG"
  },
  "COL": {
    group: 0,
    skill: 186,
    name: 558,
    nick: "COAL"
  }
}

export default toggleData
