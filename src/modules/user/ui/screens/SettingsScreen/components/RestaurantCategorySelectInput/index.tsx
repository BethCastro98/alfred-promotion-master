import { SelectInputProps } from '@main-components/Form/inputs/SelectInput';
import useFindRestaurantCategories from '@modules/user/application/use-find-restaurant-categories';
import SelectArrayInput from '@main-components/Form/inputs/SelectArrayInput';

interface RestaurantCategorySelectInputProps extends Omit<SelectInputProps, 'choices'> {

}

export default function RestaurantCategorySelectInput(props: RestaurantCategorySelectInputProps) {
    const { data, loading } = useFindRestaurantCategories();

    return (
            <SelectArrayInput
                    {...props}
                    choices={data?.map(e => {
                        return {
                            id: e.id,
                            label: e.name,
                            name: e.name
                        };
                    })}
            />
    );
}