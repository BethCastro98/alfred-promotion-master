import React from 'react';
import { LottieProps } from './LottieProps';
import BaseLottie from 'lottie-react';

export function Lottie(props: LottieProps) {
    return <BaseLottie
        animationData={props.file}
        style={{
            width: props.width,
            height: props.height
        }}
        loop={props.loop ?? false}
    />;
}
