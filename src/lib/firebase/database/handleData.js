import { db } from '@/lib/firebase/firebase'
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where } from "firebase/firestore"

export async function addData(path, data) {
    const docRef = doc(db, ...path);
    await setDoc(docRef, data)
}

export async function readData(path) {
    const docRef = doc(db, ...path);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
}

export async function readDataQuery(path, params) {
    const docRef = collection(db, path)
    if(!params[0]) return
    const docQuery = query(docRef, where(...params))
    const docSnap = await getDocs(docQuery)
    let result = []
    docSnap.forEach((doc) => result.push({
        id: doc.id,
        ...doc.data()
    }))
    return result
}

export async function updateData(path, data) {
    const docRef = doc(db, ...path);
    await updateDoc(docRef, data)
}

export async function deleteData(path) {
    let result = null
    let error = null

    try {
        result = await remove(child(ref(db), path))
    } catch (e) {
        error = e
    }

    return { result, error }
}
