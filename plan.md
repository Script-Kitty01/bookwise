# BookWise — Fixes & Features Plan

> Generated: 2026-07-27 | Branch: `main`

---

## ✅ Already Fixed (Previous Session)

| #   | File                        | Issue                                                                              | Status   |
| --- | --------------------------- | ---------------------------------------------------------------------------------- | -------- |
| F1  | `app/(auth)/layout.tsx`     | Missing `export default` — auth pages couldn't render                              | ✅ Fixed |
| F2  | `components/BorrowBook.tsx` | Missing `return` after ineligibility toast — borrow proceeded even when ineligible | ✅ Fixed |
| F3  | `types.d.ts`                | `isLoanedBook` not declared in `Book` interface — type error in `BookCard`         | ✅ Fixed |
| F4  | `app/(root)/page.tsx`       | Debug `console.log` dumping all users; unused imports; typo `lastestBooks`         | ✅ Fixed |
| F5  | `middleware.ts`             | No route matcher — auth ran on static assets, fonts, images                        | ✅ Fixed |
| F6  | `app/admin/layout.tsx`      | `<Sidebar>` and `<Header>` wrapped in invalid `<p>` tags                           | ✅ Fixed |
| F7  | `next.config.ts`            | Missing `experimental: { after: true }` for `after()` API                          | ✅ Fixed |

---

## 🔴 Critical Bugs (Remaining)

### BUG-1: `BookForm` is structurally broken

**File:** `components/admin/forms/BookForm.tsx`
**Severity:** Critical — form cannot submit correctly

- Each field is wrapped in its **own separate** `<Form>` + `<form>` pair instead of one unified form
- The submit button only exists inside the last `<Form>` block, so only the `summary` field would be submitted
- The **genre** field uses `name={"title"}` instead of `name={"genre"}`
- The **rating** field is **duplicated** (appears twice)
- The **coverUrl** field has label "book video" but should be "book cover" (image upload, not video)
- Unused import: `fileURLToPath` from `"url"`
- Router push uses single quotes: `'/admin/books/${result.data.id}'` — won't interpolate (needs backticks)
- The `...book` spread props and `type` prop are accepted but never used (no edit/update mode)

**Fix:** Rewrite `BookForm` as a single `<Form>` with one `<form>` containing all fields.

---

### BUG-2: `BookList` won't render a single book

**File:** `components/BookList.tsx` · Line 11
**Severity:** High

```ts
if (books.length < 2) return; // ← should be < 1 or === 0
```

A list with exactly 1 book returns nothing. Should be `if (books.length === 0) return null;`.

---

### BUG-3: Home page crashes when no books exist

**File:** `app/(root)/page.tsx`
**Severity:** High

```ts
<BookOverview {...latestBooks[0]} ... />
```

If the database has zero books, accessing `latestBooks[0]` throws. Needs a guard or fallback UI.

---

### BUG-4: Admin layout uses relative redirect

**File:** `app/admin/layout.tsx` · Line 15
**Severity:** High

```ts
if (!session?.user?.id) redirect("sign-in"); // relative — becomes /admin/sign-in
```

Should be `redirect("/sign-in")`.

---

### BUG-5: `<BookForm>` wrapped in `<p>` tags

**File:** `app/admin/books/new/page.tsx` · Line 14
**Severity:** Medium

```tsx
<p>
  <BookForm />
</p>
```

A `<form>` inside a `<p>` is invalid HTML — the browser will auto-close the `<p>` before the `<form>`, breaking the DOM.

---

## 🟡 Medium Bugs

### BUG-6: `too-fast` page has typos

**File:** `app/too-fast/page.tsx`

- `"your going too fast"` → `"you're going too fast"`
- `"text-light"` class doesn't exist (should be `"text-light-100"`)

### BUG-7: Unused import in Header

**File:** `components/Header.tsx` · Line 9

- `import { sampleBooks } from "@/constants";` — never used

### BUG-8: `my-profile` uses hardcoded sample data

**File:** `app/my-profile/page.tsx`

- Uses `sampleBooks` instead of fetching actual borrowed books from the database

### BUG-9: `BookCard` shows hardcoded return days

**File:** `components/BookCard.tsx` · Line 38

- `"11 days left to return"` is hardcoded — should calculate from `dueDate`

### BUG-10: `after()` may silently fail

**File:** `app/(root)/layout.tsx`

- `after()` is experimental in Next.js 15.1 and may not execute reliably in all environments (serverless, edge). Consider moving last-activity updates to a direct `await` call or a background job.

---

## 🚀 Missing Features — Must Implement

### FEAT-1: Admin Books Table

**File:** `app/admin/books/page.tsx`
Currently just shows `<p>Table</p>`. Needs:

- Fetch all books from DB
- Display in a table with columns: Title, Author, Genre, Copies, Available, Actions
- Edit / Delete actions per row

