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
