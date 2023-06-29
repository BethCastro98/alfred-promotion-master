import ObjectUtils from '@utils/misc/object-utils';

interface PromotionProps {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    available: boolean;
    duration: {
        start: Date;
        end: Date
    };
    mallsIds: string[];
    status: string;
    createdAt: Date;
    restaurantId: string;
}

interface PromotionPrimitiveProps extends PromotionProps {

}

export default class Promotion {

    constructor(protected props: PromotionProps) {
    }

    get id() {
        return this.props.id;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get imageUrl() {
        return this.props.imageUrl;
    }
    
    get restaurantId() {
        return this.props.restaurantId;
    }

    get isActive() {
        return this.props.available;
    }

    get name() {
        return this.props.name;
    }

    get mallsIds() {
        return this.props.mallsIds;
    }

    updateInfo(info: Omit<Partial<PromotionProps>, 'id' | 'imageUrl' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
    }

    static fromPrimitives(props: PromotionPrimitiveProps) {
        return new Promotion({
            ...props
        });
    }

    updateImageUrl(imageUrl: string) {
        this.props.imageUrl = imageUrl;
    }

    toPrimitives(): PromotionPrimitiveProps {
        return {
            ...this.props
        };
    }
}