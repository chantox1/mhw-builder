import { Paper, Box, Typography } from "@mui/material";

export default function Header(props) {
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
