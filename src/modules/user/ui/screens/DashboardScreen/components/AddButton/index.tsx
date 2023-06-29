import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import { Box } from '@main-components/Base/Box';
import { Icon } from '@main-components/Base/Icon';
import OptionMenu from '@modules/user/ui/screens/DashboardScreen/components/AddButton/OptionMenu';
import SaveAreaModal from '@modules/user/ui/screens/DashboardScreen/components/SaveAreaModal';
import { useState } from 'react';
import SaveTableModal from '@modules/user/ui/screens/DashboardScreen/components/SaveTableModal';

export function AddButton() {

    const [showAreaModal, setShowAreaModal] = useState(false);
    const [showTableModal, setShowTableModal] = useState(false);

    return (
            <>
                <OptionMenu
                        onItemPress={(key) => {
                            if (key == 'area') {
                                setShowAreaModal(true);
                                return;
                            }
                            setShowTableModal(true);
                        }}
                        renderTarget={({ onPress }) => {
                            return (
                                    <TouchableOpacity onPress={onPress}>
                                        <Box
                                                bg={'greyDark'}
                                                borderRadius={16}
                                                p={'m'}
                                                justifyContent={'center'}
                                                alignItems={'center'}
                                        >
                                            <Icon
                                                    name={'plus-circle-outline'}
                                                    type={'material-community-icons'}
                                                    numberSize={24}
                                            />
                                        </Box>
                                    </TouchableOpacity>
                            );
                        }}
                />

                <SaveAreaModal
                        modal={{
                            visible: showAreaModal,
                            onDismiss() {
                                setShowAreaModal(false);
                            }
                        }}
                        form={{}}
                />

                <SaveTableModal
                        modal={{
                            visible: showTableModal,
                            onDismiss() {
                                setShowTableModal(false);
                            }
                        }}
                        form={{}}
                />

            </>
    );
}

