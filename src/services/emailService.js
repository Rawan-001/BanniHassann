//هذا الملف عشان اذا سوينا داش بورد للدعوات
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const getInvitationEmailTemplate = (invitationLink, role, permissions) => {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1a1a2e;">مرحباً بك في نظام الإدارة</h1>
      </div>
      
      <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          تمت دعوتك للانضمام إلى نظام الإدارة كـ <strong>${role}</strong>
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #333;">
          الصلاحيات الممنوحة لك:
        </p>
        <ul style="list-style-type: none; padding: 0;">
          ${permissions.map(permission => `
            <li style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 4px;">
              ${permission}
            </li>
          `).join('')}
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            تفعيل الحساب
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; text-align: center;">
          هذا الرابط صالح لمدة 24 ساعة فقط
        </p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>هذا البريد الإلكتروني تم إنشاؤه تلقائياً، يرجى عدم الرد عليه</p>
      </div>
    </div>
  `;
};

export const sendAdminInvitation = async (email, role, permissions, token) => {
  try {
    const invitationLink = `${window.location.origin}/admin-signup?token=${token}`;
    
    const emailTemplate = getInvitationEmailTemplate(invitationLink, role, permissions);
    

    const emailData = {
      to: email,
      subject: 'دعوة للانضمام إلى نظام الإدارة',
      html: emailTemplate
    };
    
    await addDoc(collection(db, 'emailLogs'), {
      ...emailData,
      type: 'admin_invitation',
      status: 'sent',
      timestamp: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    throw new Error('فشل في إرسال دعوة الأدمن');
  }
};

export const sendAccountActivationConfirmation = async (email, role) => {
  try {
    const emailTemplate = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e;">تم تفعيل حسابك بنجاح</h1>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            مرحباً بك في نظام الإدارة! تم تفعيل حسابك بنجاح.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            يمكنك الآن تسجيل الدخول إلى لوحة التحكم باستخدام بريدك الإلكتروني.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${window.location.origin}/admin-login" 
               style="display: inline-block; padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              تسجيل الدخول
            </a>
          </div>
        </div>
      </div>
    `;
    
    const emailData = {
      to: email,
      subject: 'تم تفعيل حسابك بنجاح',
      html: emailTemplate
    };
    
    await addDoc(collection(db, 'emailLogs'), {
      ...emailData,
      type: 'account_activation',
      status: 'sent',
      timestamp: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    throw new Error('فشل في إرسال تأكيد التفعيل');
  }
}; 