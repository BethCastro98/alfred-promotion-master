import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Icon } from '@main-components/Base/Icon';
import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';

const StyledMenu = styled((props: MenuProps) => (
        <Menu
                elevation={0}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                {...props}
        />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity
                )
            }
        }
    }
}));

export default function AreaOptionMenu({ renderTarget, onItemPress }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
            <div>
                {renderTarget({ onPress: handleClick })}

                <StyledMenu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => {
                            handleClose();
                        }}
                >
                    <MenuItem
                            onClick={() => {
                                onItemPress('delete');
                                handleClose();
                            }}
                            disableRipple
                    >
                        <Box mr={'m'}>
                            <Icon
                                    name={'trash'}
                                    type={'feather'}
                                    color={'primaryMain'}
                                    numberSize={20}
                            />
                        </Box>
                        <Box>
                            <Text>Eliminar sección</Text>
                        </Box>
                    </MenuItem>


                </StyledMenu>
            </div>
    );
}