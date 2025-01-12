import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const getDocData = async (path, key) => {
    const docRef = doc(db, path, key);

    const docSnapshot = await getDoc(docRef);

    return [docSnapshot.data(), docRef];
}