# ⚡ دليل سريع للمطورين

## 🚀 البداية السريعة

```bash
# 1. تشغيل مباشر (Windows)
run-fix.cmd

# 2. أو PowerShell
.\fix-cors.ps1

# 3. فحص الحالة
.\fix-cors.ps1 -CheckStatus
```

## 🔧 الأدوات المتوفرة

| الأداة | الوصف | الاستخدام |
|-------|--------|----------|
| `fix-cors.ps1` | السكريبت الرئيسي | `.\fix-cors.ps1` |
| `run-fix.cmd` | تشغيل سريع | نقر مزدوج |
| `cors-fix.json` | إعدادات CORS | تعديل تلقائي |
| `storage.rules` | قواعد الأمان | تعديل يدوي |

## 📋 المهام الشائعة

### إصلاح CORS كامل
```powershell
.\fix-cors.ps1
```

### فحص الحالة فقط
```powershell
.\fix-cors.ps1 -CheckStatus
```

### نشر قواعد Storage
```powershell
.\fix-cors.ps1 -DeployRules
```

### اختبار التحميل
```powershell
.\fix-cors.ps1 -TestUpload
```

## 🐛 حل المشاكل السريع

### مشكلة 1: CORS لا يعمل
```powershell
# 1. تطبيق CORS
.\fix-cors.ps1

# 2. انتظار 10 دقائق
# 3. مسح cache المتصفح
# 4. اختبار
.\fix-cors.ps1 -TestUpload
```

### مشكلة 2: فشل رفع الملفات
```powershell
# 1. فحص الحالة
.\fix-cors.ps1 -CheckStatus

# 2. نشر قواعد Storage
.\fix-cors.ps1 -DeployRules

# 3. اختبار
.\fix-cors.ps1 -TestUpload
```

### مشكلة 3: مشاكل المصادقة
```powershell
# 1. إعادة تسجيل الدخول
gcloud auth login

# 2. تعيين المشروع
gcloud config set project bannihassan-e4c61

# 3. تشغيل الإصلاح
.\fix-cors.ps1
```

## 🔍 فحص يدوي

### فحص CORS
```bash
gsutil cors get gs://bannihassan-e4c61.appspot.com
```

### فحص Storage Rules
```bash
firebase deploy --only storage --dry-run
```

### فحص المصادقة
```bash
gcloud auth list
```

## 📊 مؤشرات النجاح

✅ **نجح الإصلاح إذا:**
- تم عرض "✅ تم تطبيق إعدادات CORS بنجاح!"
- تم عرض "✅ تم نشر قواعد Storage بنجاح!"
- اختبار التحميل نجح

❌ **فشل الإصلاح إذا:**
- ظهر "❌ Google Cloud SDK غير مثبت!"
- ظهر "❌ فشل تسجيل الدخول"
- ظهر "❌ فشل تطبيق إعدادات CORS"

## 🔗 روابط مفيدة

- [Firebase Console](https://console.firebase.google.com/project/bannihassan-e4c61)
- [Storage Rules](https://console.firebase.google.com/project/bannihassan-e4c61/storage/bannihassan-e4c61.appspot.com/rules)
- [Google Cloud Console](https://console.cloud.google.com/storage/browser/bannihassan-e4c61.appspot.com)
- [تطبيق مباشر](https://bannihassan-e4c61.web.app)

## 💡 نصائح للمطورين

1. **دائماً شغل فحص الحالة أولاً**
2. **امسح cache المتصفح بعد التغييرات**
3. **انتظر 5-10 دقائق بعد نشر القواعد**
4. **استخدم متصفح incognito للاختبار**
5. **تحقق من Network tab في Developer Tools**

---

*آخر تحديث: $(Get-Date -Format "yyyy-MM-dd HH:mm")* 