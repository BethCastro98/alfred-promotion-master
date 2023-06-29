import Restaurant from '@modules/user/domain/models/restaurant';
import RestaurantCategory from '@modules/user/domain/models/restaurant-category';

export default interface RestaurantRepository {
    getProfileBySlug(slug: string): Promise<Restaurant | undefined>;

    getProfileById(id: string): Promise<Restaurant | undefined>;

    findCategories(): Promise<RestaurantCategory[]>;

    updateRestaurant(restaurant: Restaurant): Promise<any>
}