import { collection, doc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import useFirestore from '@shared/infrastructure/firebase/use-firestore';

const db = useFirestore();
const UuidUtils = {
    generate() {
        return uuid.v4().toString();
    },
    code(length?: number, includeLetters = false) {
        return makeCode(length ?? 5, includeLetters);
    },
    persistenceUuid() {

        const col = doc(collection(db, 'test'));
        return col.id;
    }
};

function makeCode(length: number, includeLetters = false) {
    let result = '';
    const characters = includeLetters
        ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        : '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

export default UuidUtils;
