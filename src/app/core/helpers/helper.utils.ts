// This is just a helper to add the type to the db responses
import { DocumentData, collection, Firestore, CollectionReference } from '@angular/fire/firestore';

export const createCollection = <T = DocumentData>(firestore: Firestore, collectionName: string) => {
    return collection(firestore, collectionName) as CollectionReference<T>
}
