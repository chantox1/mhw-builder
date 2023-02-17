import * as React from 'react';
import { Dialog } from '@mui/material';
import { Typography } from '@mui/material';
import { InputAdornment, TextField, Switch, FormControlLabel } from '@mui/material';
import { Box } from '@mui/material';
import { ButtonBase } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SearchIcon from '@mui/icons-material/Search';
import { Virtuoso } from 'react-virtuoso';
import { useMeasure } from 'react-use';
import Sprite from './sprite';
import ArmorCard from './armor_card';
import WepCard from './wep_card';
import MantleCard from './mantle_card';


function startsWithFirst(a, b, queryString) {
  const aStarts = a.toLowerCase().startsWith(queryString);
  const bStarts = b.toLowerCase().startsWith(queryString);
  if (aStarts) {
    if (bStarts) {
      return a.localeCompare(b);
    }
    return -1;
  }
  else {
    if (bStarts) {
      return 1;
    }
    return a.localeCompare(b);
  }
}

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

function decoSorter(data, queryString) {
  return function(a, b) {
    const sortBySize = b.Size - a.Size
    return sortBySize ? sortBySize :
    startsWithFirst(
      data.decoString[a.Name],
      data.decoString[b.Name],
      queryString
    );
  };
}

function weaponSorter(data, searchClass, queryString) {
  return function(a, b) {
    return startsWithFirst(
      data.weaponString[searchClass][a.Name],
      data.weaponString[searchClass][b.Name],
      queryString
    );
  };
}

function armorSorter(data, queryString) {
  return function(a, b) {
    return startsWithFirst(
      data.armorString[a.Name],
      data.armorString[b.Name],
      queryString
    );
  };
}

const WepButton = (props) => (
  <ButtonBase
    onClick={() => props.onClick(props.class)}
    sx={{...props.sx, p: 0.2}}
  >
    <Box
      height={36}
      width={36}
      component="img"
      src={'/icon/Wep/' + props.class.toString() + '.png'}
    />
  </ButtonBase>
)

class SearchField extends React.Component {
  constructor(props) {
    super(props);
    this.setInput = props.setInput;
    this.label = props.label;
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus()
  }

  render() {
    return (
      <TextField inputRef={this.inputRef} onChange={e => this.setInput(e.target.value)} sx={{mb: 1}}
        color='secondary'
        label={this.label}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          )
        }}
      />
    )
  }
}

function SearchFild(props) {
  const { setInput, label } = props;
  return (
    <TextField autoFocus onChange={e => setInput(e.target.value)} sx={{mb: 1}}
      color='secondary'
      label={label}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon/>
          </InputAdornment>
        )
      }}
    />
  )
}


