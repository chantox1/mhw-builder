import * as React from 'react';
import { TableCell, ButtonBase, styled } from '@mui/material';

const TableCellAlignCenter = React.forwardRef((props, ref) => 
  <TableCell align='center' {...props} ref={ref}>
    { props.children }
  </TableCell>)

export const ButtonCell = (props) => (
  <ButtonBase
    {...props}
    component={TableCellAlignCenter}
    sx={{display: "table-cell", px: 1.5, py: 1}}
  >
    { props.children }
  </ButtonBase>
)

export const ButtonHoverOutlined = styled(ButtonBase)({
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    outline: '1px solid'
  },
})
