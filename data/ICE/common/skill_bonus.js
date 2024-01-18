/*
Classes:
  0: Reserved

  1: Single ele res bonus
  2: All ele res bonus
  3: All ele res mult
  4: Alatreon bonus (base ele bonus)

  5: Base defense mult
  6: Defense bonus (pre adamant pill)
  7: Adamant pill
  8: Defense bonus (post adamant pill)
  9: Total defense mult

  10: Reserved

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

  22-29: Reserved

  30: Add health
  31: Add divine blessing %
  32: Divine blessing mult
*/

const skillBonus = {
  19: [ // Attack boost
    {   
      effect: {
        class: 13, 
        param: 1
      }
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
    },
    {
      effect: {
        class: 5,
        cusParam: [100,100,105,105,108,108,110]
      }
    },
    {
      effect: {
        class: 8,
        param: 1
      }
    }
  ],
  21: [ // Health boost
    {
      effect: {
        class: 30,
        param: 1
      }
    }
  ],
  24: [ // Fire resistance
    {
      effect: {
        key: 0,
        class: 1,
        param: 1
      }
    },
    {
      effect: {
        class: 8,
        param: 2
      }
    }
  ],
  25: [ // Water resistance
    {
      effect: {
        key: 1,
        class: 1,
        param: 1
      }
    },
    {
      effect: {
        class: 8,
        param: 2
      }
    }
  ],
  26: [ // Ice resistance
    {
      effect: {
        key: 2,
        class: 1,
        param: 1
      }
    },
    {
      effect: {
        class: 8,
        param: 2
      }
    }
  ],
  27: [ // Thunder resistance
    {
      effect: {
        key: 3,
        class: 1,
        param: 1
      }
    },
    {
      effect: {
        class: 8,
        param: 2
      }
    }
  ],
  28: [ // Dragon resistance
    {
      effect: {
        key: 4,
        class: 1,
        param: 1
      }
    },
    {
      effect: {
        class: 8,
        param: 2
      }
    }
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
        value: 1,
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
        value: 1,
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
        value: 1,
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
        value: 1,
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
  64: [ // Heroics
    { tglId: "HRO",
      effect: {
        class: 12,
        param: 1
      }
    },
    { tglId: "HRO",
      effect: {
        class: 8,
        param: 2
      }
    }
  ],
  65: [ // Fortify
    { tglId: "FRT",
      effect: {
        class: 12,
        param: 1
      }
    },
    { tglId: "FRT",
      effect: {
        class: 5,
        param: 2
      }
    },
    { tglId: "FT+",
      effect: {
        class: 12,
        value: 120
      }
    },
    { tglId: "FT+",
      effect: {
        class: 5,
        value: 130
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
  97: [ // Divine Blessing
    {
      effect: {
        class: 31,
        param: 1
      }
    },
    {
      effect: {
        class: 32,
        param: 2
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
        value: 110
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
