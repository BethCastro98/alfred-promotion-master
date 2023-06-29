import { useTheme } from '@modules/_shared/ui/theme/AppTheme';
import React from 'react';
import { ModalProps } from './ModalProps';
import BaseModal from 'react-modal';
import { Box } from '@main-components/Base/Box';
import Text from '@main-components/Typography/Text';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Icon } from '@main-components/Base/Icon';
import { ProgressBar } from '@main-components/Base/ProgressBar';

BaseModal.setAppElement('#root');

BaseModal.defaultStyles.overlay.overflow = 'auto';
BaseModal.defaultStyles.overlay.backgroundColor = 'rgba(55,71,79,0.77)'; // 'rgba(0,0,0,0.6)';
BaseModal.defaultStyles.overlay.backdropFilter = 'blur(4px)';

export function Modal(props: ModalProps) {
    const theme = useTheme();
    const customStyles = {
        content: {
            top: '10px',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            // marginRight: '-50%',
            transform: 'translateX(-50%)',
            border: 0,
            padding: 0,
            borderRadius: 8,
            width: '100%'
        }
    };

    return (
        <BaseModal
            isOpen={props.visible}
            onRequestClose={props.onDismiss}

            style={{
                ...customStyles,
                ...props.containerStyle ?? {},
                content: {
                    ...customStyles.content,
                    backgroundColor: 'white',
                    padding: theme.spacing.l,
                    borderRadius: theme.borderRadius.s,
                    ...props.contentContainerStyle,
                    margin: 0,
                    boxShadow: 'rgb(38 38 38 / 20%) 0px 7px 20px'
                }
            }}
        >
            {/* <Slide
                direction="down"
                in={props.visible}
                timeout={100}
                mountOnEnter
                unmountOnExit
            >
                <div style={{width: "100%"}}>*/}

            {props.children}
            {/* </div>
            </Slide>*/}

        </BaseModal>
    );

}


export function ModalHeader({ title, onClose, loading, showClose = true }: any) {
    return (
        <>
            <Box
                mb={'l'}
                alignItems={'center'}
            >
                <Text
                    numberOfLines={1}
                    bold
                    variant={'heading2'}
                >{title}</Text>

                {
                    showClose && (
                        <Box
                            position={'absolute'}
                            top={0}
                            right={0}
                        >
                            <TouchableOpacity onPress={onClose}>
                                <Box
                                    width={25}
                                    height={25}
                                    borderRadius={25 / 2}
                                    bg={'greyMedium'}
                                    alignItems={'center'}
                                    justifyContent={'center'}
                                    p={'s'}
                                >
                                    <Icon
                                        name={'close'}
                                        type={'ionicon'}
                                        color={'greyMain'}
                                    />
                                </Box>
                            </TouchableOpacity>
                        </Box>
                    )
                }


            </Box>
            {loading && (
                <Box
                    position={'absolute'}
                    top={-25}
                    width={'100%'}
                    style={{
                        marginTop: 1
                    }}
                >
                    <ProgressBar
                        borderRadius={20}
                        progress={100}
                        indeterminate
                    />
                </Box>
            )}
        </>
    );
}

