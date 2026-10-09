# buildX Career Agent — Backend MVP

بک‌اند MVP برای همراه هوشمند کاریابی با اولویت ساخت رزومه. شامل ثبت‌نام/ورود، پروفایل کارجو، مصاحبهٔ مرحله‌ای با ایجنت، تولید رزومه با LLM، ذخیره و مدیریت رزومه، ثبت/جست‌وجوی آگهی و تحلیل تناسب آگهی با کارجو است.

## نیازمندی‌ها
- Python 3.11 یا 3.12
- Docker و Docker Compose (پیشنهادی برای PostgreSQL)
- API key از یک ارائه‌دهندهٔ سازگار با OpenAI Chat Completions

## اجرای محلی با Docker
1. فایل نمونه را کپی کنید:
   ```bash
   cp .env.example .env
   ```
2. در `.env` مقدار `LLM_API_KEY` و `SECRET_KEY` را تنظیم کنید. برای ساخت کلید امن:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(48))"
   ```
3. سرویس‌ها را بالا بیاورید:
   ```bash
   docker compose up --build
   ```
4. مستندات تعاملی API: `http://localhost:8000/docs`
5. بررسی سلامت: `http://localhost:8000/health`

## اجرای بدون Docker
PostgreSQL را اجرا کنید، دیتابیس و کاربر مطابق `DATABASE_URL` بسازید، سپس:
```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# .env را تنظیم کنید
uvicorn app.main:app --reload
```

## جریان کار اصلی
1. `POST /api/auth/register` برای ساخت حساب؛ توکن Bearer دریافت می‌شود.
2. فرانت‌اند توکن را در حافظهٔ امن برنامه نگه دارد و در درخواست‌ها بفرستد:
   `Authorization: Bearer <access_token>`
3. `PUT /api/profile` اطلاعات واقعی کارجو را ذخیره می‌کند.
4. `POST /api/agent/conversations` با `{"target_role":"کارآموز فرانت‌اند"}` مصاحبهٔ رزومه را شروع می‌کند.
5. `POST /api/agent/conversations/{id}/messages` با `{"message":"..."}` پاسخ کارجو را به ایجنت می‌دهد.
6. `POST /api/agent/conversations/{id}/generate-resume` رزومهٔ ساختاریافته تولید و ذخیره می‌کند.
7. رزومه‌ها با `GET /api/resumes` و `GET /api/resumes/{id}` خوانده می‌شوند.
8. آگهی‌ها را می‌توان با `POST /api/jobs` وارد کرد، با `GET /api/jobs?q=frontend` جست‌وجو کرد و با `POST /api/jobs/{id}/match` تطبیق داد.

## نمونه درخواست‌ها
ثبت‌نام:
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","full_name":"کاربر آزمایشی","password":"A-strong-demo-pass-123"}'
```
پروفایل:
```bash
curl -X PUT http://localhost:8000/api/profile \
  -H 'Authorization: Bearer YOUR_TOKEN' -H 'Content-Type: application/json' \
  -d '{"target_role":"کارآموز فرانت‌اند","experience_years":0,"skills":["HTML","CSS","JavaScript"],"education":[],"work_history":[],"preferences":{"employment_type":"internship"}}'
```
تولید رزومه مستقیم از پروفایل:
```bash
curl -X POST http://localhost:8000/api/resumes/generate \
  -H 'Authorization: Bearer YOUR_TOKEN' -H 'Content-Type: application/json' \
  -d '{"target_role":"کارآموز فرانت‌اند","job_description":"","additional_context":"یک پروژه شخصی واقعی با HTML و CSS ساخته‌ام."}'
```

## API endpoints
| Method | Path | توضیح |
|---|---|---|
| GET | `/health` | سلامت سرویس |
| POST | `/api/auth/register` | ثبت‌نام |
| POST | `/api/auth/login` | ورود |
| GET | `/api/auth/me` | حساب جاری |
| GET/PUT | `/api/profile` | خواندن/به‌روزرسانی پروفایل |
| POST | `/api/agent/conversations` | شروع مصاحبهٔ ایجنت |
| POST | `/api/agent/conversations/{id}/messages` | پاسخ به ایجنت |
| POST | `/api/agent/conversations/{id}/generate-resume` | تولید رزومه از مصاحبه |
| POST | `/api/resumes/generate` | تولید رزومه از پروفایل |
| GET | `/api/resumes` | فهرست رزومه‌ها |
| GET | `/api/resumes/{id}` | دریافت رزومه |
| DELETE | `/api/resumes/{id}` | حذف رزومه |
| POST | `/api/jobs` | ثبت آگهی |
| GET | `/api/jobs` | جست‌وجوی آگهی‌ها |
| POST | `/api/jobs/{id}/match` | ارزیابی تناسب با ایجنت |
| GET | `/api/dashboard` | اطلاعات داشبورد |

## اتصال HTML/CSS/JavaScript
نمونه:
```js
const API_BASE = "http://localhost:8000";
async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.detail || "خطای ارتباط با سرور");
  return data;
}
```
در محیط production مقدار `API_BASE` را با URL بک‌اند جایگزین کنید و همان origin فرانت‌اند را به `CORS_ORIGINS` اضافه کنید.

## تست
با PostgreSQL فعال و متغیرهای محیطی تنظیم‌شده:
```bash
pip install -r requirements.txt
pytest -q
```
تست‌ها برای health و OpenAPI هستند؛ برای تست کامل جریان احراز هویت/دیتابیس، تست‌های integration بیشتری اضافه کنید.

## دیپلوی
- روی یک میزبان پشتیبان Docker، PostgreSQL مدیریت‌شده یا volume پایدار تهیه کنید.
- `DATABASE_URL`, `SECRET_KEY`, `LLM_API_KEY`, `LLM_MODEL`, `CORS_ORIGINS` را به صورت secrets در محیط میزبان تنظیم کنید؛ `.env` را در مخزن Git قرار ندهید.
- اجرای کانتینر با `docker compose up --build -d` برای VPS مناسب است؛ reverse proxy با HTTPS (مثلاً Caddy/Nginx) جلوی API قرار دهید.
- برای دیپلوی‌های عمومی، از migrationهای Alembic، rate limit برای login/LLM، محدودیت هزینه، لاگ بدون اطلاعات حساس، بکاپ DB و سیاست نگهداری داده استفاده کنید.
- API آگهی فعلاً بر پایهٔ داده‌های واردشده از کاربر/اپراتور است؛ اتصال به منبع واقعی آگهی‌ها نیازمند API یا مجوز دادهٔ جداگانه است.

## محدودیت‌ها و نکات امنیتی
- MVP با JWT Bearer و هش رمز عبور Argon2 راه‌اندازی می‌شود؛ کلید پیش‌فرض را در production حتماً عوض کنید.
- برای فرانت‌اند عمومی، توکن را ترجیحاً در حافظه نگه دارید؛ ذخیره در `localStorage` در برابر XSS آسیب‌پذیرتر است.
- جداول با `create_all` ساخته می‌شوند؛ برای تغییرات بعدی schema از migration استفاده کنید.
- هیچ رزومه یا سابقه‌ای نباید از سوی مدل جعل شود. خروجی مدل را کاربر پیش از ارسال درخواست شغلی بازبینی کند.
- این بسته سورس بک‌اند است و به‌خودی‌خود روی اینترنت deploy نشده؛ برای تحویل مسابقه باید روی میزبان deploy و با UI واقعی end-to-end آزمایش شود.
