import ApiAuthUserRepository from '@modules/auth/infrastructure/repositories/api-auth-user-repository';
import FirebaseClientRepository from '@modules/clients/infrastructure/respositories/firebase-client-repository';
import FirebaseAppUserRepository from '@modules/auth/infrastructure/providers/firebase-app-user-repository';
import FirebaseRestaurantAreaRepository
    from '@modules/tables/infrastructure/repositories/firebase-restaurant-area-repository';
import FirebaseRestaurantRepository from '@modules/user/infrastructure/repositories/firebase-restaurant-repository';
import FirestoreAccountsRepository from '@modules/user/infrastructure/repositories/firestore-accounts-repository';
import FirebaseTableScheduleRepository
    from '@modules/tables/infrastructure/repositories/firebase-table-schedule-repository';
import FirestoreProductRepository from '@modules/user/infrastructure/repositories/firestore-product-repository';
import FirestorePromotionRepository from '@modules/user/infrastructure/repositories/firestore-promotion-repository';
import FirestoreRestaurantMallRepository
    from '@modules/user/infrastructure/repositories/firestore-restaurant-mall-repository';
import FirebaseReservationRepository
    from '@modules/reservations/infrastructure/repositories/firebase-reservation-repository';

const AppDataProvider = (userTokenId?: string) => {

    const defaultProps = {
        tokenId: userTokenId
    };

    return {
        UserRepository: new FirebaseAppUserRepository(),
        AuthUserRepository: new ApiAuthUserRepository(),
        ClientRepository: new FirebaseClientRepository(),
        RestaurantAreaRepository: new FirebaseRestaurantAreaRepository(),
        RestaurantRepository: new FirebaseRestaurantRepository(),
        AccountsRepository: new FirestoreAccountsRepository(),
        TableScheduleRepository: new FirebaseTableScheduleRepository(),
        ProductRepository: new FirestoreProductRepository(),
        PromotionRepository: new FirestorePromotionRepository(),
        RestaurantMallRepository: new FirestoreRestaurantMallRepository(),
        ReservationRepository: new FirebaseReservationRepository()
    };
};

export default AppDataProvider;
