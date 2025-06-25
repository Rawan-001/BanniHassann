\Firebase Storage CORS

\مشاكل CORS في Firebase Storage لمشروع BanniHassan.

\ المتطلبات

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Firebase CLI](https://firebase.google.com/docs/cli) (اختياري)
- PowerShell (مدمج في Windows)

التشغيل السريع

### الطريقة الأولى: التشغيل التلقائي
```cmd
# نقر مزدوج على:
run-fix.cmd
```

### الطريقة الثانية: PowerShell مباشرة
```powershell
# تشغيل كامل (موصى به)
.\fix-cors.ps1

# أو للمساعدة
.\fix-cors.ps1 -Help
```

##  خيارات التشغيل المتقدمة

### 1. التشغيل الكامل (افتراضي)
```powershell
.\fix-cors.ps1
```
- فحص المتطلبات
- تسجيل الدخول إلى Google Cloud
- تطبيق إعدادات CORS
- نشر قواعد Storage
- التحقق النهائي

### 2. فحص الحالة فقط
```powershell
.\fix-cors.ps1 -CheckStatus
```
- عرض معلومات المشروع
- فحص الأدوات المطلوبة
- التحقق من إعدادات CORS الحالية
- اختبار رفع ملف

### 3. نشر قواعد Storage فقط
```powershell
.\fix-cors.ps1 -DeployRules
```
- نشر قواعد `storage.rules` المحدثة
- مفيد بعد تعديل القواعد

### 4. اختبار التحميل فقط
```powershell
.\fix-cors.ps1 -TestUpload
```
- إنشاء ملف اختبار
- رفعه إلى Storage
- التحقق من نجاح العملية
- حذف الملف

##  ملفات الإعداد

### `cors-fix.json`
إعدادات CORS المحدثة:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization", 
      "Range",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ]
  }
]
```

### `storage.rules`
قواعد أمان محسنة مع:
- قواعد عامة للملفات
- قواعد خاصة للمواقع السياحية
- قيود حجم وتنسيق للصور (10MB)
- قيود حجم وتنسيق للفيديوهات (50MB)
- إعدادات أمان لملفات الاختبار

##  استكشاف الأخطاء

### خطأ: "Google Cloud SDK غير مثبت"
```powershell
# تثبيت Google Cloud SDK
# من: https://cloud.google.com/sdk/docs/install
```

### خطأ: "فشل تسجيل الدخول"
```powershell
# تسجيل دخول يدوي
gcloud auth login
```

### خطأ: "فشل تطبيق إعدادات CORS"
```powershell
# التحقق من gsutil
gsutil version

# إعادة تهيئة gcloud
gcloud init
```

### خطأ: "فشل نشر قواعد Storage"
```powershell
# تسجيل الدخول إلى Firebase
firebase login

# أو استخدام Google Cloud فقط
.\fix-cors.ps1 -DeployRules
```

## 📊 مراقبة الحالة

### فحص إعدادات CORS الحالية
```powershell
gsutil cors get gs://bannihassan-e4c61.appspot.com
```

### فحص قواعد Storage

### اختبار سريع
```powershell
.\fix-cors.ps1 -TestUpload
```

##  معلومات المشروع

- **App URL:** https://bannihassan-e4c61.web.app

##  الخطوات بعد التشغيل

1. **انتظار (5-10 دقائق)** - تطبيق التغييرات يحتاج وقت
2. **مسح Cache** - `Ctrl+Shift+Delete` في المتصفح
3. **اختبار التطبيق** - جرب رفع ملف من الموقع
4. **فحص إضافي** - `.\fix-cors.ps1 -CheckStatus`

##  الدعم الفني

إذا واجهت مشاكل:

1. شغل: `.\fix-cors.ps1 -CheckStatus`
2. تحقق من [دليل استكشاف الأخطاء](BanniHassan/FIREBASE_STORAGE_TROUBLESHOOTING.md)
3. تأكد من إعدادات Firebase Console
4. جرب متصفح آخر

---

##  آخر تحديث

تم تحديث الأدوات لتشمل:
-  فحص تلقائي للمتطلبات
-  إدارة ذكية لتسجيل الدخول
-  نشر قواعد Storage المحسنة
-  اختبار شامل للتحميل
- تقارير مفصلة عن الحالة
-  معالجة أخطاء محسنة 
