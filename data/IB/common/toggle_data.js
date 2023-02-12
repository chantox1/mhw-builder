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

  // Skills
  "WEX": {
    group: 0,
    name: 150,
    nick: "WEX",
    incompatible: "WX+"
  },
  "WX+": {
    group: 0,
    name: 150,
      append: "+",
    nick: "WEX+",
    incompatible: "WEX" 
  },
  "AGI": {
    group: 0,
    name: 186,
    nick: "AGI"
  },
  "PPE": {
    group: 0,
    name: 189,
    nick: "PP"
  }
}

export default toggleData
