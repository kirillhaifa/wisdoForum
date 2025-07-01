# Iframe Integration

This document describes how to integrate Wisdo Forum into other applications using iframe.

## Overview

The Wisdo Forum supports embedding via iframe and can receive commands from the parent application through postMessage API.

## Supported Events

### 1. NAVIGATION Event
Navigate to a specific page within the forum.

```javascript
iframe.contentWindow.postMessage({
  type: 'NAVIGATION',
  target: '/my-communities' // URL or path to navigate to
}, 'http://localhost:3000');
```

**Supported routes:**
- `/` - Home page
- `/my-communities` - User's communities
- `/profile` - User profile
- `/admin-panel` - Admin panel (admin users only)
- `/community/:id` - Specific community page

### 2. AUTHENTICATION Event
Authenticate user with email and password.

```javascript
iframe.contentWindow.postMessage({
  type: 'AUTHENTICATION',
  email: 'user@example.com',
  password: 'userpassword'
}, 'http://localhost:3000');
```

**Response Events:**
- `AUTHENTICATION_SUCCESS` - Login successful
- `AUTHENTICATION_ERROR` - Login failed

## Test Users

The forum includes the following test users:

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | password | admin |
| user@test.com | password | user |
| mod@test.com | password | moderator |

## Integration Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Host Application</title>
</head>
<body>
    <iframe id="forum" src="http://localhost:3000" width="100%" height="600px"></iframe>
    
    <script>
        const iframe = document.getElementById('forum');
        let iframeReady = false;

        // Listen for messages from iframe
        window.addEventListener('message', (event) => {
            if (event.origin !== 'http://localhost:3000') return;

            switch (event.data.type) {
                case 'IFRAME_READY':
                    iframeReady = true;
                    console.log('Forum iframe is ready');
                    break;
                case 'AUTHENTICATION_SUCCESS':
                    console.log('User logged in:', event.data.email);
                    break;
                case 'AUTHENTICATION_ERROR':
                    console.log('Login failed:', event.data.error);
                    break;
            }
        });

        // Send messages to iframe
        function sendToForum(data) {
            if (iframeReady) {
                iframe.contentWindow.postMessage(data, 'http://localhost:3000');
            }
        }

        // Example: Navigate to user communities
        function showMyCommunities() {
            sendToForum({
                type: 'NAVIGATION',
                target: '/my-communities'
            });
        }

        // Example: Login user
        function loginUser(email, password) {
            sendToForum({
                type: 'AUTHENTICATION',
                email: email,
                password: password
            });
        }
    </script>
</body>
</html>
```

## Security

- Only messages from pre-configured origins are accepted
- Configure allowed origins in `src/hooks/useIframeEvents.ts`
- All authentication is handled through the mock auth system

## Testing

1. Start the forum application: `npm start`
2. Open `http://localhost:3000/iframe-test.html` in your browser
3. Use the test controls to send navigation and authentication events
4. Monitor the message log to see communication between host and iframe

## Configuration

To add new allowed origins, edit the `ACCEPTED_EVENT_ORIGINS` set in `src/hooks/useIframeEvents.ts`:

```typescript
const ACCEPTED_EVENT_ORIGINS: ReadonlySet<string> = new Set([
  "http://localhost:3000",
  "https://your-host-app.com",
  "https://another-allowed-domain.com"
]);
```
