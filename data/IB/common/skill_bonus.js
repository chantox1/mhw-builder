/*
Classes:
  0: Reserved

  1: Single ele res bonus
  2: All ele res bonus
  3: All ele res mult
  4: Alatreon bonus (base ele bonus)

  3-10: Reserved

  11: Base attack bonus
  12: Base attack mult
  13: Attack bonus
  14: Post-cap Attack mult
  
  15: Affinity bonus
  16: Set crit dmg

  17: Base ele mult (percentage)
  18: Ele bonus
  19: Pre-cap ele mult
  20: Post-cap ele mult

  21: Set ele crit dmg
*/

const skillBonus = {
  19: [ // Attack boost
    {   
      effect: {
        class: 13, 
        param: 1
      },
    },
    {
      effect: {
        class: 15,
        param: 2
      }
    }
  ],
  20: [ // Defense boost
    {
      effect: {
        class: 2,
        param: 2
      }
    }
    // TODO: Defense (non-ele) boost
  ],
  24: [ // Fire resistance
    {
      effect: {
        key: 0,
        class: 1,
        param: 1
      }
    }
    // TODO: Defense boost @ lvl 3
  ],
  25: [ // Water resistance
    {
      effect: {
        key: 1,
        class: 1,
        param: 1
      }
    }
    // TODO: Defense boost @ lvl 3
  ],
  26: [ // Ice resistance
    {
      effect: {
        key: 2,
        class: 1,
        param: 1
      }
    }
    // TODO: Defense boost @ lvl 3
  ],
  27: [ // Thunder resistance
    {
      effect: {
        key: 3,
        class: 1,
        param: 1
      }
    }
    // TODO: Defense boost @ lvl 3
  ],
  28: [ // Dragon resistance
    {
      effect: {
        key: 4,
        class: 1,
        param: 1
      }
    }
    // TODO: Defense boost @ lvl 3
  ],
  30: [ // Fire attack
    {
      cond: arg => {return arg == 1},
      effect: {
        class: 18, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 1},
      effect: {
        class: 17,
        param: 2,
      }
    }
  ],
  31: [ // Water attack
    {   
      cond: arg => {return arg == 2},
      effect: {
        class: 18,
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 2},
      effect: {
        class: 17,
        param: 2,
      }
    }
  ],
  32: [ // Ice attack
    {
      cond: arg => {return arg == 3},
      effect: {
        class: 18, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 3},
      effect: {
        class: 17,
        param: 2,
      }
    }
  ],
  33: [ // Thunder attack
    {
      cond: arg => {return arg == 4},
      effect: {
        class: 18, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 4},
      effect: {
        class: 17,
        param: 2,
      }
    }
  ],
  34: [ // Dragon attack
    {
      cond: arg => {return arg == 5},
      effect: {
        class: 18, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 5},
      effect: {
        class: 17,
        param: 2,
      }
    }
  ],
  35: [ // Poison attack
    {
      cond: arg => {return arg == 6},
      effect: {
        class: 18, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 6},
      effect: {
        class: 17,
        param: 1,
      }
    }
  ],
  36: [ // Paralysis attack
    {
      cond: arg => {return arg == 7},
      effect: {
        class: 18, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 7},
      effect: {
        class: 17,
        param: 1,
      }
    }
  ],
  37: [ // Sleep attack
    {
      cond: arg => {return arg == 8},
      effect: {
        class: 18, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 8},
      effect: {
        class: 17,
        param: 1,
      }
    }
  ],
  38: [ // Blast attack
    {   
      cond: arg => {return arg == 9},
      effect: {
        class: 18, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 9},
      effect: {
        class: 17,
        param: 1,
      }
    }
  ],
  48: [ // Critical eye
    {   
      effect: {
        class: 15, 
        param: 1
      }
    }
  ],
  49: [ // Critical boost
    {   
      effect: {
        class: 16, 
        param: 1
      }
    }
  ],
  50: [ // Weakness Exploit
    { tglId: "WEX",
      effect: {
        class: 15,
        param: 1
      }
    },
    { tglId: "WX+",
      effect: {
        class: 15,
        param: 2
      }
    }
  ],
  62: [ // Agitator
    { tglId: "AGI",
      effect: {
        class: 13,
        param: 1
      }
    },
    { tglId: "AGI",
      effect: {
        class: 15,
        param: 2
      }
    }
  ],
  63: [ // Peak performance
    { tglId: "PPE",
      effect: {
        class: 13,
        param: 1
      }
    }
  ],
  64: [ // Heroics (TODO: Add defense bonus)
    { tglId: "HRO",
      effect: {
        class: 12,
        param: 1
      }
    }
  ],
  65: [ // Fortify (TODO: Add defense mult)
    { tglId: "FRT",
      effect: {
        class: 12,
        param: 1
      }
    },
    { tglId: "FT+",
      effect: {
        class: 12,
        value: 120
      }
    }
  ],
  66: [ // Resentment
    { tglId: "RES",
      effect: {
        class: 13,
        param: 1
      }
    }
  ],
  101: [ // Maximum Might
    { tglId: "MMT",
      effect: {
        class: 15,
        param: 1
      }
    }
  ],
  122: [ // Affinity Sliding
    { tglId: "AFS",
      effect: {
        class: 15,
        value: 30
      }
    }
  ],
  159: [ // Non-elemental boost
    {
      cond: arg => {return arg == 0},
      effect: {
        class: 12,
        value: 105
      }
    }
  ],
  177: [ // Namielle Divinity
    {
      effect: {
        class: 18,
        cusParam: [0,6,6,15,15]
      }
    }
  ],
  185: [ // Offensive Guard
    { tglId: "OFG",
      effect: {
        class: 12,
        param: 1
      }
    }
  ],
  186: [ // Coalescence
    { tglId: "COL",
      effect: {
        class: 13,
        param: 1
      }
    },
    { tglId: "COL",
      cond: arg => {return (arg > 0 && arg < 6)},
      effect: {
        class: 18,
        param: 2
      }
    },
    { tglId: "COL",
      cond: arg => {return arg >= 6},
      effect: {
        class: 17,
        param: 3
      }
    },
  ],
  211: [ // Safi'jiiva Seal
    {
      effect: {
        class: 15,
        cusParam: [0,0,20,20,40]
      }
    },
    {
      effect: {
        class: 18,
        cusParam: [0,0,8,8,15]
      }
    }
  ],
  221: [ // Alatreon Divinity
    {
      effect: {
        class: 3,
        param: 3,
        lvlRange: [2,3]
      }
    },
    { // TODO: bowguns use param 2 instead
      effect: {
        class: 4,
        param: 1,
      }
    }
  ]
}

export default skillBonus;
