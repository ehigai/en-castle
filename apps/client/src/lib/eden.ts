import { treaty } from "@elysia/eden"
import type { App } from "@server/index"

export const api = treaty<App>("http://localhost:3000")
