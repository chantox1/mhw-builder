import * as React from 'react';
import { Box, ButtonBase, Dialog, Divider, Paper, styled, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";
import { range } from '../src/util';
import update from 'immutability-helper';

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

const roman = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
  '4': 'IV',
  '5': 'V',
  '6': 'VI'
};

const unique = [
  'Defense',
  'Slot'
];

// TODO: Translate types here and in safi.json
const color = {
  'Attack': 'Maroon',
  'Defense': 'Sienna',
  'Affinity': 'Purple',
  'Element': 'DarkGoldenRod',
  'Status': 'DarkGoldenRod',
  'Slot': 'SteelBlue',
  'Sharp': 'DimGray',
}

class Awakening {
  constructor(type, lvl, value) {
    this.type = type;
    this.lvl = lvl;
    this.value = value;
  }

  lvlString() {
    return roman[this.lvl];
  }

  toString() {
    return `${this.type} ${this.lvlString()}`;
  }

  isUnique() {
    return unique.includes(this.type);
  }

  getColor() {
    return color[this.type];
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
    let cells = [<TableCell key={6} sx={{backgroundColor: color[key]}}><Typography>{ key }</Typography></TableCell>];
    for (let i=0; i < 6; i++) {
      let cellProps = {'key': i};
      const value = myAbilities[key][i];
      if (value) {
        cellProps.entry = new Awakening(key, i+1, value);
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

export function AwakenedAbilities(props) {
  const { wepClass, abilities, awakens, setAwakens } = props;

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const openDialog = (index) => {
    setOpen(true);
    setIndex(index);
  }

  const onClose = (value, pos) => {
    setOpen(false);
    if (!value) {
      return
    }
    let spliceArgs = [];
    if (value.lvl == 6) {
      awakens.forEach((awakening, index) => {
        if (index != pos && awakening && awakening.lvl == 6) {
          spliceArgs.push([index, 1, null]);
        }
      })
    }
    if (value.isUnique()) {
      awakens.forEach((awakening, index) => {
        if (index != pos && awakening && awakening.type == value.type) {
          spliceArgs.push([index, 1, null]);
        }
      })
    }
    setAwakens(update(awakens, {
      [pos]: {$set: value},
      $splice: spliceArgs
    }))
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
