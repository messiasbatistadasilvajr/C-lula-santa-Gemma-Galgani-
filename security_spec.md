# Security Specification - Santa Gemma Galgani Célula

## 1. Data Invariants
1. **User Identity & Roles**: A user cannot claim an admin or formador role unless explicitly assigned. Normal users cannot update other users' profiles.
2. **Post Author Integrity**: Posts must be authored by the currently authenticated user (`authorId == request.auth.uid`). No spoofed posts.
3. **Prayer Chain Integrity**: Prayer intentions must belong to the author. Pray count increments are controlled; users cannot forge answered status unless author or admin/formador.
4. **Chat Message Integrity**: `senderId` in chat messages must strictly equal `request.auth.uid`.
5. **Notice Control**: Only users with role `admin` or `formador` can publish cell notices.
6. **Service Scales & Meeting Guides**: Only cell coordinators (`admin` or `formador`) can publish and assign scales.
7. **Songbook & Liturgy**: Members can read songs and liturgy; song curation is maintained securely.
8. **Size & Type Bounds**: All strings are constrained with `.size() <= MAX` to prevent DoS or wallet exhaustion.

## 2. The "Dirty Dozen" Payloads (Must be REJECTED)
1. **Payload 1: Unauthenticated Post Creation**
   - Collection: `/posts/post_123`
   - Data: `{ "title": "Invasor", "content": "Texto não autenticado", "authorId": "user_xyz" }`
   - Expected: `PERMISSION_DENIED`
2. **Payload 2: User Spoofing (Impersonation in Posts)**
   - Auth: `uid: user_abc`
   - Collection: `/posts/post_123`
   - Data: `{ "authorId": "victim_user", "content": "Mensagem fraudulenta", "type": "aviso" }`
   - Expected: `PERMISSION_DENIED` (authorId != request.auth.uid)
3. **Payload 3: Privilege Escalation in User Profile**
   - Auth: `uid: user_abc` (role: membro)
   - Collection: `/users/user_abc`
   - Data: `{ "role": "admin" }`
   - Expected: `PERMISSION_DENIED`
4. **Payload 4: Large Payload / Denial-of-Wallet Attack**
   - Auth: `uid: user_abc`
   - Collection: `/posts/post_123`
   - Data: `{ "content": "A".repeat(100000), "authorId": "user_abc" }`
   - Expected: `PERMISSION_DENIED` (content.size() > 5000)
5. **Payload 5: Malicious ID Injection (Path Traversal/Poisoning)**
   - Auth: `uid: user_abc`
   - Path: `/posts/../../secrets` or invalid regex characters
   - Expected: `PERMISSION_DENIED`
6. **Payload 6: Chat Message Spoofing**
   - Auth: `uid: user_abc`
   - Path: `/chats/geral/messages/msg_1`
   - Data: `{ "senderId": "admin_user", "text": "Aviso falso" }`
   - Expected: `PERMISSION_DENIED`
7. **Payload 7: Unauthorized Notice Creation**
   - Auth: `uid: user_abc` (membro)
   - Path: `/notices/not_1`
   - Data: `{ "title": "Aviso Não Autorizado", "priority": "alta" }`
   - Expected: `PERMISSION_DENIED` (only admin/formador)
8. **Payload 8: Unauthorized Notice Deletion**
   - Auth: `uid: user_abc` (membro)
   - Path: `/notices/not_1`
   - Action: `delete`
   - Expected: `PERMISSION_DENIED`
9. **Payload 9: Unauthorized Scale Modification**
   - Auth: `uid: user_abc` (membro)
   - Path: `/scales/sc_1`
   - Data: `{ "theme": "Tentativa de alteração", "animator": "Hacker" }`
   - Expected: `PERMISSION_DENIED`
10. **Payload 10: Updating Immutable Fields (createdAt tampering)**
    - Auth: `uid: user_abc`
    - Path: `/posts/post_123`
    - Data: `{ "createdAt": "1970-01-01" }`
    - Expected: `PERMISSION_DENIED`
11. **Payload 11: Modifying Another User's Profile**
    - Auth: `uid: user_abc`
    - Path: `/users/user_def`
    - Data: `{ "name": "Nome Alterado" }`
    - Expected: `PERMISSION_DENIED`
12. **Payload 12: Blanker Read of Private Data**
    - Path: `/secrets` or catch-all non-matching docs
    - Expected: `PERMISSION_DENIED`
