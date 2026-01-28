# SkillBridge API Reference

Base URL: `http://localhost:5001`

Authentication: Bearer JWT in `Authorization` header. All endpoints marked 🔒 require a valid token. Role-guarded endpoints list required role(s).

## Auth
- `POST /api/auth/register`  
  Body: `{ name, email, password, role? = "STUDENT" }`  
  Response: `{ success: true, token, user }`

- `POST /api/auth/login`  
  Body: `{ email, password }`  
  Response: `{ success: true, token, user }`

- `GET /api/auth/me` 🔒 Any role  
  Response: `{ success: true, user: { id, name, email, role, tutorProfile? } }`  
  cURL: `curl -H "Authorization: Bearer $TOKEN" $BASE/api/auth/me`

## Bookings
- `POST /api/bookings` 🔒 role=STUDENT  
  Body: `{ tutorId, dateTime }` (ISO string)  
  Response: `{ success: true, booking }`

- `GET /api/bookings/my` 🔒 role=STUDENT  
  Returns bookings for logged-in student.  
  cURL: `curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/my`

- `GET /api/bookings/tutor` 🔒 role=TUTOR  
  Returns bookings for logged-in tutor.  
  cURL: `curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/tutor`

- `GET /api/bookings/stats` 🔒 role=STUDENT  
  Returns counts: `{ stats: { upcoming, completed, cancelled } }`  
  cURL: `curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/stats`

Booking status enum: `UPCOMING | COMPLETED | CANCELLED | PENDING | CONFIRMED` (UPCOMING is default).

## Admin
- `GET /api/admin/stats` 🔒 role=ADMIN  
  Response: `{ success: true, stats: { totalUsers, totalTutors, totalStudents, totalBookings } }`  
  cURL: `curl -H "Authorization: Bearer $TOKEN" $BASE/api/admin/stats`

## Tutors
- `GET /api/tutors`  
  List tutors with profiles.
- `GET /api/tutors/:id`  
  Tutor detail.
- `GET /api/tutors/search?query=...`  
  Search tutors.

## Reviews
- `POST /api/reviews` 🔒 role=STUDENT  
  Body: `{ tutorId, rating (1-5), comment? }`  
  Response: `{ success: true, review }`
- `GET /api/reviews/tutor/:tutorId`  
  List reviews for a tutor.

## Error format
Errors return appropriate HTTP status and `{ success: false, error: "message" }`.

## Quick test setup
```bash
export BASE=http://localhost:5001
export TOKEN=<your_jwt>
curl -H "Authorization: Bearer $TOKEN" $BASE/api/auth/me
curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/my
curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/tutor
curl -H "Authorization: Bearer $TOKEN" $BASE/api/bookings/stats
curl -H "Authorization: Bearer $TOKEN" $BASE/api/admin/stats
```
