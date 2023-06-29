export default interface BaseAppHeaderProps {
    navigation?: any;
    titleIcon?: string;
    title?: string;
    backgroundColor?: string;
    currentUser?: {
        profilePictureUrl?: string;
        fullName: string;
    };
}
