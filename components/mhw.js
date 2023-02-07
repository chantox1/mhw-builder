import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { Paper, Toolbar } from '@mui/material';
import { IconButton } from '@mui/material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import ModeIcon from '@mui/icons-material/Mode';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import update from 'immutability-helper';
import ArmorCard from './armor_card';
import WepCard from './wep_card';
import MantleCard from './mantle_card';
import SkillCard from './skill_card';
import SearchDialog from './search_equip';
import { useScreenshot, createFileName } from 'use-react-screenshot';

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
    skillDict[key][2] = secret;

    let max = secret ? s.MaxSecret : s.Max;
    if (lvl >= max) {
      skillDict[key][1] = max;
      skillDict[key][3] = true;
    }
    else {
      skillDict[key][3] = false;
    }
  }
}

export default function Builder(data) {
  const screenshotRef = React.useRef(null);
  const [image, takeScreenShot] = useScreenshot({scale: 2});

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const getImage = () => {
    takeScreenShot(screenshotRef.current)
    .then((img) => download(img, {name: "New set"}))
  };

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

  const [equip, setEquip] = React.useState({
    "Armor": {
      "0": data.armor[0],     // Head
      "1": data.armor[667],   // Chest
      "2": data.armor[1284],  // Arms
      "3": data.armor[1899],  // Waist
      "4": data.armor[2508],  // Legs
      "5": data.armor[3123]   // Charm
    },
    "Weapon": {...data.weapons[0][10], 'Class': 0},
    "Mantle": {
      "0": null,
      "1": null,
    }
  });

  const handleClose = (value) => {
    setOpen(false);

    // Set slot
    if (equipItem.Mode == 1) {
      if (equipItem.Type <= 5) {
        setEquip(update(equip, {
          Armor: {
            [equipItem.Type]: {
              Slots: {
                [equipItem.Pos]: {
                  $set: value
                }
              }
            }
          }
        }))
      }
      else if (equipItem.Type == 6) {
        setEquip(update(equip, {
          Weapon: {
            Slots: {
              [equipItem.Pos]: {
                $set: value
              }
            }
          }
        }))
      }
      else if (equipItem.Type == 7) {
        setEquip(update(equip, {
          Mantle: {
            [equipItem.Pos[0]]: {
              Slots: {
                [equipItem.Pos[1]]: {
                  $set: value
                }
              }
            }
          }
        }))
      }
    }
    // Set weapon
    else if (equipItem.Mode == 2) {
      setEquip(update(equip, {
        Weapon: {$set: value}
      }))
    }
    // Set mantle
    else if (equipItem.Mode == 3) {
      setEquip(update(equip, {
        Mantle: {
          [equipItem.Pos]: {
            $set: value
          }
        }
      }))
    }
    // Set armor
    else {
      setEquip(update(equip, {
        Armor: {
          [value.Type]: {$set: value}
        }
      }))
    }
  };

  const [mySkills, setMySkills] = React.useState({})
  const [toggleList, setToggleList] = React.useState([])  // TODO: toggleList should contain the default toggle of ALL effects

  React.useEffect(() => {
    var tempSkills = {}
    let e = JSON.parse(JSON.stringify(equip))  // Deep clone
    Object.values(e.Armor).forEach(a => {
      if ('SetSkill' in a) {
        const s = [a.SetSkill, 1];
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

    let w = e.Weapon;
    if ('Skill' in w) {
      const s = [w.Skill, 1];
      pushSkill(tempSkills, s);
    }
    w.Slots.forEach(sl => {
      if (typeof(sl) != "number") {
        sl.Deco.Skills.forEach(s => pushSkill(tempSkills, s));
      }
    });

    applySkillLvlMax(data, tempSkills);
    setMySkills(tempSkills);

    // Set base stats
    setMyAttack(equip.Weapon.Damage);
    setMyAffinity(equip.Weapon.Affinity);
    setMyEle('Element' in equip.Weapon ? equip.Weapon.Element : 0);
    setMyEleDmg('Element' in equip.Weapon ? equip.Weapon.ElementDmg : 0);
  }, [equip]);
    
  const [myAttack, setMyAttack] = React.useState(equip.Weapon.Damage);
  const [myAffinity, setMyAffinity] = React.useState(equip.Weapon.Affinity);
  const [myEle, setMyEle] = React.useState(
    'Element' in equip.Weapon ? equip.Weapon.Element : 0
  );
  const [myEleDmg, setMyEleDmg] = React.useState(
    'Element' in equip.Weapon ? equip.Weapon.ElementDmg : 0
  );

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

    let calcs = {
      "Attack": myAttack,
      "Affinity": myAffinity,
      "Element": myEle,
      "EleDmg": myEleDmg,
    }

    let rawCap = myAttack * data.attackCap;
    let eleDmgCap = Math.max(myEleDmg * data.elementCap[0],
                             myEleDmg + data.elementCap[1]);

    for (var i=0; i < classNo; i++) {
      var sum = 0;
      var mult = 1;
      const bonusPackage = bonusBucket[i];
      switch(i) {
        case 0:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          })
          if (sum > 0) {
            if ('HiddenEle' in equip.Weapon) {
              calcs.Element = equip.Weapon.HiddenEle;
              let freeEle = (equip.Weapon.HiddenEleDmg * sum/3);
              eleDmgCap = Math.max(freeEle * data.elementCap[0],
                                   freeEle + data.elementCap[1]);
              calcs.EleDmg = freeEle;
            }
          }
          break;
        case 2:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (!('cond' in bonus) || bonus.cond(calcs.EleDmg)) {
              if ('param' in bonus.effect) {
                const lvl = mySkills[id][1];
                mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
              }
              else {
                mult *= (bonus.effect.value/100);
              }
            }
          })
          calcs.Attack *= mult;
          break;
        case 3:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          })
          calcs.Attack += sum;
          if (calcs.Attack > rawCap) {
            calcs.Attack = rawCap;
          }
          break;
        case 4:
          // TODO: Post-cap attack mult
          calcs.Attack *= mult;
          calcs.Attack = Math.round(calcs.Attack);
          break;
        case 5:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            const lvl = mySkills[id][1];
            sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
          })
          calcs.Affinity += sum;
          break;
        case 7:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (!('cond' in bonus) || bonus.cond(myEle)) {
              const lvl = mySkills[id][1];
              mult *= (data.skills[id].Params[lvl - 1][bonus.effect.param]/100);
            }
          })
          calcs.EleDmg *= mult;
          break;
        case 8:
          bonusPackage.forEach(s => {
            const [id, bonus] = s;
            if (!('cond' in bonus) || bonus.cond(myEle)) {
              if ('param' in bonus.effect) {
                const lvl = mySkills[id][1];
                sum += data.skills[id].Params[lvl - 1][bonus.effect.param];
              }
              else {
                sum += bonus.effect.value;
              }
            }
          })
          calcs.EleDmg += sum;
          break;
        case 9:
          // TODO: pre-cap ele mult
          calcs.EleDmg *= mult;
          if (calcs.EleDmg > eleDmgCap) {
            calcs.EleDmg = eleDmgCap;
          }
          break;
        case 10:
          // TODO: post-cap ele mult
          calcs.EleDmg *= mult;
          calcs.EleDmg = Math.round(calcs.EleDmg);
          break;
      }
    }

    setMyAttack(calcs.Attack);
    setMyAffinity(calcs.Affinity);
    setMyEle(calcs.Element);
    setMyEleDmg(calcs.EleDmg);

  }, [mySkills, toggleList])

  const theme = useTheme();
  const breakPoint = theme.breakpoints.values[
    [...theme.breakpoints.keys].reverse().reduce((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.only(key));

      return !output && matches ? key : output;
    }, null) || 'xs'
  ]
  // Hacky fix for flex & minHeight
  var equipBlockStyle = (breakPoint < theme.breakpoints.values.lg) ? {} : {height: "1px", minHeight: "77.5vh"};
  var mantleWrap = (breakPoint > theme.breakpoints.values.lg) ? "nowrap" : "wrap";

  return (
    <Box>
    {open &&
      <SearchDialog
        data={data}
        open={open}
        equipItem={equipItem}
        searchClass={searchClass}
        setSearchClass={setSearchClass}
        onClose={handleClose}
      />}

    <Box
      sx={{
        mb: 1,
        backgroundColor: 'primary.main',
      }}
    >
      <Toolbar>
        <ModeIcon sx={{ mr: 2 }}/>
        <Typography variant="h5" flex={1}> New Set (placeholder) </Typography>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={getImage}>
          <PhotoCameraIcon />
        </IconButton>
      </Toolbar>
    </Box>

    <Grid ref={screenshotRef} backgroundColor="background.default" container wrap="wrap-reverse" spacing={1}>
      <Grid item xs={12} lg={2}>
          <Paper sx={{height: "83vh", overflow: 'auto', p: 0.3}}>
            {(() => {
                let e = JSON.parse(JSON.stringify(mySkills));
                return (
                  Object.values(e)
                  .sort((a, b) => (b[1] - a[1]))
                  .map(s => {
                    const [id, lvl] = s;
                    return (
                      <div key={id}>
                        <SkillCard data={data} skill={s} sx={{mb: 0.3}}/>
                      </div>
                    )
                  })
                )
            })()}
          </Paper>
      </Grid>

      <Grid item xs={12} lg={10}>
          <Paper style={{height: "5vh", marginBottom: "0.5vh"}}>
            {/* Active effect icons */}
          </Paper>

          <Grid container spacing={"0.5vh"}>
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column" sx={equipBlockStyle}>
                <WepCard main data={data} wep={equip.Weapon} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3}}/>
                <ArmorCard main data={data} armor={equip.Armor[0]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
                <ArmorCard main data={data} armor={equip.Armor[1]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
                <ArmorCard main data={data} armor={equip.Armor[2]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
                <ArmorCard main data={data} armor={equip.Armor[3]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
                <ArmorCard main data={data} armor={equip.Armor[4]} onClick={handleClickOpen} sx={{ flexGrow: 1, mb: 0.5, p: 0.3, height: 1}}/>
                <Grid container spacing={0.3}>
                  <Grid item xs={12} xl={4}>
                    <ArmorCard charm data={data} armor={equip.Armor[5]} onClick={handleClickOpen} sx={{p: 0.3}}/>
                  </Grid>
                  <Grid item xs>
                    <Grid container wrap={mantleWrap} spacing={0.3} height="100%">
                      <Grid item xl={6}>
                        <MantleCard main data={data} pos={0} mantle={equip.Mantle[0]} onClick={handleClickOpen} sx={{flex: 1, p: 0.3}}/>
                      </Grid>
                      <Grid item xl={6}>
                        <MantleCard main data={data} pos={1} mantle={equip.Mantle[1]} onClick={handleClickOpen} sx={{flex: 1, p: 0.3}}/>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper style={{height: "13vh", marginBottom: "0.5vh"}}>
                {/* Safi/Gun mod zone */}
              </Paper>
              <TableContainer component={Paper} sx={{height: "64vh"}}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Raw</TableCell>
                      <TableCell>{myAttack}</TableCell>
                      <TableCell>Affinity</TableCell>
                      <TableCell>{myAffinity}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ele</TableCell>
                      <TableCell>{myEleDmg}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
      </Grid>
    </Grid>
    </Box>
  );
}