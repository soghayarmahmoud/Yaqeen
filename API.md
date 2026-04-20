# 🔌 API Documentation

This document provides comprehensive documentation for Yaqeen's API endpoints, authentication, and integration guidelines.

> **Note**: This API documentation is for future implementation. Yaqeen currently does not have a public API.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [SDKs & Libraries](#sdks--libraries)
- [Examples](#examples)

---

## 🌟 Overview

### API Base URL
```
https://api.yaqeen.dev/v1
```

### API Versioning
- Current Version: `v1`
- Version Format: `v{major}.{minor}`
- Breaking Changes: Major version increment
- Backward Compatible: Minor version increment

### Content Types
- **Request**: `application/json`
- **Response**: `application/json`
- **Encoding**: UTF-8

### HTTP Methods
- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources
- `DELETE` - Delete resources
- `PATCH` - Partial updates

---

## 🔐 Authentication

### API Key Authentication

Include your API key in the request header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Getting an API Key

1. **Sign up** for a Yaqeen developer account
2. **Create an application** in the developer dashboard
3. **Generate API keys** for your application
4. **Configure permissions** based on your needs

### API Key Scopes

- `read:quran` - Access Quran content
- `read:hadith` - Access Hadith collections
- `read:tafsir` - Access Tafsir content
- `read:articles` - Access Islamic articles
- `write:user` - User data management

### Example Request

```bash
curl -X GET "https://api.yaqeen.dev/v1/quran/surahs" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## ⏱️ Rate Limiting

### Limits

| Plan | Requests/Minute | Requests/Hour | Requests/Day |
|------|-----------------|----------------|--------------|
| Free | 100 | 1,000 | 10,000 |
| Basic | 1,000 | 10,000 | 100,000 |
| Pro | 10,000 | 100,000 | 1,000,000 |
| Enterprise | Unlimited | Unlimited | Unlimited |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### Handling Rate Limits

```javascript
// Check remaining requests
const remaining = response.headers['x-ratelimit-remaining'];

if (remaining === '0') {
  const resetTime = response.headers['x-ratelimit-reset'];
  const waitTime = resetTime - Date.now() / 1000;

  // Wait or show user-friendly message
  console.log(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
}
```

---

## 📡 Endpoints

### Quran Endpoints

#### Get All Surahs
```http
GET /v1/quran/surahs
```

**Parameters:**
- `language` (optional): Translation language (default: "en")
- `limit` (optional): Number of results (default: 114, max: 114)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Al-Fatihah",
      "arabic_name": "الفاتحة",
      "verses_count": 7,
      "revelation_place": "Mecca"
    }
  ],
  "pagination": {
    "total": 114,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

#### Get Specific Surah
```http
GET /v1/quran/surahs/{surah_id}
```

#### Get Surah Verses
```http
GET /v1/quran/surahs/{surah_id}/verses
```

**Parameters:**
- `translation` (optional): Translation ID
- `recitation` (optional): Recitation ID
- `limit` (optional): Number of verses per page
- `page` (optional): Page number

### Hadith Endpoints

#### Get Hadith Collections
```http
GET /v1/hadith/collections
```

#### Get Hadith by Collection
```http
GET /v1/hadith/collections/{collection_name}/hadiths
```

**Parameters:**
- `book` (optional): Book number
- `hadith` (optional): Hadith number
- `limit` (optional): Results per page
- `page` (optional): Page number

### Tafsir Endpoints

#### Get Available Tafsirs
```http
GET /v1/tafsir/tafsirs
```

#### Get Tafsir for Verse
```http
GET /v1/tafsir/tafsirs/{tafsir_id}/verses/{verse_key}
```

### Search Endpoints

#### Search Quran
```http
GET /v1/search/quran
```

**Parameters:**
- `q` (required): Search query
- `language` (optional): Search language
- `size` (optional): Number of results

#### Search Hadith
```http
GET /v1/search/hadith
```

---

## 📊 Data Models

### Quran Models

#### Surah
```json
{
  "id": 1,
  "name": "Al-Fatihah",
  "arabic_name": "الفاتحة",
  "english_name": "The Opening",
  "verses_count": 7,
  "revelation_place": "Mecca",
  "revelation_order": 5
}
```

#### Verse
```json
{
  "id": 1,
  "verse_key": "1:1",
  "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "translations": [
    {
      "id": 1,
      "language": "en",
      "text": "In the name of Allah, the Entirely Merciful, the Especially Merciful"
    }
  ],
  "audio": {
    "url": "https://audio.quran.com/verse/1/1.mp3"
  }
}
```

### Hadith Models

#### Hadith
```json
{
  "id": 1,
  "collection": "bukhari",
  "book": 1,
  "hadith": 1,
  "arabic_text": "حدثنا الحميدي عبد الله بن الزبير، قال: حدثنا سفيان، قال: حدثنا يحيى بن سعيد الأنصاري، قال: سمعت أنس بن مالك يقول...",
  "english_text": "Narrated Anas bin Malik: The Prophet (ﷺ) said...",
  "grade": "Sahih",
  "narrators": ["Al-Humaydi", "Sufyan", "Yahya bin Sa'id"],
  "references": ["Sahih al-Bukhari 1:1"]
}
```

### Tafsir Models

#### Tafsir Entry
```json
{
  "tafsir_id": 1,
  "verse_key": "1:1",
  "text": "بسم الله الرحمن الرحيم: هذه الآية الكريمة هي أول آية في القرآن الكريم...",
  "language": "ar",
  "author": "Ibn Kathir",
  "source": "Tafsir Ibn Kathir"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'surah_id' parameter must be a valid integer between 1 and 114",
    "details": {
      "parameter": "surah_id",
      "provided_value": "abc",
      "expected_type": "integer",
      "valid_range": "1-114"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### Common Error Codes

- `INVALID_PARAMETER` - Invalid request parameter
- `MISSING_PARAMETER` - Required parameter missing
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `AUTHENTICATION_FAILED` - Invalid API key
- `INSUFFICIENT_PERMISSIONS` - API key lacks required scope
- `SERVICE_UNAVAILABLE` - Temporary service outage

---

## 📚 SDKs & Libraries

### Official SDKs

#### JavaScript/TypeScript SDK
```javascript
import { YaqeenAPI } from 'yaqeen-api-sdk';

const client = new YaqeenAPI({
  apiKey: 'YOUR_API_KEY'
});

// Get Quran surahs
const surahs = await client.quran.getSurahs();

// Search hadith
const results = await client.hadith.search({
  query: 'prayer',
  collection: 'bukhari'
});
```

#### Python SDK
```python
from yaqeen_api import YaqeenAPI

client = YaqeenAPI(api_key='YOUR_API_KEY')

# Get specific surah
surah = client.quran.get_surah(1)

# Get hadith collection
hadiths = client.hadith.get_collection('bukhari', limit=10)
```

### Community Libraries

- **PHP**: `yaqeen/php-sdk` - PHP wrapper for Yaqeen API
- **Java**: `yaqeen/java-sdk` - Java client library
- **Go**: `yaqeen/go-client` - Go client for Yaqeen API
- **Ruby**: `yaqeen-ruby` - Ruby gem for API integration

---

## 💡 Examples

### Basic Quran Request

```javascript
// Get all surahs
fetch('https://api.yaqeen.dev/v1/quran/surahs', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

### Search with Pagination

```javascript
const searchQuran = async (query, page = 1) => {
  const response = await fetch(
    `https://api.yaqeen.dev/v1/search/quran?q=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const results = await searchQuran('mercy');
```

### Error Handling Example

```javascript
const makeAPIRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error.message);
    throw error;
  }
};
```

### Rate Limit Handling

```javascript
class YaqeenAPIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.yaqeen.dev/v1';
    this.requests = [];
  }

  async request(endpoint, options = {}) {
    // Implement rate limiting logic
    await this.waitForRateLimit();

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Update rate limit tracking
    this.updateRateLimit(response.headers);

    return response;
  }

  async waitForRateLimit() {
    // Implementation for rate limit handling
  }

  updateRateLimit(headers) {
    // Update remaining requests, reset time, etc.
  }
}
```

---

## 🔗 Related Links

- [Yaqeen Website](https://yaqeen.dev)
- [Developer Portal](https://developers.yaqeen.dev)
- [API Status Page](https://status.yaqeen.dev)
- [Community Forum](https://community.yaqeen.dev)

---

## 📞 Support

Need help with the API?

- **📖 Documentation**: This API documentation
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/yourusername/yaqeen/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/yaqeen/discussions)
- **📧 Developer Support**: developers@yaqeen.dev

---

*This API documentation will be updated as features are implemented. Check back regularly for the latest information.*
