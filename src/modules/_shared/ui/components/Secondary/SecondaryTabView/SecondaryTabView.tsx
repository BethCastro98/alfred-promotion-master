import React, {useState} from 'react';
import {Box} from '@main-components/Base';
import ScrollView from '@main-components/Utilities/ScrollView';
import TouchableOpacity from '@main-components/Utilities/TouchableOpacity';
import Text from '@main-components/Typography/Text';

export function SecondaryTabView({
    headers,
    children,
    vertical = false,
    renderLayout,
}: { headers: string[]; children: any, vertical?: boolean, renderLayout?: (renderTabs: () => any, renderContent: () => any) => any }) {

    const [activeTab, setActiveTab] = useState(0);

    function renderTabs() {
        return (
            <Box
                height={!vertical ? 50 : undefined}
                width={"100%"}
                bg={'white'}
                justifyContent={'center'}
                flexDirection={"column"}
            >
                <ScrollView
                    horizontal={!vertical}
                >
                    {
                        headers.map((e, i) => {
                            const isActive = i === activeTab;
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setActiveTab(i);
                                    }}
                                >
                                    <Box
                                        key={i}
                                        p={'m'}
                                        borderBottomWidth={isActive ? 2 : 0}
                                        borderBottomColor={'primaryMain'}
                                    >
                                        <Text
                                            color={isActive ? 'black' : 'greyMain'}
                                        >{e}</Text>
                                    </Box>
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>
            </Box>
        );
    }

    const currentChildren = React.Children.toArray(children);

    function renderContent() {
        return currentChildren[activeTab]
    }

    if (renderLayout) return renderLayout(renderTabs, renderContent)

    return (
        <Box>
            {renderTabs()}
            <Box mt={'m'}>
                {
                    renderContent()
                }
            </Box>
        </Box>
    );
}