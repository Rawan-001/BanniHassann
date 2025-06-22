import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from './AuthContext';

const SystemAdminContext = createContext();

export function SystemAdminProvider({ children }) {
  const { currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSystemAdminChecked, setIsSystemAdminChecked] = useState(false);
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);

  const checkSystemAdminStatus = async () => {
    if (!currentUser) {
      setIsSystemAdmin(false);
      setIsSystemAdminChecked(true);
      return false;
    }

    try {
      const systemAdminsRef = collection(db, 'systemAdmins');
      const q = query(systemAdminsRef, where('email', '==', currentUser.email));
      const querySnapshot = await getDocs(q);
      const isAdmin = !querySnapshot.empty;
      setIsSystemAdmin(isAdmin);
      setIsSystemAdminChecked(true);
      return isAdmin;
    } catch (error) {
      console.error('Error checking system admin status:', error);
      setError('حدث خطأ أثناء التحقق من صلاحيات System Admin');
      setIsSystemAdmin(false);
      setIsSystemAdminChecked(true);
      return false;
    }
  };

  const fetchAdmins = async () => {
    if (!isSystemAdmin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const adminsRef = collection(db, 'admins');
      const querySnapshot = await getDocs(adminsRef);
      const adminsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAdmins(adminsList);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setError('حدث خطأ أثناء جلب قائمة الأدمنز');
    } finally {
      setLoading(false);
    }
  };

  const createAdminInvitation = async (email, role, permissions) => {
    if (!isSystemAdmin) {
      throw new Error('ليس لديك صلاحية إنشاء دعوات');
    }

    try {
      const invitationRef = collection(db, 'adminInvitations');
      const invitation = {
        email,
        role,
        permissions,
        status: 'pending',
        createdAt: serverTimestamp(),
        createdBy: currentUser.email,
        token: Math.random().toString(36).substring(2) + Date.now().toString(36)
      };
      
      const docRef = await addDoc(invitationRef, invitation);
      return { id: docRef.id, ...invitation };
    } catch (error) {
      console.error('Error creating admin invitation:', error);
      throw new Error('حدث خطأ أثناء إنشاء دعوة الأدمن');
    }
  };

  const updateAdminStatus = async (adminId, status) => {
    if (!isSystemAdmin) {
      throw new Error('ليس لديك صلاحية تحديث حالة الأدمن');
    }

    try {
      const adminRef = doc(db, 'admins', adminId);
      await updateDoc(adminRef, { status });
      await fetchAdmins();
    } catch (error) {
      console.error('Error updating admin status:', error);
      throw new Error('حدث خطأ أثناء تحديث حالة الأدمن');
    }
  };

  const deleteAdmin = async (adminId) => {
    if (!isSystemAdmin) {
      throw new Error('ليس لديك صلاحية حذف الأدمن');
    }

    try {
      await deleteDoc(doc(db, 'admins', adminId));
      await fetchAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw new Error('حدث خطأ أثناء حذف الأدمن');
    }
  };

  const fetchSystemLogs = async (limit = 100) => {
    if (!isSystemAdmin) {
      throw new Error('ليس لديك صلاحية عرض سجلات النظام');
    }

    try {
      const logsRef = collection(db, 'systemLogs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limit));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw new Error('حدث خطأ أثناء جلب سجلات النظام');
    }
  };

  useEffect(() => {
    if (currentUser) {
      checkSystemAdminStatus();
    } else {
      setIsSystemAdmin(false);
      setIsSystemAdminChecked(true);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isSystemAdmin) {
      fetchAdmins();
    }
  }, [isSystemAdmin]);

  const value = {
    admins,
    loading,
    error,
    isSystemAdmin,
    isSystemAdminChecked,
    checkSystemAdminStatus,
    createAdminInvitation,
    updateAdminStatus,
    deleteAdmin,
    fetchSystemLogs,
    fetchAdmins
  };

  return (
    <SystemAdminContext.Provider value={value}>
      {children}
    </SystemAdminContext.Provider>
  );
}

export function useSystemAdmin() {
  const context = useContext(SystemAdminContext);
  if (!context) {
    throw new Error('useSystemAdmin must be used within a SystemAdminProvider');
  }
  return context;
} 