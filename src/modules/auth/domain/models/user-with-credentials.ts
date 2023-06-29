import AuthCredentials from '@modules/auth/domain/models/auth-credentials';


export default interface UserWithCredentials extends User {
    credentials: AuthCredentials;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    email: string;
    type: string,
    signedUpAt?: Date;
    restaurantId: string
}