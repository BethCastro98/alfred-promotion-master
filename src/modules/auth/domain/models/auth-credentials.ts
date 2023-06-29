export default interface AuthCredentials {
    email: string;
    phone?: string;
    restaurantId: string,
    password: string;
    cpassword?: string;
    isGuestUser?: boolean;
}
