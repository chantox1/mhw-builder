import * as React from 'react';
import PropTypes from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ModeIcon from '@mui/icons-material/Mode';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import update from 'immutability-helper';
import ArmorCard from './armor_card';
import SimpleDialog from './search_equip';

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

    const handleClickOpen = (value) => {
      setEquipItem(value);
      setOpen(true);
    };

    const handleClose = (value) => {
      setOpen(false);

      if (equipItem.Mode == 1) {
        setEquip(update(equip, {
          [equipItem.Type]: {Slots: {[equipItem.Pos]: {$set: value}}}
        }))
      }
      else {
        setEquip(update(equip, {
          [value.Type]: {$set: value}
        }))
      }
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

            <Paper style={{height: "12vh", marginBottom: "0.5vh"}}>
              {/* Weapon */}
            </Paper>

            <Grid container spacing={1}>
              <Grid item xs={12} md={8}>
                <ArmorCard main data={data} armor={equip[0]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>
                <ArmorCard main data={data} armor={equip[1]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>
                <ArmorCard main data={data} armor={equip[2]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>
                <ArmorCard main data={data} armor={equip[3]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>
                <ArmorCard main data={data} armor={equip[4]} onClick={handleClickOpen} style={{ height: "10vh", marginBottom: "0.6vh", padding:2 }}/>
                <ArmorCard charm data={data} armor={equip[5]} onClick={handleClickOpen} style={{ height: "11vh", padding:2 }}/>

                {open &&
                <SimpleDialog
                  data={data}
                  equipItem={equipItem}
                  open={open}
                  onClose={handleClose}
                />}
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper style={{height: "64vh", padding: "1vh"}}>
                  {/* Calcs */}
                </Paper>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
      </div>
    );
}