import { USER_ROLE } from '@modules/auth/domain/services/auth-provider';

export interface AppUserProps {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: USER_ROLE[];
    type: string;
}

export interface AppUserPrimitiveProps extends Omit<AppUserProps, 'roles'> {
    roles: string[];
}

export default class AppUser {

    constructor(private props: AppUserProps) {

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


    get email() {
        return this.props.email;
    }

    get fullName() {
        return `${this.props.firstName ?? ''} ${this.props.lastName ?? ''}`;
    }


    static fromPrimitives(props: AppUserPrimitiveProps) {
        return new AppUser({
            ...props,
            roles: props.roles as any
        });
    }

    toPrimitives(): AppUserPrimitiveProps {
        return {
            ...this.props
        };
    }
}
