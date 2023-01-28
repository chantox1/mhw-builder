import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { Button, Container, InputAdornment, Paper, TextField } from '@mui/material';
import { Box } from '@mui/material';
import ArmorCard from './armor_card';
import WepCard from './wep_card';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonBase } from '@mui/material';
import { Card, CardMedia, CardContent} from '@mui/material';
import { Grid } from '@mui/material'
import { FixedSizeList } from 'react-window';
import { useMeasure } from 'react-use';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { range } from '../src/util';

function queryDeco(data, deco, queryString) {
  var res = data.decoString[deco.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1;
  deco.Skills.forEach(s => {
    if (res) {
      return res;
    }
    res ||= data.skillString[data.skills[s[0]].Name]
            .toLowerCase().indexOf(queryString.toLowerCase()) > -1
  });
  return res;
}

const WepButton = (props) => (
  <ButtonBase
    onClick={() => props.onClick(props.class)}
    sx={{...props.sx, p: 0.2}}
  >
    <Box
      maxHeight={36}
      maxWidth={36}
      component="img"
      src={'/icon/Wep/' + props.class.toString() + '/1.png'}
    />
  </ButtonBase>
)

export default function SearchDialog(props) {
  const { data, open, equipItem, searchClass, setSearchClass, onClose } = props;

  // Get dialog dimensions
  const [outerRef, { height }] = useMeasure();

  // Store user input
  const [userInput, setInput] = React.useState("");  // This is set as the user types
  const [queryString, setQryString] = React.useState("");  // This is set some time after the user stops typing
  React.useEffect(() => {
    const timeOutId = setTimeout(() => setQryString(userInput), 500);
    return () => clearTimeout(timeOutId);
  }, [userInput]);

  const handleClose = () => {
    if (equipItem.Mode == 1) {
      onClose(equipItem.Item)
    }
    else if (equipItem.Mode == 2) {
      onClose(equipItem.Wep)
    }
    else {
      onClose(equipItem);
    }
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  if (equipItem.Mode == 1) {
    var searchLabel = "Decoration search"
    var queryData = data.decos
    .filter(d => d.Size <= equipItem.Size)
    .filter(d => queryDeco(data, d, queryString))
    .sort((a, b) => data.decoString[a.Name].localeCompare(data.decoString[b.Name]))
  }
  else if (equipItem.Mode == 2) {
    var searchLabel = "Weapon search"
    var queryData = Object.values(data.weapons[searchClass])
    .filter(w => ( data.weaponString[searchClass][w.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1))
    .sort((a, b) => data.weaponString[searchClass][a.Name].localeCompare(data.weaponString[searchClass][b.Name]))
  }
  else {
    var searchLabel = "Equipment search"
    var queryData = Object.values(data.armor)
    .filter(a => a.Type == equipItem.Type)
    .filter(a => ( data.armorString[a.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("Layered") == -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("HARDUMMY") == -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("Unavailable") == -1 ))
    .sort((a, b) => data.armorString[a.Name].localeCompare(data.armorString[b.Name]))
  }

  var innerStyle = {p: 1}
  const theme = useTheme();
  const breakPoint = theme.breakpoints.values[
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.only(key));

      return !output && matches ? key : output;
    }, null) || 'xs'
  ]

  if (breakPoint > theme.breakpoints.values.lg) {
    var heightMod = [7.5, 25, 5.8];
    innerStyle['width'] = 900;
  }
  else if (breakPoint > theme.breakpoints.values.md) {
    var heightMod = [6, 25, 4.5];
    innerStyle['width'] = 900;
  }
  else if (breakPoint > theme.breakpoints.values.xs) {
    var heightMod = [6, 17, 4];
    innerStyle['width'] = 700;
  }
  else {
    var heightMod = [4, 17, 3.2];
  }

  {/* TODO: Autofocus textfield */}
  return (
    <Box ref={outerRef} style={{height: "75vh"}}>
      <Dialog maxWidth='md' onClose={handleClose} open={open}>
        <Box sx={innerStyle}>
          <TextField onChange={e => setInput(e.target.value)} sx={{mb: 1}}
            color='secondary'
            label={searchLabel}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon/>
                </InputAdornment>
              )
            }}
          />

          {equipItem.Mode == 1 &&
            <FixedSizeList
              height={height}
              width="100%"
              itemSize={height / heightMod[1] + 2}
              itemCount={queryData.length}
              overscanCount={10}
            >
              {({ index, style }) => {
                var d = queryData[index]
                return (
                  <div style={{...style, height: (height / heightMod[1] + 2), marginBottom: 2}}>
                  <ButtonBase
                    sx={{
                      display: "flex", justifyContent: "left", textAlign: "left", width: "100%",
                      border: 1, borderRadius: 1, borderColor: 'text.secondary'
                    }}
                    onClick = {() => handleListItemClick({Size: equipItem.Size, Deco: d})}
                  >
                    <Card sx={{ display: "flex", p:0.2, flexGrow: 1 }}>
                      <CardMedia sx={{ maxWidth: 24, objectFit: "contain"}}
                        component="img"
                        image={"/icon/Slot/" + d.Size + ".png"}
                      />
                      <CardContent sx={{ p:0, '&:last-child': { pb: 0 }}}>
                        <Typography noWrap> { data.decoString[d.Name] } </Typography>
                      </CardContent>
                    </Card>
                  </ButtonBase>
                  </div>
                )
              }}
            </FixedSizeList>
          }

          { equipItem.Mode == 2 &&
            <FixedSizeList
              height={height}
              width="100%"
              itemSize={height / heightMod[2] + 2}
              itemCount={queryData.length}
              overscanCount={5}
            >
              {({ index, style }) => {
                return (
                  <WepCard
                    data={data}
                    wep={{...queryData[index], 'Class': searchClass}}
                    onClick={handleListItemClick}
                    sx={{...style, width: "100%", height: (height / heightMod[2]), mb: 2}}
                  />
                )
              }}
            </FixedSizeList>
          }

          { equipItem.Mode === undefined &&
            <FixedSizeList
              height={height}
              width="100%"
              itemSize={height / heightMod[0] + 2}
              itemCount={queryData.length}
              overscanCount={5}
            >
              {({ index, style }) => {
                return (
                  <ArmorCard
                    data={data}
                    charm={equipItem.Type == 5}
                    armor={queryData[index]}
                    onClick={handleListItemClick}
                    sx={{...style, width: "100%", height: (height / heightMod[0]), mb: 2}}
                  />
                )
              }}
            </FixedSizeList>
          }
        </Box>

        { equipItem.Mode == 2 &&
          <Box
            display="flex"
            flexWrap="wrap"
            sx={{ml: 1, mr: 0.5, mb: 0.5}}
          >
            { range(0,10).map(i => {
              let sx = {border: 1, borderRadius: 1, borderColor: 'text.secondary', mr: 0.5}
              if (i == searchClass) {
                sx.border = 2
                sx.borderColor = 'secondary.main'
              }
              return (
                <WepButton
                  class={i}
                  onClick={setSearchClass}
                  sx={sx}
                />
              )
            })}
          </Box>
        }
      </Dialog>
    </Box>
  );
}