import * as React from 'react';
import { Box, ButtonBase, Dialog, Divider, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Select, MenuItem, TableHead } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { range } from '../src/util';
import update from 'immutability-helper';
import { WeaponAugmentMR, color } from '../src/equipment';
import Header from './header';
import Sprite from './sprite';
import { ButtonCell } from './buttons';

const augmentPos = {
  "Attack": [24,0],
  "Defense": [48,0],
  "Element": [72,0],
  "Health": [0,24],
  "Slot": [24,24],
  "Affinity": [48,24]
}

const ButtonHoverOutlined = styled(ButtonBase)(({theme}) => ({
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    outline: '1px solid'
  },
}))

function AugmentHexagon(props) {
  const { text, pos } = props;
  return (
    <Box position="relative">
      <Sprite
        src='/icon/augments.png'
        pos={pos}
        width={24}
        crop={[24,24]}
        sx={{alignSelf: "center", position: "relative"}}
      />
      <Typography variant='h5'
        sx={{
          ...props.textStyle,
          position: "absolute", left: 12, top: 0,
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;'
        }}
      >
        { text }
      </Typography>
    </Box>
  )
}

function AugmentSelectionHR(props) {
  const { pos, augments, myAugments, setMyAugments } = props;
  const theme = useTheme();

  let entries = Object.keys(augments);
  let selectItems = entries.map((name, i) => {
    return (
      <MenuItem key={i} value={name}>
        { name }
      </MenuItem>
    )
  })

  const [selectValue, setSelectValue] = React.useState('');
  let inputStyle = {...theme.typography.body2, py: 0, borderRadius: 0}
  if (myAugments[pos]) {
    inputStyle.backgroundColor = color[myAugments[pos]];
  }
  // Clear the select text when upgrade is cleared
  React.useEffect(() => {
    if (!myAugments[pos]) {
      setSelectValue('');
    }
  }, [myAugments[pos]])

  const handleChange = (event) => {
    setSelectValue(event.target.value);
    setMyAugments(update(myAugments, {
      [pos]: {$set: event.target.value}
    }));
  }

  return (
    <Select
      fullWidth
      size='small'
      value={selectValue}
      renderValue={(value) => {
        if (value === '') {
          return '';
        }
        return value;
      }}
      onChange={handleChange}
      sx={{borderRadius: 0}}
      inputProps={{sx: inputStyle}}
    >
      { selectItems }
    </Select>
  )
}

function AugmentSelectionMR(props) {
  const { wep, augments, myAugments, setMyAugments } = props;
  
  const [open, setOpen] = React.useState(false);

  const openDialog = () => {
    setOpen(true);
  }

  const onClose = (augmentObj) => {
    setOpen(false);
    
    if (augmentObj) {
      let tempAugs = [];
      Object.keys(augmentObj).forEach(key => {
        let lvl = augmentObj[key];
        if (lvl) {
          const [values, sizes] = augments[key];
          let i = lvl - 1;
          let value;
          if (key == 'Element') {
            value = values[wep.Class][i];
          }
          else {
            value = values[i];
          }
          let entry = new WeaponAugmentMR(key, lvl, value, sizes[i]);
          tempAugs.push(entry);
        }
      })
      // Object.values(augmentObj).forEach((augment) => {
      //   if (augment && augment.lvl) {
      //     tempAugs.push(augment);
      //   }
      // });
      setMyAugments(tempAugs);
    }
    else {
      setMyAugments([null]);
    }
  }

  let augmentDisplay = [];
  myAugments.forEach((augment, index) => {
    let displayText = 'None';
    let style = {width: '100%'};
    // On first render, an HR augment may be passed in, so we check for strings
    if (augment && typeof(augment) != 'string') {
      displayText = augment.toString();
      style.backgroundColor = augment.getColor();
    }
    augmentDisplay.push(
      <Box
        key={index}
        sx={{...style}}
      >
        <Typography variant='body2'>
          { displayText }
        </Typography>
      </Box>
    )
  })

  const AugmentDisplay = () => {
    return (
      <ButtonHoverOutlined
        onClick={() => openDialog()}
        sx={{width: '100%', display: 'flex', flexDirection: 'column'}}
      >
        { augmentDisplay }
      </ButtonHoverOutlined>
    )
  }

  return (
    <Box>
      <AugmentDisplay/>
      <AugmentSelectionDialog
        {...props}
        open={open}
        onClose={onClose}
      />
    </Box>
  )
}

