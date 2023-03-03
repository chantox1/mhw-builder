import * as React from 'react';
import { Box, ButtonBase, FormControl, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import update from 'immutability-helper';
import { useTheme } from '@mui/material/styles';

export function isCustomUpgradeable(wep) {
  if ('Final' in wep && wep.Final) {
    return (wep.Rarity > 8 && 'Unique' in wep && !(wep.Unique))
  }
}

function CusUpgradeSelection(props) {
  const { pos, equip, setEquip, baseStats, upgrades, setUpgrades, upgradeLvls } = props;
  const availableUpgrades = upgradeLvls[pos];
  const theme = useTheme();

  let entries = Object.entries(availableUpgrades);
  let selectItems = []
  for (let i=0; i<entries.length; i++) {
    let entry = entries[i];
    let itemContent = entry[0] + " +" + entry[1].toString();
    selectItems.push(
      <MenuItem key={i} value={i}>
        { itemContent }
      </MenuItem>
    )
  }

  const [selectValue, setSelectValue] = React.useState('');
  let inputStyle = {...theme.typography.body2, py: 0, borderRadius: 0}
  if (upgrades[pos]) {
    switch (upgrades[pos][0]) {
      case "Attack":
        inputStyle.backgroundColor = 'Maroon';
        break;
      case  "Defense":
        inputStyle.backgroundColor = 'Sienna';
        break;
      case "Affinity":
        inputStyle.backgroundColor = 'Purple';
        break;
      case "Element":
        inputStyle.backgroundColor = 'DarkGoldenRod';
        break;
      case "Sharp":
        inputStyle.backgroundColor = 'DimGray';
    }
  }
  // Clear the select text when upgrade is cleared
  React.useEffect(() => {
    if (!upgrades[pos]) {
      setSelectValue('');
    }
  }, [upgrades[pos]])

  const handleChange = (event) => {
    setSelectValue(event.target.value);
    const entry = entries[event.target.value]
    if (pos < 6 && !upgrades[pos]) {
      setUpgrades(update(upgrades, {
        [pos]: {$set: entry},
        $push: [null]
      }));
    }
    else {
      setUpgrades(update(upgrades, {
        [pos]: {$set: entry}
      }));
    }
  }

  return (
    <Select
      fullWidth
      size='small'
      value={selectValue}
      renderValue={(i) => {
        if (i === '') {
          return '';
        }
        const entry = entries[i];
        console.log("entry: ", entry);
        if (entry === undefined) {
          return ';'
        }
        return (
          entry[0] + " +" + entry[1].toString()
        );
      }}
      onChange={handleChange}
      sx={{borderRadius: 0}}
      inputProps={{sx: inputStyle}}
    >
      { selectItems }
    </Select>
  )
}

export function CustomUpgradeDisplay(props) {
  const { equip, setEquip, upgrades, setUpgrades, upgradeLvls } = props;
  const upgradeSelectionList = [];
  let baseStats = {
      "Attack": equip.Weapon.Damage,
      "Defense": equip.Weapon.Defense,
      "Affinity": equip.Weapon.Affinity,
      "Element": 0,
    }
  if ('Element' in equip.Weapon) {
    baseStats.Element = equip.Weapon.ElementDmg;
  }
  else if ('HiddenEle' in equip.Weapon) {
    baseStats.Element = equip.Weapon.HiddenEleDmg;
  }

  for (let i=0; i<upgrades.length; i++) {
    upgradeSelectionList.push(
      <CusUpgradeSelection
        key={i}
        pos={i}
        equip={equip}
        setEquip={setEquip}
        baseStats={baseStats}
        upgrades={upgrades}
        setUpgrades={setUpgrades}
        upgradeLvls={upgradeLvls}
      />
    )
  }

  return (
    <Box sx={{...props.sx}}>
      <Paper elevation={0} square
        sx={{
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4
        }}>
        <Box flex={1} display="flex" justifyContent="center">
          <Typography>Custom Upgrades</Typography>
        </Box>
      </Paper>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        { upgradeSelectionList }
      </Box>
    </Box>
  )
}

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
