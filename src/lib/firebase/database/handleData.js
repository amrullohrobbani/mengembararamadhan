import { db } from '@/lib/firebase/firebase'
import { doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy } from "firebase/firestore"

export async function addData(path, data) {
    const docRef = doc(db, ...path);
    await setDoc(docRef, data)
}


export async function readData(path) {
    if(!path?.[0]) return
    const docRef = doc(db, ...path)
    const docSnap = await getDoc(docRef)
    return docSnap.data()
}

export async function readDataQuery(path, params, order) {
    const docRef = collection(db, path)
    if(!params[0]) return
    let docQuery
    if(!order) {
        docQuery = query(docRef, where(...params))
    } else {
        docQuery = query(docRef, where(...params), orderBy(...order))
    }
    const docSnap = await getDocs(docQuery)
    let result = []
    docSnap.forEach((doc) => result.push({
        id: doc.id,
        ...doc.data()
    }))
    return result
}

export async function readDataQueryCustom(path, params) {
    const docRef = collection(db, path)
    if(!params[0]) return
    const docQuery = query(docRef, ...params)
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
    const docRef = doc(db, ...path);
    await deleteDoc(docRef)
}
