# Backend Design Decisions

## Overview
This document explains the design choices made for the backend implementation of the CountryVote platform, how they meet both functional and non-functional requirements, and any trade-offs made due to time constraints.

## Recent Enhancements

### Health Monitoring Module
- **Enhancement**: Extended health check to monitor both MongoDB database and external REST Countries API
- **Rationale**: Provides comprehensive system health visibility for operations and debugging
- **Implementation**: Using `@nestjs/terminus` with `HttpHealthIndicator` for API status checks
- **Benefit**: Early detection of infrastructure issues before they affect users

### Statistics Module
- **Enhancement**: New dedicated module for voting analytics and visualizations
- **Endpoints**:
  - `GET /statistics` - Comprehensive stats (total votes, unique countries, regional distribution, timeline)
  - `GET /statistics/regions` - Votes aggregated by geographical region
  - `GET /statistics/timeline` - Daily vote counts over time
- **Rationale**: Separates analytics concerns from core voting logic, enabling rich data visualizations
- **Implementation**: Leverages existing VotesService methods with additional aggregation logic
- **Benefit**: Enables dashboard and chart features without cluttering the Votes module

### Alphabetically Sorted Swagger Documentation
- **Enhancement**: Configured SwaggerUI to sort API tags and operations alphabetically
- **Rationale**: Improves API discoverability and consistency
- **Implementation**: Added `tagsSorter: 'alpha'` and `operationsSorter: 'alpha'` to Swagger setup
- **Benefit**: Easier navigation of API documentation

---

## Technology Stack Decisions

### 1. NestJS Framework
**Decision**: Use NestJS as the primary backend framework.

**Rationale**:
- **Enterprise-grade architecture**: NestJS provides a well-structured, modular architecture out of the box, making the codebase maintainable and scalable
- **TypeScript-first**: Strong typing reduces runtime errors and improves developer experience
- **Built-in features**: Includes dependency injection, decorators, and middleware support
- **Excellent documentation**: Well-documented with extensive community support
- **Testing support**: First-class testing utilities with Jest integration

**Functional Requirements Met**:
- Supports RESTful API development for all voting and country endpoints
- Enables clean separation of concerns (controllers, services, modules)
- Facilitates input validation and error handling

**Non-Functional Requirements Met**:
- **Maintainability**: Modular structure makes code easy to understand and modify
- **Scalability**: Dependency injection and module system support growing applications
- **Performance**: Efficient request handling with built-in optimization features

---

### 2. MongoDB with Mongoose
**Decision**: Use MongoDB as the database and Mongoose as the ODM.

**Rationale**:
- **Document-based storage**: Votes are simple documents with consistent structure, ideal for NoSQL
- **Schema flexibility**: Easy to add new fields to votes without migrations
- **Built-in unique indexes**: MongoDB's unique index on email field enforces "one vote per email" at the database level
- **Aggregation framework**: Powerful aggregation pipeline for computing vote counts and rankings
- **Fast development**: Mongoose schemas provide TypeScript support and validation

**Functional Requirements Met**:
- **One vote per email**: Unique index on email field (`unique: true` in schema)
- **Vote aggregation**: MongoDB aggregation pipeline efficiently groups and counts votes by country
- **Fast queries**: Indexed fields enable quick lookups for duplicate email checks

**Non-Functional Requirements Met**:
- **Performance**: Aggregation pipeline is optimized for counting and sorting
- **Data integrity**: Unique constraints prevent duplicate votes at the database level
- **Reliability**: MongoDB's ACID transactions (when needed) ensure data consistency

---

### 3. Zod for Validation
**Decision**: Use Zod for input validation instead of class-validator DTOs.

**Rationale**:
- **Type inference**: Zod schemas automatically infer TypeScript types, reducing code duplication
- **Composable**: Easy to create reusable validation schemas
- **Runtime and compile-time safety**: Validates data at runtime while providing type safety
- **Better error messages**: Descriptive validation errors for API consumers
- **Lightweight**: Smaller bundle size compared to class-validator + class-transformer

**Functional Requirements Met**:
- Validates email format before creating votes
- Ensures country codes are in correct format (3-letter codes)
- Validates required fields (name, email, countryCode, countryName)

**Non-Functional Requirements Met**:
- **Security**: Prevents invalid data from entering the system
- **Usability**: Clear error messages help frontend developers understand validation failures
- **Performance**: Fast validation with minimal overhead

---

### 4. Swagger/OpenAPI Documentation
**Decision**: Implement comprehensive Swagger documentation for all endpoints.

**Rationale**:
- **API discoverability**: Developers can explore and test endpoints interactively
- **Auto-generated docs**: NestJS Swagger decorators generate documentation from code
- **Standardized format**: OpenAPI specification is industry standard
- **Frontend development**: Enables frontend developers to work independently

