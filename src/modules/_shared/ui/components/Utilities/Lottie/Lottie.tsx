import React from 'react';
import { LottieProps } from './LottieProps';
import BaseLottie from 'lottie-react-native';

export function Lottie(props: LottieProps) {
    return (
        <BaseLottie
            /*ref={animation => {
                this.animation = animation;
            }}*/
            autoPlay={true}
            loop={props.loop ?? false}
            style={{
                width: props.width,
                height: props.height
            }}
            source={props.file}
        />
    );
}
