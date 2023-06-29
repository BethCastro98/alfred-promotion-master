export interface UserIdentityProps {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    roles: string[];
    type: string;
    restaurantId: string;
}

export interface UserIdentityPrimitiveProps {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    roles: string[];
    type: string;
    restaurantId: string;
}

export default class UserIdentity {
    constructor(private props: UserIdentityProps) {
    }

    get isGuest() {
        return this.props.id === 'GUEST_USER';
    }

    get isAdmin() {
        return this.props.type == 'ADMIN';
    }

    get id() {
        return this.props.id;
    }

    get restaurantId() {
        return this.props.restaurantId;
    }

    get firstName() {
        return this.props.firstName;
    }

    get lastName() {
        return this.props.lastName;
    }

    get email() {
        return this.props.email;
    }

    static fromPrimitives(props: UserIdentityPrimitiveProps) {
        return new UserIdentity({
            ...props
        });
    }

    toPrimitives(): UserIdentityPrimitiveProps {
        return {
            ...this.props
        };
    }
}
