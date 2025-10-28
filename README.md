# 🧩 Admin Panel – User Management Dashboard

Administrative panel developed with **Next.js 15**, **React 19**, and **TailwindCSS 4**, which allows you to manage users, roles, and permissions by connecting to a secure API with authentication via **JWT + HttpOnly Cookies**.

## 🚀 Main features
- 🔐 **Secure authentication** with JWT and `HttpOnly` cookies (`SameSite=Strict`).
- 👥 **Complete user and role management**.
- ⚙️ **Dynamic panel** with reusable components and interactive table (Excel like) with pagination.
- 🔄 **Integration with modular backend** (based on my Node.js + Express template).
- ⚡ **Optimized rendering** with `React.Suspense` for asynchronous and lazy loading.
- 🎨 **Responsive interface** with TailwindCSS 4.
- 🧠 **Typed validations** with TypeScript 5.
- 💬 **Dynamic tooltips** with `react-tooltip`.
- 🔔 **Custom notification hook** with support for animations and alert types (success, error, warning).
- ✅ **Data validation** before sending requests to the backend, ensuring integrity and consistency.
- 📨 **Optimized local update:** after editing a field, the table synchronizes the changes in the frontend without requiring a new API call, reducing resource consumption.
- 🔄 **Automatic rollback:** If the server rejects the request or an error occurs during the update, the edited data reverts to its original state to maintain visual consistency and avoid inconsistencies.

## 🧱 Technologies used
| Type | Technology |
|------|-------------|
| Framework | [Next.js 15](https://nextjs.org/) |
| Frontend | [React 19](https://react.dev/) |
| Styles | [TailwindCSS 4](https://tailwindcss.com/) |
| Tables | [@tanstack/react-table](https://tanstack.com/table) |
| Tooltips | [react-tooltip](https://www.npmjs.com/package/react-tooltip) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Backend API | [Node.js + Express + JWT Template](https://github.com/LautaroCepeda-Developer/Advanced_JWT_Backend_Template) |

## 🖥️ Screenshots
### Users Table
<img width="1366" height="728" alt="Dashboard - Users" src="https://github.com/user-attachments/assets/700aaac2-e9d1-46a8-9897-2a7076d0f58f" />

### Roles Table
<img width="1366" height="728" alt="Dashboard - Roles" src="https://github.com/user-attachments/assets/c57cc873-6b6e-48ad-bf93-8659ffadc968" />

### Add User Form
<img width="1366" height="728" alt="Dashboard - Add User Form" src="https://github.com/user-attachments/assets/a3c3b66e-9444-47bd-8096-4bf329105d7b" />

### Add Role Form
<img width="1366" height="728" alt="Dashboard - Add Role Form" src="https://github.com/user-attachments/assets/9239a8de-319a-4e43-b003-59970bf7d4f2" />

## 📹 Videos
### Accessing to the dashboard
https://github.com/user-attachments/assets/4925eb96-fcb1-441d-9324-fe02595e3570

### Lazy loading tables with pagination and caching the views
https://github.com/user-attachments/assets/f04a912f-5097-4cbf-a4a9-59d0d02ff480

### Field edition and data syncronization
https://github.com/user-attachments/assets/025105db-06aa-4016-a2ed-52a0ac6df4d7

### Adding and deleting a user
https://github.com/user-attachments/assets/0fdaed5d-ee61-4ac6-97d8-759756ae6b4f

### Adding and deleting a role
https://github.com/user-attachments/assets/3edf5c6e-db5c-47f2-b275-a7d837e8db69

### Automatic rollback on request failed
https://github.com/user-attachments/assets/2251b78b-df06-4111-8ce2-682d0817e035

### Redirect to the login form on invalid or unauthorized session
https://github.com/user-attachments/assets/9bd88da1-7893-49a5-8c25-cbd13e74eb0b

### Notifications
https://github.com/user-attachments/assets/d2d0d7ce-919c-4d4b-992f-73d29b5ca5bd

https://github.com/user-attachments/assets/e9db9281-74fe-449f-8f80-3d6d6c967d20