### FEAT-2: Admin Dashboard

**File:** `app/admin/page.tsx`
Currently just `"admin dashboard"` text. Needs:

- Stats cards: Total Books, Total Users, Pending Approvals, Active Borrows
- Recent activity feed

### FEAT-3: Admin — User Management Page

**Route:** `/admin/users` (referenced in sidebar, page doesn't exist)

- List all users with status
- Approve / Reject pending users
- Change user roles

### FEAT-4: Admin — Borrow Requests Page

**Route:** `/admin/book-requests` (referenced in sidebar, page doesn't exist)

- List all borrow records
- Approve / Reject borrow requests
- Mark returns

### FEAT-5: Admin — Account Requests Page

**Route:** `/admin/account-requests` (referenced in sidebar, page doesn't exist)

- List users with `PENDING` status
- Approve / Reject account registrations

### FEAT-6: Book Detail Page

**Route:** `/books/[id]` (referenced in `BookCard` links)

- Full book details
- Borrow button
- Book preview / trailer video

### FEAT-7: Library Page

**Route:** `/library` (referenced in `Header` navigation)

- Browse all books with search & filter
- Genre filtering
- Sort by rating, title, recency

### FEAT-8: Search Functionality

**Files:** `components/admin/Header.tsx`, new search component

- Global search for books by title, author, genre
- Search results dropdown

### FEAT-9: Return Book Flow

- Button on borrowed books to mark as returned
- Update `availableCopies` and `borrowRecords.status`
- Show return confirmation

### FEAT-10: Book Receipt Download

**File:** `components/BookCard.tsx` (button exists but does nothing)

- Generate a receipt with borrow details
- Download as PDF or print-friendly view

### FEAT-11: Actual Borrowed Books on Profile

**File:** `app/my-profile/page.tsx`

- Fetch user's borrowed books from `borrowRecords` joined with `books`
- Show due dates, status
- Return action per book

### FEAT-12: Edit Book (Admin)

**File:** `components/admin/forms/BookForm.tsx`

- The `type` and `...book` props exist but aren't used
- Add update mode: pre-fill form with existing book data
- `PUT`/`PATCH` server action to update book

### FEAT-13: Delete Book (Admin)

- Server action to delete a book
- Confirmation dialog
- Handle books that have active borrow records

### FEAT-14: Pagination

**Files:** CSS classes exist in `globals.css` but no component

- Paginate book lists (home page, library, admin)
- Reusable pagination component

### FEAT-15: Wire Up Onboarding Emails

**File:** `app/api/workflows/onboarding/route.ts`

- `sendEmail()` and `getUserState()` are stubs
- Integrate with actual email service (Resend via QStash is already configured in `lib/workflow.ts`)
- Trigger workflow on sign-up

### FEAT-16: Loading & Error States

- Add `loading.tsx` files for suspense boundaries on data-fetching pages
- Add `error.tsx` files for error boundaries
- Skeleton loaders for book cards and tables

### FEAT-17: Empty States

- Show meaningful empty states when no books exist, no borrows, no users
- Illustrated empty states with CTAs

---

## 🏗️ Architecture / Tech Debt

| #   | Item                                                                                                              | Priority |
| --- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| TD1 | Add `.env.example` file documenting all required environment variables                                            | High     |
| TD2 | Add `loading.tsx` and `error.tsx` at route level for better UX                                                    | Medium   |
| TD3 | Consider moving `after()` logic to a direct await or serverless function for reliability                          | Medium   |
| TD4 | Add input sanitization (already have Zod, but no XSS protection on text fields)                                   | Medium   |
| TD5 | Add `metadata` for SEO on all pages (only root layout has it)                                                     | Low      |
| TD6 | The `borrowRecords.dueDate` is stored as `date` but `borrowBook` passes a date string — ensure type compatibility | Low      |

---

## 📋 Implementation Order (Recommended)

1. **BUG-1** — Fix BookForm (blocks admin book creation)
2. **BUG-2, BUG-3** — Fix BookList & Home crash guards
3. **BUG-4, BUG-5** — Fix admin redirect & invalid HTML
4. **BUG-6 through BUG-10** — Typos, unused imports, hardcoded data
5. **FEAT-1, FEAT-2** — Admin books table & dashboard
6. **FEAT-3, FEAT-4, FEAT-5** — Admin user/borrow/account management
7. **FEAT-6, FEAT-7** — Book detail & library pages
8. **FEAT-11, FEAT-9** — Profile borrowed books & return flow
9. **FEAT-8** — Search
10. **FEAT-12, FEAT-13** — Edit/Delete books
11. **FEAT-14, FEAT-15, FEAT-16, FEAT-17** — Pagination, emails, loading/error/empty states
12. **TD1 through TD6** — Tech debt cleanup
