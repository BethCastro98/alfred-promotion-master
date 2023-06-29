import ObjectUtils from '@utils/misc/object-utils';

export interface ClientProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string,
    allergies: string
    status: string,
    imageUrl: string,
    restaurantId: string,
    favoriteTable: any;
}

export interface ClientPrimitiveProps extends ClientProps {
}

export default class Client {

    constructor(private props: ClientProps) {

    }

    get id() {
        return this.props.id;
    }

    get firstName() {
        return this.props.firstName;
    }

    get lastName() {
        return this.props.lastName;
    }

    get imageUrl() {
        return this.props.imageUrl;
    }

    get email() {
        return this.props.email;
    }

    get phone() {
        return this.props.phone;
    }

    get allergies() {
        return this.props.allergies;
    }

    get fullName() {
        return `${this.props.firstName ?? ''} ${this.props.lastName ?? ''}`;
    }

    updateInfo(info: Omit<Partial<ClientProps>, 'id' | 'createdAt'>) {
        this.props = ObjectUtils.merge(this.props, info);
    }

    updateImageUrl(imageUrl: string) {
        this.props.imageUrl = imageUrl;
    }

    static fromPrimitives(props: ClientPrimitiveProps) {
        return new Client({
            ...props
        });
    }

    toPrimitives(): ClientPrimitiveProps {
        return {
            ...this.props
        };
    }
}
