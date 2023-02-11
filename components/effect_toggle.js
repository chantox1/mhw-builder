import * as React from 'react';
import { Dialog, Paper } from '@mui/material';
import { Typography } from '@mui/material';
import { InputAdornment, TextField, Switch, FormControlLabel } from '@mui/material';
import { Box } from '@mui/material';
import { ButtonBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import { Virtuoso } from 'react-virtuoso';
import { useMeasure } from 'react-use';
import update from 'immutability-helper';
import Sprite from './sprite';

const GroupIcon = (props) => {
  const { groupId, groupName, activeGroup, onClick } = props;
  let  buttonStyle = {
    ...props.sx,
    border: 1,
    borderRadius: 1,
    borderColor: 'text.secondary',
    mr: 0.5,
    p: 0.5
  }
  if (groupId == activeGroup) {
    buttonStyle.backgroundColor = 'secondary.main';
  }
  return (
    <ButtonBase
      onClick={() => onClick(groupId)}
      sx={buttonStyle}
      display='flex'
    >

      <Typography variant='button'>
        { groupName }
      </Typography>
    </ButtonBase>
  )
}

const GroupIconDisplay = (props) => {
  const { groups, activeGroup, onClick } = props;
  return (
    groups.map((group, index) => {
      return (
        <GroupIcon
          groupId={index}
          groupName={group}
          activeGroup={activeGroup}
          onClick={onClick}
        />
      )
    })
  )
}

export default function ToggleDialog(props) {
  const { data, toggleMap, setToggleMap, open, onClose } = props;

  function flipToggle(key) {
    return (event) => {
      setToggleMap(
        {...toggleMap, [key]: event.target.checked}
      );
    }
  }

  // Get dialog dimensions
  const [outerRef, { height: oHeight }] = useMeasure();
  const [lowerRef, { height: lHeight}] = useMeasure();
  var actualHeight = oHeight - lHeight;

  const [activeGroup, setActiveGroup] = React.useState(0);
  const groups = ['Skills', 'Food', 'Items', 'Weapon' ]

  var queryData = Object.entries(data.toggleData)
  .filter(entry => (entry[1].group == activeGroup));

  const InnerItem = ({index}) => {
    const [key, item] = queryData[index];

    switch(item.group) {
      case 0:
        var name = data.skillString[item.name];
        if ('append' in item) {
          name += item.append;
        }
        break;
      case 2:
        var name = data.decoString[item.name];
        break;
      default:
        var name = item.name;
    }
    let switchProps = {
      color: 'secondary',
      checked: toggleMap[key],
      onChange: flipToggle(key)
    }
    if ('incompatible' in item) {
      if (toggleMap[item.incompatible]) {
        switchProps.disabled = true;
      }
    }
    return (
      <Box pb={0.5}>
        <Paper
          sx={{
            display: 'flex',
            border: 1,
            borderRadius: 1,
            borderColor: 'text.secondary',
            p: 0.5
          }}
        >
          { 'sprite' in item && 
            <Sprite
              {...item.sprite}
              sx={{
                alignSelf: 'center',
                mr: 0.5
              }}
            />
          }
          { 'src' in item &&
            <Box
              width={32}
              height={32}
              component='img'
              src={item.src}
              mr={0.5}
            />
          }
          <Typography alignSelf='center' flex={1}>
            { name }
          </Typography>
          <Switch
            {...switchProps}
          />
        </Paper>
      </Box>
    )
  }

  return (
    <Box ref={outerRef} style={{height: "75vh", position: "absolute"}}>
      <Dialog maxWidth='md' onClose={onClose} open={open}>
        <Box p={1}>
          <Virtuoso
            style={{ height: actualHeight }}
            totalCount={queryData.length}
            itemContent={index =>
              <InnerItem index={index}/>
            }
          />
        </Box>

        <div ref={lowerRef}>
          <Box
            display='flex'
            flexWrap='wrap'
            sx={{ml: 1, mr: 0.5, mb: 0.5}}
          >
            <GroupIconDisplay
              groups={groups}
              activeGroup={activeGroup}
              onClick={setActiveGroup}
            />
          </Box>
        </div>
      </Dialog>
    </Box>
  )
}
