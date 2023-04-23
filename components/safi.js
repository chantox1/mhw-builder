import * as React from 'react';
import { Box, ButtonBase, Dialog, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import update from 'immutability-helper';
import { WeaponAugmentMR, color } from '../src/equipment';
import Header from './header';

const TableCellAlignCenter = React.forwardRef((props, ref) => 
    <TableCell align='center' {...props} ref={ref}>
      { props.children }
    </TableCell>)

const ButtonCell = (props) => (
  <ButtonBase
    {...props}
    component={TableCellAlignCenter}
    sx={{display: "table-cell", px: 1.5, py: 1}}
  >
    { props.children }
  </ButtonBase>
)

function AwakeningSelectDialog(props) {
  const { open, onClose, wepClass, abilities, awakens, pos } = props;
  const myAbilities = abilities.Weapon[wepClass];

  const handleClose = () => {
    onClose(null, pos);
  }

  const handleListItemClick = (value) => {
    onClose(value, pos);
  }

  const AbilityCell = (props) => {
    const { entry=undefined } = props;
    const theme = useTheme();
    let buttonProps = {};
    let textProps = {};
    let displayText = '';
    if (entry) {
      displayText = entry.lvlString();
      buttonProps.onClick = () => handleListItemClick(entry);
      buttonProps.style = {};
      // buttonProps.style.backgroundColor = theme.palette.background.paper;
    }
    else {
      buttonProps.disabled = true;
      textProps.color = 'text.disabled';
      buttonProps.style = {};
      buttonProps.style.backgroundColor = theme.palette.background.paper;
    }
    return (
      <ButtonCell {...buttonProps}>
        <Typography {...textProps} noWrap variant='body2'>
          { displayText }
        </Typography>
      </ButtonCell>
    )
  }

  let tableRows = [];
  Object.keys(myAbilities).forEach(key => {
    let cells = [
      <TableCell key={6} sx={{backgroundColor: color[key]}}>
        <Typography>{ key }</Typography>
      </TableCell>
    ];
    for (let i=0; i < 6; i++) {
      let cellProps = {'key': i};
      const value = myAbilities[key][i];
      if (value != null) {
        cellProps.entry = new WeaponAugmentMR(key, i+1, value);
      }
      cells.push(
        <AbilityCell {...cellProps}/>
      )
    }
    tableRows.push(<TableRow hover key={key}>{ cells }</TableRow>)
  })

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xl'>
      <Header rounded title='Awakening Abilities'/>
      <TableContainer>
        <Table size='small' variant='grid'>
          <TableBody>
            { tableRows }
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  )
}

const ButtonHoverOutlined = styled(ButtonBase)(({theme}) => ({
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    outline: '1px solid'
  },
}))

export default function AwakenedAbilities(props) {
  const { wepClass, abilities, awakens, setAwakens } = props;

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const openDialog = (index) => {
    setOpen(true);
    setIndex(index);
  }

  const onClose = (entry, pos) => {
    setOpen(false);
    if (!entry) {
      return;
    }

    let spliceArgs = [];
    let lvl6Pos = -1;
    let lvl6Entry = null;
    if (entry.lvl == 6) {
      awakens.forEach((awakening, index) => {
        if (index != pos && awakening && awakening.lvl == 6) {
          lvl6Pos = index;
          lvl6Entry = awakening;
          lvl6Entry.lvl -= 1;
        }
      })
    }
    if (entry.isUnique()) {
      awakens.forEach((awakening, index) => {
        if (index != pos && awakening && entry.isIncompatible(awakening)) {
          spliceArgs.push([index, 1, null]);
        }
      })
    }
    if (lvl6Pos == -1) {
      setAwakens(update(awakens, {
        [pos]: {$set: entry},
        $splice: spliceArgs
      }))
    }
    else {
      setAwakens(update(awakens, {
        [pos]: {$set: entry},
        [lvl6Pos]: {$set: lvl6Entry},
        $splice: spliceArgs
      }))
    }
  }

  let awakeningDisplay = [];
  awakens.forEach((awakening, index) => {
    let displayText = 'None';
    let buttonStyle = {};
    if (awakening) {
      displayText = awakening.toString();
      buttonStyle.backgroundColor = awakening.getColor();
    }
    awakeningDisplay.push(
      <ButtonHoverOutlined
        key={index}
        onClick={() => openDialog(index)}
        sx={{...buttonStyle}}
      >
        <Typography variant='body2'>
          { displayText }
        </Typography>
      </ButtonHoverOutlined>
    )
  })

  const AwakeningDisplay = () => {
    return (
      <Paper sx={{display: 'flex', flexDirection: 'column'}}>
        { awakeningDisplay }
      </Paper>
    )
  }

  return (
    <Box sx={{...props.sx}}>
      <Header rounded title='Awakens' variant='body1'/>
      <AwakeningDisplay/>
      <AwakeningSelectDialog
        {...props}
        open={open}
        onClose={onClose}
        pos={index}
      />
    </Box>
  )
}