function AugmentSelectionDialog(props) {
  const { open, onClose, wep, augments, myAugments, setMyAugments } = props;
  
  const [selection, setSelection] = React.useState({
    "Attack": 0,
    "Defense": 0,
    "Affinity": 0,
    "Slot": 0,
    "Health": 0,
    "Element": 0
  })

  let maxCapacity = 30 - 2*wep.Rarity;
  let capacity = maxCapacity;
  Object.keys(selection).forEach(key => {
    let lvl = selection[key];
    if (lvl > 0) {
      const [values, sizes] = augments[key];
      capacity -= sizes[lvl - 1];
    }
  })

  const handleClose = () => {
    let sum = 0;
    Object.values(selection).forEach(lvl => {
      sum += lvl;
    })
    if (sum) {
      onClose(selection);
    }
    else {
      onClose(null);
    }
  }

  const handleListItemClick = (value) => {
    if (selection[value.type] == value.lvl) {
      setSelection(update(selection, {
        [value.type]: {
          $set: 0
        }
      }))
    }
    else {
      setSelection(update(selection, {
        [value.type]: {
          $set: value.lvl
        }
      }))
    }
  }

  const AugmentCell = (props) => {
    const { entry, disabled=false, selected=false } = props;
    const theme = useTheme();

    let buttonProps = {
      onClick: () => handleListItemClick(entry),
    };

    if (selected) {
      buttonProps.style = {};
      buttonProps.style.backgroundColor = theme.palette.secondary.main;
    }

    if (disabled) {
      buttonProps.style = {};
      buttonProps.style.backgroundColor = theme.palette.background.disabled;
    }

    return (
      <ButtonCell {...buttonProps} disabled={disabled} sx={{...props.sx}}>
        <AugmentHexagon
          pos={augmentPos[entry.type]}
          text={entry.size}
          textStyle={{...props.textStyle}}
        />
      </ButtonCell>
    )
  }

  let tableRows = [];
  Object.keys(augments).forEach(key => {
    let cells = [
      <TableCell key={4} sx={{backgroundColor: color[key]}}>
        <Typography>{ key }</Typography>
      </TableCell>
    ];

    const [values, sizes] = augments[key];
    for (let i=0; i<4; i++) {
      let entry = new WeaponAugmentMR(key, i+1, values[i], sizes[i]);
      let cellProps = {
        key: i,
        entry: entry
      };
      if (entry.lvl < selection[key]) {}
      else if (entry.lvl == selection[key]) {
        cellProps.selected = true;
      }
      else if (entry.size > capacity) {
        cellProps.disabled = true;
        cellProps.textStyle = {color: 'text.disabled'}
      }
      cells.push(<AugmentCell {...cellProps}/>);
    }
    tableRows.push(<TableRow hover key={key}>{ cells }</TableRow>);
  })
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl'>
      <Header rounded title='Augments'/>
      <TableContainer>
        <Table size='small' variant='grid'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}>
                <Box display="flex">
                  <Typography mr={1}>
                    Capacity:
                  </Typography>
                  <AugmentHexagon
                    pos={[0,0]}
                    text={capacity + "/" + maxCapacity}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { tableRows }
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  )
}

export default function Augments(props) {
  const { wep, augments, myAugments, setMyAugments } = props;

  let rank = (wep.Rarity < 9) ? 'HR' : 'MR';

  if (rank == 'HR') {
    let augmentDisplay = [];
    for (let i=0; i<myAugments.length; i++) {
      let selectProps = {...props, augments: augments[rank], key: i, pos: i};
      augmentDisplay.push(
        <AugmentSelectionHR {...selectProps}/>
      )
    }

    return (
      <Box sx={{...props.sx}}>
        <Header rounded title='Augments' variant='body1'/>
        <Box sx={{display: "flex", flexDirection: "column"}}>
          { augmentDisplay }
        </Box>
      </Box>
    )
  }
  else {
    let selectProps = {...props, augments: augments[rank]}
    return (
      <Box sx={{...props.sx}}>
        <Header rounded title='Augments' variant='body1'/>
        <AugmentSelectionMR {...selectProps}/>
      </Box>
    )
  }
}
