import React from 'react';
import {WYSIWYGEditorProps} from './WYSIWYGEditorProps';
import QuillEditor from 'react-native-cn-quill';
import {Box, statusBarHeight} from "@main-components/Base";
import {SafeAreaView, StyleSheet} from "react-native";

export function WYSIWYGEditor(props: WYSIWYGEditorProps) {
    const editorRef = React.createRef<QuillEditor>()

    return (
        <SafeAreaView style={styles.root}>
            <Box>
                <QuillEditor
                    style={styles.editor}
                    ref={editorRef}
                    initialHtml={props.initialHtml ?? ""}
                />
            </Box>

            {/* <QuillToolbar
                editor={editorRef}
                options="full"
                theme="light"
            />*/}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingVertical: 10,
    },
    root: {
        flex: 1,
        minHeight: 200,
        marginTop: statusBarHeight || 0,
        backgroundColor: '#eaeaea',
    },
    editor: {
        minHeight: 100,
        maxHeight: 500
    }
})