**Functional Requirements Met**:
- Documents all endpoints: `/votes`, `/countries`, `/health`
- Shows request/response schemas with examples
- Describes error responses and status codes

**Non-Functional Requirements Met**:
- **Developer experience**: Interactive documentation improves collaboration
- **Maintainability**: Documentation stays in sync with code
- **Transparency**: Clear API contracts reduce integration issues

---

## Architecture Decisions

### 5. Modular Architecture
**Decision**: Organize code into feature modules (VotesModule, CountriesModule, HealthModule).

**Rationale**:
- **Separation of concerns**: Each module handles a specific domain
- **Encapsulation**: Modules expose only necessary interfaces
- **Reusability**: Services can be imported across modules
- **Testability**: Modules can be tested in isolation

**Structure**:
```
src/
├── votes/          # Vote creation, top countries
├── countries/      # Country search, details from external API
├── health/         # Database health checks
└── common/         # Shared interfaces, constants
```

**Non-Functional Requirements Met**:
- **Maintainability**: Clear organization makes code easy to navigate
- **Scalability**: New features can be added as separate modules
- **Testability**: Unit tests are organized by module

---

### 6. Caching Strategy
**Decision**: Implement in-memory caching with NestJS Cache Manager for countries and top votes.

**Rationale**:
- **Reduce external API calls**: REST Countries API responses are cached for 1 hour
- **Improve response times**: Top countries query is expensive (aggregation + external API calls), cache for 5 minutes
- **Cache invalidation**: Clear top countries cache when new vote is created
- **Simple implementation**: In-memory cache is sufficient for single-instance deployment

**Cache TTL Strategy**:
- **All countries**: 1 hour (data rarely changes)
- **Top countries**: 5 minutes (frequently updated with new votes)
- **Individual country by code**: 1 hour (static data)

**Functional Requirements Met**:
- Provides fast response times for country search autocomplete
- Handles high read traffic for top countries endpoint

**Non-Functional Requirements Met**:
- **Performance**: Reduces latency from ~500ms to <10ms for cached requests
- **Reliability**: Reduces dependency on external REST Countries API
- **Cost efficiency**: Fewer external API calls

**Trade-offs** (Time Constraints):
- In-memory cache doesn't scale across multiple instances (would need Redis for production)
- No cache warming strategy on startup
- Cache invalidation is simple (could be more sophisticated with tags)

---

### 7. Error Handling Strategy
**Decision**: Implement centralized error handling with NestJS exception filters and custom error messages.

**Rationale**:
- **Consistent error format**: All errors return standard HTTP status codes and messages
- **User-friendly messages**: Custom messages for common scenarios (duplicate email, invalid country)
- **Logging**: All errors are logged with context for debugging
- **Security**: Generic error messages prevent information leakage

**Implementation**:
- ConflictException (409) for duplicate email votes
- BadRequestException (400) for validation failures
- InternalServerErrorException (500) for unexpected errors
- Custom messages defined in `common/constants/messages.ts`

**Functional Requirements Met**:
- Handles "one vote per email" violation gracefully
- Provides actionable error messages to frontend

**Non-Functional Requirements Met**:
- **Usability**: Clear error messages help users understand what went wrong
- **Security**: Doesn't expose internal implementation details
- **Observability**: Structured logging aids in debugging

---

### 8. Rate Limiting (Throttling)
**Decision**: Implement rate limiting with @nestjs/throttler to prevent abuse.

**Rationale**:
- **DoS protection**: Prevents malicious users from overwhelming the API
- **Fair usage**: Ensures all users have equal access
- **Simple implementation**: Built-in NestJS module with decorator support

**Configuration**:
- Default: 10 requests per 60 seconds per IP
- Can be customized per endpoint if needed

**Non-Functional Requirements Met**:
- **Security**: Protects against brute force and DoS attacks
- **Reliability**: Prevents resource exhaustion
- **Fair access**: Rate limits ensure service availability for all users

**Trade-offs** (Time Constraints):
- Basic IP-based rate limiting (could be enhanced with user-based limits)
- No distributed rate limiting (would need Redis for multi-instance deployments)

---

### 9. Health Check Endpoint
**Decision**: Implement `/health` endpoint using @nestjs/terminus.

**Rationale**:
- **Monitoring**: Allows infrastructure to verify service health
- **Database check**: Verifies MongoDB connection is active
- **Kubernetes/Docker compatibility**: Standard endpoint for orchestration tools
- **Early detection**: Identifies issues before they affect users

**Checks Performed**:
- Database connectivity (MongoDB ping)
- Response format: `{ status: 'ok', info: {...}, details: {...} }`

