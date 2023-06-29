import { SelectInputProps } from '@main-components/Form/inputs/SelectInput';
import SelectArrayInput from '@main-components/Form/inputs/SelectArrayInput';
import useFindRestaurantMalls from '@modules/user/application/malls/use-find-restaurant-malls';

interface MallsSelectInputProps extends Omit<SelectInputProps, 'choices'> {

}

export default function MallsSelectInput(props: MallsSelectInputProps) {
    const { data, loading } = useFindRestaurantMalls();

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