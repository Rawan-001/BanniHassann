import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const setupCurrentUserAsAdmin = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser || !currentUser.emailVerified) {
      throw new Error('يجب تسجيل الدخول وتأكيد البريد الإلكتروني أولاً');
    }

    const userEmail = currentUser.email;
    const userId = currentUser.uid;
    
    const adminRef = doc(db, 'admins', userId);
    const adminDoc = await getDoc(adminRef);
    
    if (!adminDoc.exists()) {
      await setDoc(adminRef, {
        email: userEmail,
        role: 'super_admin',
        permissions: ['read', 'write', 'delete', 'manage_sites', 'manage_media'],
        isActive: true,
        emailVerified: currentUser.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: 'self_registration',
        status: 'active'
      });
    }

    const systemAdminRef = doc(db, 'systemAdmins', userId);
    const systemAdminDoc = await getDoc(systemAdminRef);
    
    if (!systemAdminDoc.exists()) {
      await setDoc(systemAdminRef, {
        email: userEmail,
        role: 'system_admin',
        permissions: ['full_access', 'manage_admins', 'manage_system', 'view_logs'],
        isActive: true,
        emailVerified: currentUser.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: new Date().toISOString(),
        createdBy: 'self_registration',
        status: 'active',
        systemLevel: true
      });
    }

    return {
      success: true,
      message: 'تم إعداد صلاحيات الأدمن بنجاح',
      userEmail,
      userId
    };

  } catch (error) {
    throw error;
  }
};


export const checkUserPermissions = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { isAdmin: false, isSystemAdmin: false };
    }

    const userId = currentUser.uid;
    
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    const isAdmin = adminDoc.exists() && adminDoc.data().isActive;
    
    const systemAdminDoc = await getDoc(doc(db, 'systemAdmins', userId));
    const isSystemAdmin = systemAdminDoc.exists() && systemAdminDoc.data().isActive;
    
    return {
      isAdmin,
      isSystemAdmin,
      adminData: isAdmin ? adminDoc.data() : null,
      systemAdminData: isSystemAdmin ? systemAdminDoc.data() : null
    };

  } catch (error) {
    return { isAdmin: false, isSystemAdmin: false, error: error.message };
  }
};

export const addAdmin = async (adminData) => {
  const adminsRef = collection(db, 'admins');
  await addDoc(adminsRef, adminData);
};

export const addSystemAdmin = async (adminData) => {
  const systemAdminsRef = collection(db, 'systemAdmins');
  await addDoc(systemAdminsRef, adminData);
};

export const checkAdmin = async (email) => {
  const adminsRef = collection(db, 'admins');
  const q = query(adminsRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export const checkSystemAdmin = async (email) => {
  const systemAdminsRef = collection(db, 'systemAdmins');
  const q = query(systemAdminsRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

export default setupCurrentUserAsAdmin; 