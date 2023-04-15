import * as React from 'react';
import { Box, MenuItem, Paper, Select, Typography, Grid } from '@mui/material';
import update from 'immutability-helper';
import { useTheme } from '@mui/material/styles';
import Augments from '../components/augments';
import AwakenedAbilities from '../components/safi';

export function isAugmentable(wep) {
  return ('Final' in wep && wep.Final)
}

export function isCustomUpgradeable(wep) {
  if ('Final' in wep && wep.Final) {
    return (wep.Rarity > 8 && 'Unique' in wep && !(wep.Unique))
  }
}

function CusUpgradeSelection(props) {
  const { pos, upgrades, setUpgrades, upgradeLvls } = props;
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
        inputStyle.backgroundColor = '#7d4a4a';
        break;
      case  "Defense":
        inputStyle.backgroundColor = '#735034';
        break;
      case "Affinity":
        inputStyle.backgroundColor = '#734a7c';
        break;
      case "Element":
        inputStyle.backgroundColor = '#7d7d34';
        break;
      case "Sharp":
        inputStyle.backgroundColor = '#977e41';
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
        if (entry === undefined) {
          return '';
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

  for (let i=0; i<upgrades.length; i++) {
    let selectProps = {...props, key: i, pos: i};
    upgradeSelectionList.push(
      <CusUpgradeSelection
        {...selectProps}
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
    let augmentProps = {wep: equip.Weapon, augments: data.augments, myAugments: augments, setMyAugments: setAugments};

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
            <Augments {...augmentProps}/>
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
