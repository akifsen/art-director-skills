# İskele Reading Room — fictional evaluation

Build a finished React interface for a small neighbourhood lending library.
The reader's task is to find an available book, inspect its details, reserve
it for a pickup day, and see or cancel their reservation. All content is
fictional, session-only demo state; do not imply a real reservation.

Use the supplied books unchanged. Search title/author, filter available
books, show details, and provide a reservation form with reader name and
pickup day (Monday/Tuesday/Wednesday). Empty name must prevent submission.
Cancel editing must leave the record unchanged. Successful reservation
must update availability and a reachable My reservations view. Cancel a
reservation must release the book. Include empty search, simulated catalogue
error with Retry, and a long title. No login, payment, backend or external
asset/font fetches. Original typography-only book jackets are allowed when
clearly described as fictional covers. Keep Turkish glyphs intact.

Design desktop 1440×900 and phone 390×844, including detail and form. Use
existing React/Vite dependencies at repository root. Edit only your assigned
output directory. Build with its vite.config.js; use the available browser
and image tools to inspect a representative real render before extending,
then check the completed flow. Record observable references loaded, actual
skill file hashes, model identifier if exposed, checks and limitations in
RUN.md. Do not claim IDE discovery when the skill was supplied by path.

Budget: one initial implementation and at most two evidence-driven correction
passes, about 8,000 output tokens. Record setup separately from design work.
