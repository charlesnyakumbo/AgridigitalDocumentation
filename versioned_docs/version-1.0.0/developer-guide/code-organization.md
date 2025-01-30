---
sidebar_position: 3
---

# Code Organization

The Agritech application follows a modular, layered architecture designed to be dynamic, scalable, and easy to maintain. This section outlines the code organization to help developers navigate and contribute effectively.

## Project Structure Overview

### 1. **Common Module**

- **Type**: Common Module
- **Purpose**: Contains reusable components shared across all modules.
- **Submodules**:
  - **Core Module**:
    - **Purpose**: Provides utility classes, shared configurations, and base classes.
    - **Key Components**:
      - **Central Rights Registry**: Manages the registration of rights.
      - **Public Routes Registry**: Tracks publicly accessible API routes.
      - **Base Classes**:
        - `AggregateRoot`
        - `BaseEntity`
        - `BaseId`
        - `ValueObject` (abstract class for value objects).
      - **Utilities**:
        - Exception classes.
        - Validators (e.g., `ExactLengthValidator`).
        - API response types such as `ApiResponse` and `ListResponse`.
      - **Cache Repository Interface**: Shared caching interface implemented by the Cache module.
    - **Configuration**:
      - Common configurations (e.g., `ObjectMapper`).
  - **Data Module**:
    - **Purpose**: Provides database utility functions and exceptions.
    - **Key Components**:
      - `DataUtil.computeLimitOffset`: Simplifies database query interpretation.
      - `DataException`: Standard exception for data adapters.

### 2. **Cache Module**

- **Type**: Common Module
- **Purpose**: Provides a centralized caching mechanism.
- **Key Components**:
  - Implements the `CacheRepository` interface from the Core module.
  - Responsible for caching data across the application.

### 3. **Infrastructure Module**

- **Type**: Common Module
- **Purpose**: Manages infrastructure-specific configurations and tools.
- **Submodule**:
  - **Docker Directory**:
    - **Purpose**: Contains `docker-compose` files for infrastructure components.
    - **Files**:
      - `postgres.yml`: PostgreSQL database.
      - `redis.yml`: Redis cache.
      - `pulsar.yml`: Apache Pulsar message broker.
    - **Usage**:
      Run specific infrastructure with:
      ```bash
      docker compose -f redis.yml up
      ```

### 4. **Messaging Module**

- **Type**: Common Module
- **Purpose**: Abstracts the implementation of the message broker.
- **Key Features**:
  - Outbox pattern for reliable event delivery.
  - Producer and consumer abstractions.
  - Annotation `@MessageConsumer` for consuming events.

### 5. **Container Module**

- **Type**: Common Module
- **Purpose**: Aggregates all modules.
- **Key Features**:
  - Root module to run the api.
  - Contains port that the application will be served on.
  - Log configuration

### 6. **User Module**

- **Type**: Example Business Module
- **Purpose**: Serves as the template for all other modules.
- **Submodules**:
  1.  **user-domain Module**:
      - **Core Components**:
        - **user-domain-core**: Implements the domain-driven design (DDD) layer.
          - Business logic, aggregate roots, entities, and value objects.
        - **user-application-services**:
          - Handles input adapters and application-specific choreography.
          - Validates input data.
          - Dispatches and consumes events.
          - Contains security configurations (JWT generation).
      - **Key Components**:
        - DTOs, security, and event handling.
  2.  **user-common Module**:
      - **Purpose**: Defines output ports (interfaces).
      - **Usage**: Acts as a contract for the `user-dataaccess` module.
  3.  **user-dataaccess Module**:
      - **Purpose**: Implements the output ports defined in `user-common`.
      - **Key Components**:
        - Adapters for database connectivity and persistence.
  4.  **user-application Module**:
      - **Purpose**: Serves as the presentation layer.
      - **Key Features**:
        - REST API controllers.
        - Centralized error handling with `@ControllerAdvice` See `GlobalExceptionHandler` for sample implementation.
        - Security filters (`JwtAuthorizationFilter`).

:::info

This class **JwtAuthorizationFilter** is already implemented thus you don't have to implement it in your modules

:::

## Central Registry

### 1. **Rights Registry**

To register rights in your module

```java
// highlight-start
import com.farm.common.core.registry.RightsCentralRegistry;
// highlight-end

@AllArgsConstructor
@Configuration
 class MyModuleConfig {
    private final RightsCentralRegistry rightsCentralRegistry;

    @PostConstruct
    void registerMyModuleRights() {
        // highlight-start
        rightsCentralRegistry.registerRights("my-module", Map.of("VIEW_REPORT","Description: View all reports","ADD_SOIL_TEST","Description: Add soil test"));
        // highlight-end
    }
}
```

### 2. **Public Routes Registry**

To register public routes in your module do the following

```java
// highlight-start
import com.farm.common.core.registry.PublicRoutesRegistry;
// highlight-end

@AllArgsConstructor
@Configuration
class MyModuleConfig {
    private final PublicRoutesRegistry publicRoutesRegistry;

    @PostConstruct
    void registerPublicRoutes() {
        // highlight-start
        publicRoutesRegistry.registerPublicRoutes(Set.of("/report/download","/catalogue/list"));
        // highlight-end
    }
}
```

## Authenticated User

To get an instance of the authenticated user object `ExecutionUser` from controllers.

```java
@RestController
@RequestMapping("/my-module")
public class MyModuleController {

    @GetMapping
    ResponseEntity<ApiResponse<ListResponse<RightGroupResponse>>> getUserRightGroups(Authentication authentication) {
        // highlight-start
        ExecutionUser executionUser = (ExecutionUser) authentication.getDetails();
        // highlight-end
        return ResponseEntity.ok(new ApiResponse<>(null, userApplicationService.userRightGroups(new UserId(executionUser.userId().getId()))));
    }

}
```

## Caching

To cache from your module, inject the `CacheRepository` and use its methods

```java
// highlight-start
import com.farm.common.core.repository.CacheRepository;
 // highlight-end

@Component
@AllArgsConstructor
public class MyModuleClass {
    // highlight-start
    private final CacheRepository cacheRepository;
    // highlight-end
}
```

## General Principles for Modules

1. **Separation of Concerns**:

   - Each module handles a specific responsibility.
   - Common functionality is centralized in common modules.

2. **Scalability**:

   - Adding a new module involves replicating the structure of the User module.

3. **Reusability**:

   - Shared logic resides in the Core and Messaging modules to avoid redundancy.

4. **Extendability**:
   - Rights-based access control ensures dynamic updates with minimal changes.

---

This structure ensures the application remains modular, scalable, and maintainable. Developers can follow this guide to add new features, troubleshoot, and understand how modules interact.