**Non-Functional Requirements Met**:
- **Reliability**: Enables automated health monitoring
- **Observability**: Provides insight into service status
- **DevOps integration**: Standard format for health checks

---

### 10. External API Integration (REST Countries)
**Decision**: Integrate with REST Countries API for country data instead of maintaining a local database.

**Rationale**:
- **Up-to-date data**: Always have latest country information
- **Reduced complexity**: No need to maintain country database
- **Rich data**: Access to flags, capital cities, regions, etc.
- **Free and reliable**: Public API with good uptime

**Implementation**:
- Use @nestjs/axios for HTTP requests
- Cache responses to minimize API calls
- Graceful error handling if API is unavailable
- Only fetch required fields to reduce payload size

**Functional Requirements Met**:
- Provides country autocomplete with accurate names
- Enriches top countries with detailed information (flag, capital, region)

**Non-Functional Requirements Met**:
- **Maintainability**: No need to update country data manually
- **Data accuracy**: Always current and comprehensive

**Trade-offs** (Time Constraints):
- Dependency on external service (could fail, though cached data provides fallback)
- No offline mode (would require local country database)
- Limited control over data format and availability

---

## Security Decisions

### 11. Input Sanitization
**Decision**: Lowercase all emails before storage and comparison.

**Rationale**:
- **Case-insensitive email matching**: `user@example.com` and `User@Example.com` are the same
- **Consistent data**: All emails stored in lowercase format
- **Prevents duplicate votes**: Users can't vote twice with different casing

**Implementation**:
```typescript
email: createVoteDto.email.toLowerCase()
```

**Functional Requirements Met**:
- Enforces "one vote per email" rule reliably

**Non-Functional Requirements Met**:
- **Data integrity**: Consistent email format in database
- **Security**: Prevents case-based duplicate voting

---

### 12. CORS Configuration
**Decision**: Enable CORS with specific origin restrictions (configured for development).

**Rationale**:
- **Frontend integration**: Allows React app to make API requests
- **Security**: Can be restricted to specific domains in production
- **Flexibility**: Easily configurable via environment variables

**Non-Functional Requirements Met**:
- **Security**: Prevents unauthorized cross-origin requests
- **Flexibility**: Can be adjusted for different environments

**Trade-offs** (Time Constraints):
- Development CORS is permissive (should be stricter in production)
- No authentication/authorization implemented (out of scope)

---

## Testing Strategy

### 13. Unit Testing with Jest
**Decision**: Implement comprehensive unit tests for services and controllers.

**Rationale**:
- **Confidence**: Tests verify business logic works correctly
- **Regression prevention**: Catches bugs when making changes
- **Documentation**: Tests serve as usage examples
- **NestJS integration**: Built-in testing utilities make testing easy

**Test Coverage**:
- VotesService: Vote creation, duplicate detection, top countries aggregation
- CountriesService: API integration, caching, search functionality
- Controllers: HTTP request/response handling
- Target coverage: >80% for critical business logic

**Non-Functional Requirements Met**:
- **Reliability**: Tests ensure core functionality works as expected
- **Maintainability**: Tests make refactoring safer
- **Quality**: Automated testing improves code quality

**Trade-offs** (Time Constraints):
- No E2E tests (would require test database setup)
- No integration tests for external REST Countries API
- Limited edge case coverage (focus on happy path and common errors)

---

## Performance Optimizations

### 14. Aggregation Pipeline Optimization
**Decision**: Use MongoDB aggregation pipeline with limit multiplier for top countries.

**Rationale**:
- **Handles API failures**: Fetches extra countries in case some API calls fail
- **Single database query**: Aggregation is more efficient than multiple queries
- **Sorted results**: MongoDB sorts vote counts efficiently with indexes

**Implementation**:
```typescript
// Fetch 2x limit to compensate for potential API failures
{ $limit: limit * 2 }
```

**Non-Functional Requirements Met**:
- **Performance**: Single aggregation query is faster than N queries
- **Reliability**: Gracefully handles external API failures

---

### 15. Selective Field Fetching
**Decision**: Only fetch required fields from REST Countries API.

**Rationale**:
- **Reduced payload**: Smaller responses = faster network transfer
- **Bandwidth savings**: Don't transfer unnecessary data
- **Parsing efficiency**: Less data to process

**Fields fetched**: `name`, `ccn3`, `cca2`, `cca3`, `capital`, `region`, `subregion`, `flags`

**Non-Functional Requirements Met**:
- **Performance**: Faster API responses
- **Efficiency**: Reduced bandwidth usage

---

## Compromises and Trade-offs (Time Constraints)

### 1. In-Memory Caching vs. Redis
**Compromise**: Used in-memory cache instead of distributed cache (Redis).

**Reason**: Time constraint - Redis requires additional infrastructure setup.

