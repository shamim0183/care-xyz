# User Management in NextAuth

## Overview

NextAuth stores user data in MongoDB with the following collections:

- **users** - User profiles and credentials
- **accounts** - OAuth provider accounts (Google, GitHub, etc.)
- **sessions** - Active user sessions

## How to Delete/Remove Users

### 1. Delete User from Database

You can create an API route to delete users:

```javascript
// app/api/admin/users/[userId]/route.js
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()
    const { userId } = params

    // Delete user
    await User.findByIdAndDelete(userId)

    // NextAuth will automatically clean up:
    // - Associated accounts (Google, GitHub, etc.)
    // - Active sessions

    return Response.json({ message: "User deleted successfully" })
  } catch (error) {
    return Response.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
```

### 2. Remove Specific OAuth Provider

To unlink Google/GitHub without deleting the user:

```javascript
// app/api/user/unlink-provider/route.js
import { connectDB } from "@/lib/mongodb"
import { Account } from "@/models/Account" // You need to create this model
import { getServerSession } from "next-auth"

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { provider } = await request.json() // 'google' or 'github'

  try {
    await connectDB()

    // Delete the OAuth account link
    await Account.deleteOne({
      userId: session.user.id,
      provider: provider,
    })

    return Response.json({ message: `${provider} account unlinked` })
  } catch (error) {
    return Response.json({ error: "Failed to unlink account" }, { status: 500 })
  }
}
```

### 3. User Self-Delete

Allow users to delete their own account:

```javascript
// app/api/user/delete-account/route.js
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react"

export async function DELETE(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await connectDB()

    // Delete user and all associated data
    await User.findByIdAndDelete(session.user.id)

    return Response.json({
      message: "Account deleted successfully",
      signOut: true,
    })
  } catch (error) {
    return Response.json({ error: "Failed to delete account" }, { status: 500 })
  }
}
```

## Viewing User Accounts

To see what OAuth providers a user has connected:

```javascript
// In your user profile page
const getUserAccounts = async (userId) => {
  const accounts = await Account.find({ userId })

  return accounts.map((acc) => ({
    provider: acc.provider, // 'google', 'github', 'credentials'
    providerAccountId: acc.providerAccountId,
    createdAt: acc.createdAt,
  }))
}
```

## Database Structure

**Users Collection:**

```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password", // Only if using credentials
  role: "user",
  nidNo: "123456",
  contact: "+880..."
}
```

**Accounts Collection** (managed by NextAuth):

```javascript
{
  userId: ObjectId, // Reference to user
  provider: "google", // or "github", "credentials"
  providerAccountId: "google_user_id",
  type: "oauth",
  access_token: "...",
  refresh_token: "..."
}
```

## Best Practices

1. **Soft Delete**: Instead of hard deleting, mark users as deleted:

   ```javascript
   await User.findByIdAndUpdate(userId, {
     deletedAt: new Date(),
     isActive: false,
   })
   ```

2. **Data Retention**: Keep user data for 30 days before permanent deletion

3. **Cascade Delete**: Ensure you delete:

   - User bookings
   - User reviews
   - User sessions
   - OAuth accounts

4. **Admin Dashboard**: Create an admin page to manage users

Would you like me to create these API routes for your project?
