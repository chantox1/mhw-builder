import * as React from 'react';
import { Box, ButtonBase, Dialog, Divider, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Select, MenuItem } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { range } from '../src/util';
import update from 'immutability-helper';
import color from '../src/color';

class AugmentMR {
  constructor (type, lvl, value) {
    this.type = type;
    this.lvl = lvl;
    this.value = value;
  }

  toString() {
    return this.name;
  }
}

function Header(props) {
  const { title, rounded=false, variant="h6" } = props;
  let style = {...props.sx};
  if (rounded) {
    style.borderTopLeftRadius = 4;
    style.borderTopRightRadius = 4;
  }
  return (
    <Paper elevation={0} square sx={style}>
      <Box flex={1} display="flex" justifyContent="center">
        <Typography variant={variant}>{ title }</Typography>
      </Box>
    </Paper>
  )
}

const ButtonHoverOutlined = styled(ButtonBase)(({theme}) => ({
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    outline: '1px solid'
  },
}))

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

export default function Augments(props) {
  const { wep, augments, myAugments, setMyAugments } = props;

  let rank = (wep.Rarity < 9) ? 'HR' : 'MR';
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  // TODO: handleClose func
  let dialogProps = {...props, open: open, augments: augments[rank]};

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

  return (
    <Box sx={{...props.sx}}>
      <Header rounded title='Augments' variant='body1'/>
    </Box>
  )
}
