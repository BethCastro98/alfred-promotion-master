import { useLocalSearchParams, useSearchParams } from 'expo-router';

export default function useParams(): any {

    const localParams = useLocalSearchParams(); /*url params*/
    const params = useSearchParams(); /*other params*/

    return { ...params, ...localParams };
}
