import update from 'immutability-helper';

export function setSlot(equip, setEquip, equipItem, value) {
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
    setEquip(update(equip, {
      Weapon: {
        Slots: {
          [equipItem.Pos]: {
            $set: value
          }
        }
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