export default function SearchDialog(props) {
  const { data, open, equipItem, searchClass, setSearchClass, onClose } = props;

  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  })

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
    else if (equipItem.Mode == 3) {
      onClose(equipItem.Mantle)
    }
    else {
      onClose(equipItem);
    }
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };
  
  const [plus, setPlus] = React.useState(true);
  const togglePlus = (event) => {
    setPlus(event.target.checked);
  }

  // Get dialog dimensions
  const [outerRef, { height: oHeight }] = useMeasure();
  const [lowerRef, { height: lHeight}] = useMeasure();

  if (equipItem.Mode == 1) {
    var searchLabel = "Decoration search";
    var queryData = data.decos
    .filter(d => d.Size <= equipItem.Size)
    .filter(d => queryDeco(data, d, queryString))
    .sort(decoSorter(data, queryString));

    const DecoItem = ({ index }) => {
      var d = queryData[index]
      return (
        <Box pb={0.3}>
          <ButtonBase
            sx={{
              display: "flex", justifyContent: "left", textAlign: "left", width: "100%",
              border: 1, borderRadius: 1, borderColor: 'text.secondary'
            }}
            onClick = {() => handleListItemClick({Size: equipItem.Size, Deco: d})}
          >
            <Sprite
              src='/icon/gems.png'
              pos={[64*(d.Size - 1),64*d.Color]}
              width={27}
              crop={[64,64]}
            />
            <Typography noWrap> { data.decoString[d.Name] } </Typography>
          </ButtonBase>
        </Box>
      )
    }

    var InnerItem = React.memo(({index}) => {
      return <DecoItem index={index}/>
    })
  }
  else if (equipItem.Mode == 2) {
    var searchLabel = "Weapon search";
    var queryData = Object.values(data.weapons[searchClass])
    .filter(w => ( data.weaponString[searchClass][w.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1))
    .sort(weaponSorter(data, searchClass, queryString));

    const WepItem = ({index}) => {
      return (
        <Box pb={0.5}>
          <WepCard
            key={index}
            data={data}
            wep={{...queryData[index], 'Class': searchClass}}
            onClick={handleListItemClick}
          />
        </Box>
      )
    }

    var InnerItem = React.memo(({index}) => {
      return <WepItem index={index}/>
    })
  }
  else if (equipItem.Mode == 3) {
    var searchLabel = "Mantle search";
    var queryData = Object.values(data.mantles)
    .filter(m => ( plus ? m.Slots.length > 0 : m.Slots.length == 0 ))
    .filter(m => ( data.mantleString[m.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1 ));

    const MantleItem = ({ index }) => {
      return (
        <Box pb={0.5}>
          <MantleCard
            key={index}
            data={data}
            mantle={queryData[index]}
            onClick={handleListItemClick}
          />
        </Box>
      )
    }

    var InnerItem = React.memo(({index}) => {
      return <MantleItem index={index}/>
    })
  }
  else {
    var searchLabel = "Equipment search";
    var queryData = Object.values(data.armor)
    .filter(a => a.Type == equipItem.Type)
    .filter(a => ( data.armorString[a.Name].toLowerCase().indexOf(queryString.toLowerCase()) > -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("Layered") == -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("HARDUMMY") == -1 ))
    .filter(a => ( data.armorString[a.Name].indexOf("Unavailable") == -1 ))
    .sort(armorSorter(data, queryString));

    const ArmorItem = ({ index }) => {
      return (
        <Box pb={0.5}>
          <ArmorCard
            key={index}
            data={data}
            charm={equipItem.Type == 5}
            armor={queryData[index]}
            onClick={handleListItemClick}
          />
        </Box>
      )
    }

    var InnerItem = React.memo(({index}) => {
      return <ArmorItem index={index}/>
    })
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
    innerStyle['width'] = 900;
  }
  else if (breakPoint > theme.breakpoints.values.md) {
    innerStyle['width'] = 900;
  }
  else if (breakPoint > theme.breakpoints.values.xs) {
    innerStyle['width'] = 700;
  }

  var actualHeight = oHeight - lHeight;

  return (
    <Box ref={outerRef} style={{height: "75vh", position: "absolute"}}>
      <Dialog maxWidth='md' onClose={handleClose} open={open}>
        <Box sx={innerStyle}>
          <SearchField label={searchLabel} setInput={setInput} />
          <Virtuoso
            style={{ height: actualHeight }}
            totalCount={queryData.length}
            itemContent={index =>
              <InnerItem index={index}/>
            }
          />
        </Box>

        { equipItem.Mode == 2 &&
          <div ref={lowerRef}>
            <Box
              display="flex"
              flexWrap="wrap"
              sx={{ml: 1, mr: 0.5, mb: 0.5}}
            >
              { [0,3,1,2,4,5,6,7,8,9,10].map(i => {
                let sx = {border: 1, borderRadius: 1, borderColor: 'text.secondary', mr: 0.5}
                if (i == searchClass) {
                  sx.backgroundColor = 'secondary.main'
                }
                return (
                  <WepButton
                    key={i}
                    class={i}
                    onClick={setSearchClass}
                    sx={sx}
                  />
                )
              })}
            </Box>
          </div>
        }
        {equipItem.Mode == 3 &&
          <div ref={lowerRef}>
            <Box
              ref={lowerRef}
              sx={{ml: 1}}
            >
              <FormControlLabel
                label="+"
                control={
                  <Switch
                    color="secondary"
                    checked={plus}
                    onChange={togglePlus}
                  />
                }
              />
            </Box>
          </div>
        }
      </Dialog>
    </Box>
  );
}
