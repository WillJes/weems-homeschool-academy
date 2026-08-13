# Weems-Rosenduft Academy

This is the Vercel-ready migration of the Weems Homeschool Command Center.

The full public Academy dashboard, curriculum, planning tools, science and art
lab inventory, attendance tools, standards, reminders, books, reporting
interfaces, and instructor resource links are included.

## Protected records migration status

The original ChatGPT Sites deployment uses platform-managed authentication,
database storage, and file storage. Those private records are not stored in this
Git repository. Until Vercel authentication, Postgres, and private file storage
are connected, the original site remains the source of truth for administrator
records and portfolio uploads. The migration API returns a clear maintenance
message instead of accepting data that could be lost.

## Development

```bash
npm install
npm run dev
```

Import this repository in Vercel. It is a standard Next.js project and does not
need a build-command override.

Migration source: ChatGPT Sites commit
`b4bafcd47bdbbbe40f4820815f7a211d6f4fe23d`.
