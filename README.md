# Research Lab Website

Trang web giới thiệu nhóm nghiên cứu — built với **Hugo** + **Decap CMS** + **Netlify**.

Theme tự viết (đặt ở `layouts/`), không dùng submodule. Toàn bộ nội dung quản lý qua giao diện `/admin`.

## Cấu trúc thư mục

```
.
├── hugo.toml              # Cấu hình Hugo
├── netlify.toml           # Cấu hình build & deploy Netlify
├── archetypes/            # Template khi tạo content mới qua hugo CLI
├── content/               # Markdown content (CMS ghi vào đây)
│   ├── _index.md
│   ├── members/           # Thành viên
│   ├── publications/      # Bài báo
│   ├── projects/          # Dự án
│   └── news/              # Tin tức
├── data/                  # Dữ liệu hero & contact (CMS ghi vào đây)
│   ├── hero.yml
│   └── contact.yml
├── layouts/               # Theme tự viết
│   ├── _default/          # baseof, list, single
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── sections/      # Hero, Members, Publications, Projects, News, Contact
│   └── index.html         # Homepage (gộp các section)
└── static/
    ├── admin/             # Decap CMS
    │   ├── index.html
    │   └── config.yml
    ├── css/main.css
    ├── js/main.js
    ├── favicon.svg
    └── images/uploads/    # Ảnh tải lên qua CMS
```

## 1. Chạy local

### Yêu cầu

- [Hugo extended](https://gohugo.io/installation/) **>= 0.140.0**
- Git

### Lệnh

```bash
git clone <repo-url>
cd <repo>
hugo server -D
```

Mở `http://localhost:1313`.

> `/admin` chạy local sẽ không login được vì cần Netlify Identity — bạn phải deploy lên Netlify trước. Có thể tạm dùng [git-gateway local](https://decapcms.org/docs/working-with-a-local-git-repository/) nếu muốn test CMS offline.

### Tạo content qua CLI (tuỳ chọn)

```bash
hugo new content members/ten-thanh-vien.md
hugo new content publications/2025-ten-bai-bao.md
hugo new content projects/ten-du-an.md
hugo new content news/2025-04-20-tieu-de.md
```

## 2. Push lên GitHub

```bash
git add .
git commit -m "init lab website"
git branch -M main
git remote add origin git@github.com:<user>/<repo>.git
git push -u origin main
```

## 3. Deploy lên Netlify

### Tạo site

1. Đăng nhập [Netlify](https://app.netlify.com) → **Add new site → Import from Git** → chọn repo.
2. Build settings sẽ được đọc tự động từ `netlify.toml` (build command `hugo --gc --minify`, publish directory `public`, Hugo version `0.140.0`).
3. Bấm **Deploy site**.

### Bật Netlify Identity (để login `/admin`)

1. Vào **Site configuration → Identity → Enable Identity**.
2. **Registration preferences** → đổi sang **Invite only** (không cho người lạ tự đăng ký).
3. **External providers** (tuỳ chọn): bật Google/GitHub để đăng nhập nhanh.
4. **Services → Git Gateway → Enable Git Gateway**.

### Mời người dùng

**Identity → Invite users** → nhập email biên tập viên → họ sẽ nhận email đặt mật khẩu.

## 4. Sử dụng `/admin`

1. Truy cập `https://<site>.netlify.app/admin/`.
2. Đăng nhập bằng tài khoản Netlify Identity vừa được mời.
3. Thêm/sửa/xoá nội dung trong các collection:
   - **Cài đặt website** — sửa Hero & Contact.
   - **Thành viên / Bài báo / Dự án / Tin tức** — CRUD trực tiếp.
4. Mỗi lần lưu, Decap CMS commit vào nhánh `main` → Netlify tự build & deploy lại.

## 5. Tuỳ biến

| Việc cần làm | File |
|---|---|
| Đổi tên/menu lab | `hugo.toml` |
| Đổi nội dung Hero/Contact ban đầu | `data/hero.yml`, `data/contact.yml` |
| Sửa màu sắc, font, layout | `static/css/main.css` |
| Sửa cấu trúc HTML từng section | `layouts/partials/sections/*.html` |
| Thêm/bớt collection trong CMS | `static/admin/config.yml` |
| Bật duyệt nội dung trước khi xuất bản | mở dòng `publish_mode: editorial_workflow` trong `static/admin/config.yml` |

## 6. Một số ghi chú

- `baseURL` trong `hugo.toml` nên đổi sang domain chính thức sau khi deploy.
- Khi đổi `static/admin/config.yml`, các collection cũ vẫn giữ dữ liệu (vì là file Markdown), chỉ cần đảm bảo `name` của field khớp với front-matter hiện có.
- Decap CMS phiên bản này (`^3.8.0`) là kế thừa của Netlify CMS — đã được Decap Foundation duy trì.

## 7. Troubleshooting

- **Build Netlify lỗi `Hugo version`**: kiểm tra `HUGO_VERSION` trong `netlify.toml`.
- **`/admin` không login được**: kiểm tra Identity đã bật, Git Gateway đã enable, user đã accept invite.
- **Ảnh upload không hiện**: kiểm tra `media_folder` (`static/images/uploads`) và `public_folder` (`/images/uploads`) trong `static/admin/config.yml`.
