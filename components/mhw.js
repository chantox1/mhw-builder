import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Toolbar } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ModeIcon from '@mui/icons-material/Mode';
import update from 'immutability-helper';
import ArmorCard from './armor_card';
import WepCard from './wep_card';
import SearchDialog from './search_equip';

function pushSkill(skillDict, skill) {
  const [id, lvl] = skill;
  if (!(id in skillDict)) {
    skillDict[id] = skill
  }
  else {
    skillDict[id][1] += lvl
  }
}

function applySkillLvlMax(data, skillDict) {
  for (const key in skillDict) {
    let [id, lvl] = skillDict[key];
    const s = data.skills[id];

    let secret = false;
    if ('Unlock' in s) {
      for (const i in s.Unlock) {
        const [u_id, u_lvl] = s.Unlock[i];
        if (u_id in skillDict) {
          if (skillDict[u_id][1] >= u_lvl) {
            secret = true;
            break;
          }
        }
      }
    }
    let max = secret ? s.MaxSecret : s.Max;

    if (lvl > max) {
      skillDict[key][1] = max;
    }
  }
}

export default function Builder(data) {
  const [open, setOpen] = React.useState(false);
  const [equipItem, setEquipItem] = React.useState()
  const [searchClass, setSearchClass] = React.useState(0);

  // Opens the dialog according to an equipped item 'value'
  // if value is a weapon, default to searching for the same class
  const handleClickOpen = (value) => {
    if (value.Mode == 2) {
      setSearchClass(value.Wep.Class);
    }
    setEquipItem(value);
    setOpen(true);
  };

  const [equip, setEquip] = React.useState([
    data.armor[0],        // Head
    data.armor[667],      // Chest
    data.armor[1284],     // Arms
    data.armor[1899],     // Waist
    data.armor[2508],     // Legs
    data.armor[3123],     // Charm
    {...data.weapons[0][10], 'Class': 0}
  ]);

  // Replaces equipped item/deco by that passed from the equip search
  const handleClose = (value) => {
    setOpen(false);

    if (equipItem.Mode == 1) {
      setEquip(update(equip, {
        [equipItem.Type]: {Slots: {[equipItem.Pos]: {$set: value}}}
      }))
    }
    else if (equipItem.Mode == 2) {
      setEquip(update(equip, {
        [6]: {$set: value}
      }))
    }
    else {
      setEquip(update(equip, {
        [value.Type]: {$set: value}
      }))
    }
  };

  const [mySkills, setMySkills] = React.useState({})
  const [toggleList, setToggleList] = React.useState([])  // TODO: toggleList should contain the default toggle of ALL effects

  React.useEffect(() => {
    var tempSkills = {}
    let e = JSON.parse(JSON.stringify(equip))  // Deep clone
    e.forEach(a => {
      if ('SetSkill' in a) {
        const s = [a.SetSkill, 1]
        pushSkill(tempSkills, s);
      }

      if ('Skill' in a) {
        const s = [a.Skill, 1]
        pushSkill(tempSkills, s);
      }

      if ('Skills' in a) {
        a.Skills.forEach(s => pushSkill(tempSkills, s));
      }

      a.Slots.forEach(sl => {
        if (typeof(sl) != "number") {
          sl.Deco.Skills.forEach(s => pushSkill(tempSkills, s));
        }
      })
    });
    applySkillLvlMax(data, tempSkills);
    setMySkills(tempSkills);
  }, [equip]);

  const [calcs, setCalcs] = React.useState();

  React.useEffect(() => {
    let e = JSON.parse(JSON.stringify(mySkills));
    const classNo = 50;  // TODO: Set proper size
    let bonusBucket = Array.from(Array(classNo), () => new Array())
    for (const key in e) {
      if (key in data.skillBonus) {
        const bonuses = data.skillBonus[key];
        for (var i=0; i < bonuses.length; i++) {
          bonusBucket[bonuses[i].effect.class].push([key, bonuses[i]])
        }
      }
    }
    console.log(bonusBucket);

    // TODO: calcs w/ bucket
  }, [mySkills, toggleList])

  const theme = useTheme();
  const breakPoint = theme.breakpoints.values[
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.only(key));

      return !output && matches ? key : output;
    }, null) || 'xs'
  ]
  const equipBlockStyle = (breakPoint > theme.breakpoints.values.lg) ? {height: "76.5vh"} : {}
  console.log("style:")
  console.log(equipBlockStyle)

  return (
    <div>

    <Box
      sx={{
        mb: 1,
        backgroundColor: 'primary.main',
      }}
    >
      <Toolbar>
        <ModeIcon sx={{ mr: 2 }}/>
        <Typography variant="h4"> New Set (placeholder) </Typography>
      </Toolbar>
    </Box>

    <Grid container wrap="wrap-reverse" spacing={1}>
      <Grid item xs={12} sm={2.5}>
          <Paper style={{height: "82vh", overflow: 'auto'}}>
            {(() => {
                let e = JSON.parse(JSON.stringify(mySkills));
                return (
                  Object.values(e)
                  .sort((a, b) => (a[1] - b[1]))
                  .reverse()
                  .map(s => {
                    const [id, lvl] = s;
                    return (
                      <Typography>
                        { data.skillString[data.skills[id].Name] + " " + lvl }
                      </Typography>
                    )
                  })
                )
            })()}
          </Paper>
      </Grid>

      <Grid item xs={12} sm={9.5}>
          <Paper style={{height: "5vh", marginBottom: "0.5vh"}}>
            {/* Active effect icons */}
          </Paper>

          <Grid container spacing={"0.5vh"}>
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column" sx={equipBlockStyle}>
                <WepCard main data={data} wep={equip[6]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.5vh", padding:2 }}/>
                <ArmorCard main data={data} armor={equip[0]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.6vh", padding:0.3 }}/>
                <ArmorCard main data={data} armor={equip[1]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.6vh", padding:0.3 }}/>
                <ArmorCard main data={data} armor={equip[2]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.6vh", padding:0.3 }}/>
                <ArmorCard main data={data} armor={equip[3]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.6vh", padding:0.3 }}/>
                <ArmorCard main data={data} armor={equip[4]} onClick={handleClickOpen} sx={{ flexGrow: 1, marginBottom: "0.6vh", padding:0.3 }}/>
                <ArmorCard charm data={data} armor={equip[5]} onClick={handleClickOpen} sx={{ flexGrow: 1, padding:0.3 }}/>
              </Box>

              {open &&
              <SearchDialog
                data={data}
                open={open}
                equipItem={equipItem}
                searchClass={searchClass}
                setSearchClass={setSearchClass}
                onClose={handleClose}
              />}
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper style={{height: "13vh", marginBottom: "0.5vh"}}>
                {/* Safi/Gun mod zone */}
              </Paper>
              <Paper style={{height: "63vh", padding: "1vh"}}>
                {/* Calcs */}
              </Paper>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
    </div>
  );
}