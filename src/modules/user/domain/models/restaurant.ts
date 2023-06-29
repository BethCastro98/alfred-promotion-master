import ObjectUtils from '@utils/misc/object-utils';

export interface RestaurantProps {
    id: string;
    name: string;
    logoUrl: string;
    coverImageUrl: string;
    categoriesIds: string;
    notificationEmail?: string;
    description: string;
    schedule: any;
    mallId: string
}

export interface RestaurantPrimitiveProps extends RestaurantProps {
}

export default class Restaurant {

    constructor(private props: RestaurantProps) {

    }

    get id() {
        return this.props.id;
    }

    get mallId() {
        return this.props.mallId;
    }

    get name() {
        return this.props.name;
    }

    get categoriesIds() {
        return this.props.categoriesIds;
    }

    get logoUrl() {
        return this.props.logoUrl;
    }

    get coverImageUrl() {
        return this.props.coverImageUrl;
    }

    get notificationEmail() {
        return this.props.notificationEmail;
    }

    static fromPrimitives(props: RestaurantPrimitiveProps) {
        return new Restaurant({
            ...props
        });
    }

    updateLogoUrl(logoUrl: string) {
        this.props.logoUrl = logoUrl;
    }

    updateCoverImageUrl(url: string) {
        this.props.coverImageUrl = url;
    }

    updateProfile(restaurant: Partial<RestaurantPrimitiveProps>) {
        this.props = ObjectUtils.merge(this.props, restaurant);
    }

    toPrimitives(): RestaurantPrimitiveProps {
        return {
            ...this.props
        };
    }
}
