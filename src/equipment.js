import * as React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import update from 'immutability-helper';
import Augments from '../components/augments';
import AwakenedAbilities from '../components/safi';
import { isCustomUpgradeable, CustomUpgradeDisplay } from '../components/cus_upgrades';

export const roman = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
  '4': 'IV',
  '5': 'V',
  '6': 'VI'
};

// TODO: translate augment typenames
export const color = {
  'Attack': '#7d4a4a',
  'Defense': '#735034',
  'Affinity': '#734a7c',
  'Element': '#7d7d34',
  'Status': '#7d7d34',
  'Health': '#4a734a',
  'Slot': '#4a737c',
  'Sharp': '#977e41',
  'Normal': '#a37570',
  'Long': '#a37570',
  'Wide': '#a37570',
  'Elemental Phial': '#a37570',
  'Exhaust Phial': '#a37570',
  'Impact Phial': '#a37570',
};

export const unique = {
  'Defense': ['Defense'],
  'Slot': ['Slot'],
  'Normal': ['Normal','Long', 'Wide'],
  'Long': ['Normal','Long', 'Wide'],
  'Wide': ['Normal','Long', 'Wide'],
  'Elemental Phial': ['Elemental Phial', 'Exhaust Phial'],
  'Exhaust Phial': ['Elemental Phial', 'Exhaust Phial'],
  'Impact Phial': ['Impact Phial']
};

export class WeaponAugmentMR {
  constructor(type, lvl, value, size=0) {
    this.type = type;
    this.lvl = lvl;
    this.value = value;
    this.size = size;
  }

  lvlString() {
    return roman[this.lvl];
  }

  toString() {
    return `${this.type} ${this.lvlString()}`;
  }

  isUnique() {
    return this.type in unique;
  }

  isIncompatible(awakening) {
    return unique[this.type].includes(awakening.type);
  }

  getColor() {
    return color[this.type];
  }
}

export function isAugmentable(wep) {
  return ('Final' in wep && wep.Final)
}

export function setSlot(equip, setEquip, equipItem, value, wepSlots, setWepSlots) {
  if (equipItem.Type <= 5) {
    setEquip(update(equip, {
      Armor: {
        [equipItem.Type]: {
          Slots: {
            [equipItem.Pos]: {
              $set: value
            }
          }
        }
      }
    }))
  }
  else if (equipItem.Type == 6) {
    setWepSlots(update(wepSlots, {
      [equipItem.Pos]: {
        $set: value
      }
    }))
  }
  else if (equipItem.Type == 7) {
    setEquip(update(equip, {
      Mantle: {
        [equipItem.Pos[0]]: {
          Slots: {
            [equipItem.Pos[1]]: {
              $set: value
            }
          }
        }
      }
    }))
  }
}

export function WepUpgradeDisplay(props) {
  const {
    data,
    equip, setEquip,
    upgrades, setUpgrades,
    awakens, setAwakens,
    augments, setAugments
  } = props;
  if (isAugmentable(equip.Weapon)) {
    let augmentProps = {wep: equip.Weapon, augments: data.augments, myAugments: augments, setMyAugments: setAugments, sx: {mb: 0.5}};

    if (isCustomUpgradeable(equip.Weapon)) {
      return (
        <Grid container spacing={0.5}>
          <Grid item xs={6}>
            <Paper>
              <CustomUpgradeDisplay
                equip={equip}
                setEquip={setEquip}
                upgrades={upgrades}
                setUpgrades={setUpgrades}
                upgradeLvls={data.cusUpgrades[equip.Weapon.Class]}
                sx={{mb: 0.5}}
              />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Augments {...augmentProps}/>
            </Paper>
          </Grid>
        </Grid>
      )
    }
    else if (equip.Weapon.Safi) {
      return (
        <Grid container spacing={0.5}>
          <Grid item xs={6}>
            <Paper>
              <AwakenedAbilities
                abilities={data.awakenedAbilities}
                wepClass={equip.Weapon.Class}
                awakens={awakens}
                setAwakens={setAwakens}
                sx={{mb: 0.5}}
              />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Augments {...augmentProps}/>
            </Paper>
          </Grid>
        </Grid>
      )
    }
    else {
      return (
        <Box width="50%">
          <Paper>
            <Augments {...augmentProps}

            />
          </Paper>
        </Box>
      )
    }
  }
}

export function setWeapon(equip, setEquip, equipItem, value) {
  setEquip(update(equip, {
    Weapon: {$set: value}
  }))
}

export function setMantle(equip, setEquip, equipItem, value) {
  setEquip(update(equip, {
    Mantle: {
      [equipItem.Pos]: {
        $set: value
      }
    }
  }))
}

export function setArmor(equip, setEquip, equipItem, value) {
  setEquip(update(equip, {
    Armor: {
      [value.Type]: {$set: value}
    }
  }))
}
