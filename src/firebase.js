import { storage, auth } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFileToStorage(path, file) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export { auth, storage };
