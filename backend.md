1. Server-side tutor pagination & richer filters
- Why: Current frontend paginates client-side; for large datasets we need backend pagination and filters to keep responses small and allow accurate result counts.
- Suggested endpoint: `GET /api/tutors` support `page`, `pageSize`, `search`, `category`, `minPrice`, `maxPrice`, `minRating`, `mode`, `sort` (rating_desc|price_asc|price_desc|name_asc).
- Example request: `/api/tutors?page=1&pageSize=12&search=react&category=Web%20Development&minRating=4.5&mode=Online&sort=rating_desc`
- Example response:
```
{
  "data": [
    {"id":"t1","name":"Jane","subject":"React","category":"Web Development","hourlyRate":65,"rating":4.9,"mode":"Online"}
  ],
  "page":1,
  "pageSize":12,
  "total":240
}
```
- Priority: High (for scalability and accurate counts).
2. Tutor detail data (reviews, badges, richer profile fields)
- Why: Detail page needs review list, headline, badges, mode/location, and related tutors without client fallbacks.
- Suggested endpoints: `GET /api/tutors/:id` should return {id,name,subject,category,hourlyRate,rating,reviewCount,bio,headline,badges[],mode,location,reviews: [{id,reviewer,rating,comment,date}], media: []}. Optional: `GET /api/tutors/:id/related` for similar tutors.
- Example request: `/api/tutors/abc123`
- Example response:
```
{
  "id":"abc123","name":"Aisha Rahman","subject":"Front-end","category":"Web Development","hourlyRate":65,"rating":4.9,"reviewCount":18,
  "bio":"Senior engineer mentoring React and system design.",
  "headline":"Senior FE @Scale",
  "badges":["Top rated","Online"],
  "mode":"Online","location":"UTC+1",
  "reviews":[{"id":"r1","reviewer":"Sara","rating":5,"comment":"Clear code reviews","date":"2026-03-01"}],
  "media": []
}
```
- Priority: Medium (unlocks richer, accurate detail rendering and review section).
3. Social auth support
- Why: UI now surfaces Google/Facebook buttons; backend needs OAuth flow to enable them.
- Suggested endpoints: `POST /api/auth/social` exchanging provider token for app JWT; or dedicated routes `/api/auth/google` and `/api/auth/facebook` returning {token, role}.
- Example request: `{ provider: "google", idToken: "..." }`
- Example response: `{ token: "jwt", role: "STUDENT" }`
- Priority: Low/Medium (UI currently disabled until backend available).
4. Student profile update endpoint
- Why: Dashboard profile page cannot persist edits yet.
- Suggested endpoint: `PUT /api/profile` accepting {name, timezone, preferences} and returning updated user.
- Example request: `{ "name":"Alex", "timezone":"UTC+6", "preferences":"Interview prep" }`
- Example response: `{ "id":"u1","name":"Alex","email":"alex@example.com","role":"STUDENT","timezone":"UTC+6","preferences":"Interview prep" }`
- Priority: Medium
5. Tutor dashboard aggregates
- Why: Tutor charts/stats need reliable counts (sessions by month, status mix) and rating/review totals.
- Suggested endpoint: `GET /api/tutor/dashboard` returning {sessionsByMonth:[{label,value}], statusCounts:{upcoming,completed,pending}, rating:number, reviewCount:number, recentSessions:[...] }.
- Example response:
```
{
  "sessionsByMonth":[{"label":"2026-1","value":4}],
  "statusCounts":{"upcoming":2,"completed":5,"pending":1},
  "rating":4.8,
  "reviewCount":23,
  "recentSessions":[{"id":"s1","studentName":"Sara","subject":"React","date":"2026-04-10T10:00:00Z","status":"CONFIRMED","mode":"Online"}]
}
```
- Priority: Medium
6. Tutor availability structured slots
- Why: Availability page currently saves JSON string list of day/slots; needs server validation, conflict detection, and normalization.
- Suggested endpoint: `PUT /api/tutor/availability` accept `{ availability: [{ day: "Mon", slots: ["10:00-11:00"] }] }`; `GET /api/tutor/availability` return the same structured shape.
- Example response:
```
{
  "availability": [
    {"day":"Mon","slots":["10:00 AM - 11:00 AM","3:00 PM - 4:00 PM"]},
    {"day":"Wed","slots":["6:00 PM - 7:00 PM"]}
  ]
}
```
- Priority: Medium
