/*
Classes:
    0: Base attack bonus
    1: Base attack mult
    2: Attack bonus
    3: Post-cap Attack mult
    
    4: Affinity bonus
    5: Set crit dmg

    6: Base ele mult (percentage)
    7: Ele bonus
    8: Pre-cap ele mult
    9: Post-cap ele mult
    10: Set ele crit dmg
*/

const skillBonus = {
  19: [ // Attack boost
    {   
      effect: {
        class: 2, 
        param: 1
      },
    },
    {
      effect: {
        class: 4,
        param: 2
      }
    }
  ],
  30: [ // Fire attack
    {
      cond: arg => {return arg == 1},
      effect: {
        class: 7, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 1},
      effect: {
        class: 6,
        param: 2,
      }
    }
  ],
  31: [ // Water attack
    {   
      cond: arg => {return arg == 2},
      effect: {
        class: 7,
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 2},
      effect: {
        class: 6,
        param: 2,
      }
    }
  ],
  32: [ // Ice attack
    {
      cond: arg => {return arg == 3},
      effect: {
        class: 7, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 3},
      effect: {
        class: 6,
        param: 2,
      }
    }
  ],
  33: [ // Thunder attack
    {
      cond: arg => {return arg == 4},
      effect: {
        class: 7, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 4},
      effect: {
        class: 6,
        param: 2,
      }
    }
  ],
  34: [ // Dragon attack
    {
      cond: arg => {return arg == 5},
      effect: {
        class: 7, 
        param: 1,
      }
    },
    {
      cond: arg => {return arg == 5},
      effect: {
        class: 6,
        param: 2,
      }
    }
  ],
  35: [ // Poison attack
    {
      cond: arg => {return arg == 6},
      effect: {
        class: 7, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 6},
      effect: {
        class: 6,
        param: 1,
      }
    }
  ],
  36: [ // Paralysis attack
    {
      cond: arg => {return arg == 7},
      effect: {
        class: 7, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 7},
      effect: {
        class: 6,
        param: 1,
      }
    }
  ],
  37: [ // Sleep attack
    {
      cond: arg => {return arg == 8},
      effect: {
        class: 7, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 8},
      effect: {
        class: 6,
        param: 1,
      }
    }
  ],
  38: [ // Blast attack
    {   
      cond: arg => {return arg == 9},
      effect: {
        class: 7, 
        value: 10,
      }
    },
    {
      cond: arg => {return arg == 9},
      effect: {
        class: 6,
        param: 1,
      }
    }
  ],
  48: [ // Critical eye
    {   
      effect: {
        class: 4, 
        param: 1
      }
    }
  ],
  49: [ // Critical boost
    {   
      effect: {
        class: 5, 
        param: 1
      }
    }
  ],
  159: [ // Non-elemental boost
    {
      cond: arg => {return arg == 0},
      effect: {
        class: 1,
        value: 105
      }
    }
  ]
}

export default skillBonus;
