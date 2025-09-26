# Richard App — Task Plan (Flutter)

## Overview
- **State management**: GetX (routing, simple state), Bloc (complex flows: auth, profile, users)
- **Networking**: Dio
- **Image**: Image picker + cropper (plus points)
- **Storage**: Secure storage for tokens
- **Env**: `.env` support

## Features (Required)
1. Register (with role selection: admin/user)
2. Login
3. Forgot Password (Lupa Password)
4. Edit Profile (name, email, avatar)
5. User List + Search (Admin only)
6. User Detail (Admin only)
7. Logout

## Role-Based Access Control
- **Admin**: Can access user list, user details, manage other admins
- **User**: Can only access own profile, edit own profile
- Role stored in JWT token and user model

## Plus Points
- Avatar upload
- Avatar crop
- Pagination on User List

## API Contracts (high-level)
- `POST /auth/register` { name, email, password, role } -> { accessToken, refreshToken, user }
- `POST /auth/login` { email, password } -> { accessToken, refreshToken, user }
- `POST /auth/forgot` { email }
- `POST /auth/logout` (auth)
- `GET /users` (auth: admin only, query: `q`, `page`, `limit`)
- `GET /users/:id` (auth: admin only)
- `GET /me` (auth)
- `PUT /me` (auth, multipart form: name, avatar?)

## Project Structure
```
lib/
  main.dart
  app/
    routes/
      app_pages.dart
      app_routes.dart
    theme/
      theme.dart
    env/
      env.dart
  data/
    models/
      user_model.dart
      auth_user_model.dart
      role_enum.dart
    providers/
      api_client.dart  // Dio
      auth_api.dart
      user_api.dart
    repositories/
      auth_repository.dart
      user_repository.dart
  domain/
    entities/
      user.dart
    usecases/
      login.dart
      register.dart
      fetch_users.dart
  presentation/
    common/
      widgets/
      utils/
    auth/
      login/
        login_page.dart
        login_cubit.dart
      register/
        register_page.dart
        register_cubit.dart
      forgot/
        forgot_page.dart
        forgot_cubit.dart
    profile/
      edit_profile_page.dart
      profile_bloc.dart
    users/
      list/
        users_page.dart
        users_bloc.dart
      detail/
        user_detail_page.dart
        user_detail_cubit.dart
    guards/
      admin_guard.dart
    splash/
      splash_page.dart
    home/
      home_page.dart

assets/
  images/

```

## Dependencies
- dio
- get, get_storage (optional), flutter_secure_storage
- flutter_bloc, equatable
- image_picker, image_cropper (plus)
- json_annotation, build_runner, json_serializable
- dotenv (flutter_dotenv)

## Task Breakdown

### 1) Scaffolding & Core
- Initialize Flutter project
- Add dependencies (Dio, GetX, Bloc, secure storage, etc.)
- Configure `flutter_dotenv`
- Create `api_client.dart` with Dio interceptors (auth header, logging)
- Create routing via GetX `AppPages` and guards for auth
- Add theme and base UI components
- Implement token storage service

### 2) Authentication
- Pages: Login, Register (with role selection), Forgot Password
- Cubits for each page with validation state
- Repository: `AuthRepository` for API calls (login, register, forgot, logout)
- Persist tokens, set auth header, navigate to Home on success
- Error handling with friendly messages
- Role-based navigation: Admin -> Users list, User -> Profile only

### 3) Profile
- Page: Edit Profile
- Bloc: `ProfileBloc` for load current user (`GET /me`) and update (`PUT /me`)
- Support image picking and optional cropping, multipart upload
- Update local user cache and avatar UI

### 4) Users (Admin Only)
- Users list with search box
- Bloc: `UsersBloc` with pagination (page, limit)
- Debounced search query
- Pull to refresh and infinite scroll
- User detail page: `GET /users/:id`
- Admin guard middleware for route protection

### 5) Logout
- Call `POST /auth/logout`
- Clear tokens and user cache, navigate to login

## Acceptance Criteria
- **Auth**: Register with role selection, login, forgot work; invalid inputs show errors; tokens persisted securely
- **Profile**: Can edit name and avatar; shows updated avatar after save
- **Users**: Admin-only access; List shows paginated results; search filters; detail shows correct user
- **Role-based**: Admin sees user management, User sees only profile; proper route guards
- **Stability**: Graceful error handling; loading indicators; offline messages
- **Code quality**: Bloc for complex flows, GetX for routing; DI via simple factories

## Milestones
- M1: Project setup + Auth pages working
- M2: Profile update + avatar upload/crop
- M3: Users list + search + pagination + detail
- M4: Polishing, logout, error states, UX
