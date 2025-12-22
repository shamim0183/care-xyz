/**
 * NextAuth API Route Handler
 *
 * This file sets up the authentication endpoints for NextAuth v5.
 * All auth requests (login, logout, session, etc.) are handled here.
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
