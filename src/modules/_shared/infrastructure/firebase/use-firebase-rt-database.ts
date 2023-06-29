import { getDatabase } from 'firebase/database';

export default function useFirebaseRealTimeDatabase() {
    return getDatabase();
}

export function getRealTimeDatabase() {
    return getDatabase();
}