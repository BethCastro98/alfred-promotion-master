import ObjectUtils from '@utils/misc/object-utils';
import CurrencyPrice from '@shared/domain/models/currency-price';
import UsdCurrency from '@shared/domain/models/usd-currency';

interface ProductProps {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    unity: string;
    category: {
        id: string,
        name: string
    };
    price: number;
    available: boolean;
    restaurantId: string;
    status: string;
    createdAt: Date;
}

interface PromotionPrimitiveProps extends ProductProps {

}

export default class Product {

    constructor(protected props: ProductProps) {
    }

    get id() {
        return this.props.id;
    }

    get categoryId() {
        return this.props.category?.id;
    }

    get categoryName() {
        return this.props.category?.name;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get imageUrl() {
        return this.props.imageUrl;
    }

    get isActive() {
        return this.props.available;
    }

    get name() {
        return this.props.name;
    }

    get unity() {
        return this.props.unity;
    }

    get price() {
        return CurrencyPrice.fromPrimitives({
            currency: UsdCurrency.toPrimitives(),
            value: this.props.price
        });
    }

    static fromPrimitives(props: PromotionPrimitiveProps) {
        return new Product({
            ...props
        });
    }

    updateInfo(info: Omit<Partial<ProductProps>, 'id' | 'imageUrl' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
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