import * as React from 'react';
import { Box, MenuItem, Paper, Select, Typography } from '@mui/material';
import update from 'immutability-helper';
import { useTheme } from '@mui/material/styles';
import { color } from '../src/equipment';
import Header from './header';

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
    inputStyle.backgroundColor = color[upgrades[pos][0]]
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
      <Header rounded title='Custom Upgrades' variant='body1'/>
      <Box sx={{display: "flex", flexDirection: "column"}}>
        { upgradeSelectionList }
      </Box>
    </Box>
  )
}
