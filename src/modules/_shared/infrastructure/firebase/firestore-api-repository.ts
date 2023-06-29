import { getFirestore } from './use-firestore';
import {
    collection,
    deleteDoc,
    deleteField,
    doc,
    DocumentData,
    Firestore,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    OrderByDirection,
    query,
    Query,
    setDoc,
    startAfter,
    updateDoc,
    where,
    WhereFilterOp,
    writeBatch
} from 'firebase/firestore';
import PaginationOptions from '@shared/domain/models/pagination-options';
import { getAuth } from '@shared/infrastructure/firebase/use-start-firebase';


export type QueryFilter = {
    field: string;
    operator: WhereFilterOp;
    value: string[] | number | string | boolean;
};

type QueryDocsParams = {
    filters: QueryFilter[];
    limit?: number;
    orderBy?: {
        field: string;
        direction: OrderByDirection;
    };
};


export default abstract class FirestoreApiRepository {
    private db: Firestore;

    constructor() {
        this.db = getFirestore();
    }

    get firestore() {
        return this.db;
    }

    get firebaseAuth() {
        return getAuth();
    }

    static async applyPagination(collectionName: string, constraints: any, pagination?: PaginationOptions): Promise<Query<DocumentData>> {

        if (!pagination) {
            return query(collection(getFirestore(), collectionName), ...constraints as any);
        }

        if (pagination.infinite) {
            constraints.push(orderBy(pagination.infinite.orderBy.field, pagination.infinite.orderBy.direction));

            if (pagination.infinite.key) {
                constraints.push(startAfter(pagination.infinite.key));
            }

            constraints.push(limit(pagination.infinite.limit));

            return constraints;
        }

        if (pagination.perPage === undefined || pagination.page === undefined) {
            return constraints;
        }

        const lastVisible = await (async () => {
            if (!pagination.page) return undefined;

            if (pagination.page <= 1) {
                return undefined;
            }

            const ref = await this.applyPagination(collectionName, constraints, {
                ...pagination,
                page: pagination.page - 1
            });


            const documentSnapshots = await getDocs(ref);

            return documentSnapshots.docs[documentSnapshots.docs.length - 1];

        })();


        if (lastVisible) {
            constraints.push(startAfter(lastVisible));
        }

        constraints.push(limit(pagination.perPage));

        return query(collection(getFirestore(), collectionName), ...constraints as any);
    }

    async getDoc(collectionName: string, docId: string) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        const result = await getDoc(ref);
        return result.data();
    }

    async updateDoc(collectionName: string, docId: string, data: any) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        await updateDoc(ref, data);
    }

    /*  getDocsRef(collectionName: string) {
          const ref = doc(this.db, `${collectionName}`);
          return ref;
      }
  */
    async deleteDoc(collectionName: string, docId: string) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        await deleteDoc(ref);
    }

    async setDoc(collectionName: string, docId: string, data: any) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        await setDoc(ref, data);
    }

    async saveDoc(collectionName: string, docId: string, data: any) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        await setDoc(ref, data);
    }

    async deleteDocField(collectionName: string, docId: string, field: string) {
        await this.updateDoc(collectionName, docId, {
            [field]: deleteField()
        });
    }

    async getDocs(collectionName: string, params: QueryDocsParams) {
        const inFilter = params.filters.find(
            (f) => f.operator == 'in'
        ) as QueryFilter | null;
        const normalFilters = params.filters.filter((f) => f.operator !== 'in');

        if (!inFilter) {
            return this.getDocsData(collectionName, {
                filters: normalFilters
            });
        }

        const queryChunks = this.getChunks(inFilter.value, 10);

        const chunksResults = queryChunks.map(async (chunk: string[]) => {

            const constraints = this.getQueryConstraints({
                filters: [...normalFilters, {
                    field: inFilter.field,
                    operator: 'in',
                    value: chunk
                }]
            });

            const q = query(collection(this.firestore, collectionName), ...constraints);

            const docs = await getDocs(q);
            let chunkDtos = docs.docs.map((d) => d.data());

            return chunkDtos;
        });

        const results = await Promise.all(chunksResults);
        return results?.flat();
    }

    async saveInBatch(collectionName: string, docs: any[]) {
        const batch = writeBatch(this.db);

        docs.forEach((d) => {
            const document = doc(this.db, `${collectionName}`, d.id);
            batch.set(
                document,
                d
            );
        });

        await batch.commit();
    }

    getChunks(inputArray, perChunk) {
        var result = inputArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / perChunk);

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []; // start a new chunk
            }

            resultArray[chunkIndex].push(item);

            return resultArray;
        }, []);

        return result;
    }

    getDocsWithFiltersRef(
        collectionName: string,
        params: QueryDocsParams
    ) {
        const queryConstraints = this.getQueryConstraints(params);
        return query(collection(this.db, collectionName), ...queryConstraints);
    }

    getQueryConstraints(params: QueryDocsParams) {
        const queryConstraints = [];

        params.filters.forEach((filter) => {
            queryConstraints.push(where(filter.field, filter.operator, filter.value));
        });

        if (params.limit) {
            queryConstraints.push(limit(params.limit));
        }

        if (params.orderBy) {
            queryConstraints.push(orderBy(params.orderBy.field, params.orderBy.direction));
        }

        return queryConstraints;
    }

    getListener(collectionName: string, params: QueryDocsParams, onUpdate: (params: any) => any) {
        let ref = this.getDocsWithFiltersRef(collectionName, params);

        const subs = onSnapshot(ref, (res) => {
            onUpdate(res);
        });

        return subs;
    }

    getDocListener(collectionName: string, docId: string, onUpdate: (params: any) => any) {
        let ref = this.getDocRef(collectionName, docId);

        const subscription = onSnapshot(ref, (res) => {
            onUpdate(res);
        });

        return subscription;
    }

    private getDocRef(collectionName: string, docId: string) {
        const ref = doc(this.db, `${collectionName}/${docId}`);
        return ref;
    }

    private async getDocsData(collectionName: string, params: QueryDocsParams) {
        let ref = this.getDocsWithFiltersRef(collectionName, params);
        return (await getDocs(ref)).docs.map(doc => doc.data());
    }
}