**Impact**:
- **Limitation**: Cannot scale horizontally with multiple API instances
- **Production concern**: Cache is lost on server restart
- **Mitigation**: For single-instance deployment, in-memory cache is sufficient

**Future improvement**: Migrate to Redis for production multi-instance deployments.

---

### 2. Authentication & Authorization
**Compromise**: No user authentication or API key system implemented.

**Reason**: Out of scope for MVP; focus on core voting functionality.

**Impact**:
- **Limitation**: API is publicly accessible
- **Security concern**: No way to restrict access or implement user-specific features
- **Mitigation**: Rate limiting provides basic protection

**Future improvement**: Implement JWT-based authentication for user accounts.

---

### 3. Pagination
**Compromise**: No pagination for `/votes` endpoint (gets all votes).

**Reason**: Limited time; expected vote count is manageable.

**Impact**:
- **Limitation**: Performance degrades with large vote datasets
- **Scalability concern**: Could become slow with thousands of votes
- **Mitigation**: Top countries endpoint (primary use case) is limited to 10

**Future improvement**: Implement cursor-based pagination for all list endpoints.

---

### 4. Email Verification
**Compromise**: No email verification (users can vote with any email).

**Reason**: Time constraint; requires email service integration.

**Impact**:
- **Limitation**: Users can enter fake emails
- **Data quality**: No guarantee emails are valid or belong to voter
- **Mitigation**: Email format validation provides basic sanity check

**Future improvement**: Integrate SendGrid/AWS SES for email verification.

---

### 5. Vote Modification/Deletion
**Compromise**: No endpoints to modify or delete votes.

**Reason**: Not in functional requirements; "one vote per email" implies votes are final.

**Impact**:
- **Limitation**: Users cannot change their vote
- **Data correction**: Manual database intervention needed to fix errors
- **Mitigation**: Clear error messages prevent accidental submissions

**Future improvement**: Add "change vote" functionality with email verification.

---

### 6. Advanced Caching Strategies
**Compromise**: Simple cache invalidation (clear entire cache on vote).

**Reason**: Time constraint; more sophisticated cache management is complex.

**Impact**:
- **Limitation**: Cache is cleared completely on every vote
- **Performance**: Could be optimized with granular invalidation
- **Mitigation**: 5-minute TTL on top countries cache limits staleness

**Future improvement**: Implement cache tags for granular invalidation.

---

### 7. Monitoring & Observability
**Compromise**: Basic logging only; no APM or distributed tracing.

**Reason**: Time constraint; requires integration with external services (Datadog, New Relic).

**Impact**:
- **Limitation**: Limited visibility into production issues
- **Debugging**: Harder to trace requests across services
- **Mitigation**: Structured logging provides basic troubleshooting

**Future improvement**: Integrate APM tool (e.g., Datadog, New Relic, Sentry).

---

### 8. Database Transactions
**Compromise**: No use of MongoDB transactions for multi-document operations.

**Reason**: Simple use case; each vote is a single document insert.

**Impact**:
- **Limitation**: No atomic multi-step operations
- **Risk**: In complex scenarios, partial failures could leave inconsistent state
- **Mitigation**: Current operations are simple (single document writes)

**Future improvement**: Use transactions if adding complex workflows.

---

### 9. Input Sanitization for XSS
**Compromise**: No HTML sanitization on text fields (name, email).

**Reason**: Data is validated and stored as-is; frontend should handle rendering safely.

**Impact**:
- **Limitation**: Relies on frontend to prevent XSS
- **Security concern**: If data is rendered in HTML without escaping, XSS possible
- **Mitigation**: Zod validation prevents many malicious inputs

**Future improvement**: Add server-side HTML sanitization with DOMPurify or similar.

---

### 10. E2E Testing
**Compromise**: Only unit tests; no end-to-end tests.

**Reason**: Time constraint; E2E tests require additional setup and maintenance.

**Impact**:
- **Limitation**: Integration issues might not be caught
- **Confidence**: Less confidence in full system behavior
- **Mitigation**: Manual testing covers critical user flows

**Future improvement**: Implement E2E tests with Supertest for API integration tests.

---

## Conclusion

The backend design prioritizes:
1. **Correctness**: "One vote per email" is enforced at multiple levels (validation, database constraint)
2. **Performance**: Caching and aggregation pipelines ensure fast responses
3. **Maintainability**: Modular architecture and TypeScript types make code easy to understand and modify
4. **Developer experience**: Swagger docs and clear error messages aid integration

Key trade-offs were made to deliver a functional MVP within time constraints, primarily around scalability (in-memory cache vs. Redis), security (no authentication), and observability (basic logging). These can be addressed in future iterations without major architectural changes.

The foundation is solid for a production system with appropriate enhancements for scale, security, and monitoring.
