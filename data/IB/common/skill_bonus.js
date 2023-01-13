/*
TODO: this can be a json file when done

Classes:
    0: Base attack bonus
    1: Base attack mult
    2: Attack bonus
    3: Post-cap Attack mult
    
    4: Affinity bonus
    5: Set crit dmg

    6: Base ele mult (percentage) {Pass element id as extra parameter here}
    7: Ele bonus {Pass element id as extra parameter here}
    8: Ele bonus (always 10) {Pass element id as extra parameter here} <- this is used in the status attack skills
    9: Pre-cap ele mult
    10: Post-cap ele mult

    11: Set ele crit dmg
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
      effect: {
        class: 7, 
        param: 1,
        extra: 0
      }
    },
    {
      effect: {
        class: 6,
        param: 2,
        extra: 0
      }
    }
  ],
  31: [ // Water attack
    {   
      effect: {
        class: 7, 
        param: 1,
        extra: 1
      }
    },
    {
      effect: {
        class: 6,
        param: 2,
        extra: 1
      }
    }
  ],
  32: [ // Ice attack
    {   
      effect: {
        class: 7, 
        param: 1,
        extra: 2
      }
    },
    {
      effect: {
        class: 6,
        param: 2,
        extra: 2
      }
    }
  ],
  33: [ // Thunder attack
    {   
      effect: {
        class: 7, 
        param: 1,
        extra: 3
      }
    },
    {
      effect: {
        class: 6,
        param: 2,
        extra: 3
      }
    }
  ],
  34: [ // Dragon attack
    {   
      effect: {
        class: 7, 
        param: 1,
        extra: 4
      }
    },
    {
      effect: {
        class: 6,
        param: 2,
        extra: 4
      }
    }
  ],
  35: [ // Poison attack
    {   
      effect: {
        class: 8, 
        param: 0,
        extra: 5
      }
    },
    {
      effect: {
        class: 6,
        param: 1,
        extra: 5
      }
    }
  ],
  36: [ // Paralysis attack
    {   
      effect: {
        class: 8, 
        param: 0,
        extra: 6
      }
    },
    {
      effect: {
        class: 6,
        param: 1,
        extra: 6
      }
    }
  ],
  37: [ // Sleep attack
    {   
      effect: {
        class: 8, 
        param: 0,
        extra: 7
      }
    },
    {
      effect: {
        class: 6,
        param: 1,
        extra: 7
      }
    }
  ],
  38: [ // Blast attack
    {   
      effect: {
        class: 8, 
        param: 0,
        extra: 8
      }
    },
    {
      effect: {
        class: 6,
        param: 1,
        extra: 8
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
}

export default skillBonus;
