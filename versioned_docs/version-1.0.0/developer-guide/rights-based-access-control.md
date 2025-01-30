---
sidebar_position: 1
---

# Key Concepts

This section provides detailed explanations of the essential concepts and patterns that underpin the application's architecture and functionality.

---

#### **Rights-Based Access Control and the Rights Registry**

- **Overview**:  
  The application uses a rights-based approach to manage access control, ensuring fine-grained permissions for different functionalities.

  - Rights are individual permissions (e.g., `USER_CREATE_USER`, `DONATION_DONATE`) registered in the **Rights Central Registry**.
  - Roles are collections of rights that dictate what a user or group can perform.

- **Rights Central Registry**:

  - A central repository where each module registers its specific rights.
  - Promotes modularity and scalability by decoupling rights from roles.
  - New functionality only requires registering additional rights, eliminating the need to modify roles or core configurations.

- **Example**:  
  **User Module Rights**:

  - `USER_LIST_USERS`: Allows fetching a list of all users.
  - `USER_CREATE_USER`: Allows creating new users.

  **Donation Module Rights**:

  - `DONATION_DONATE`: Allows a user to make a donation.
  - `DONOR_TOPUP`: Allows wallet top-ups.

![Central Registry Diagram](/images/central-registry.png)

---

#### **Outbox Pattern for Event-Driven Reliability**

- **Overview**:  
  The application uses the Outbox pattern to ensure reliable event-driven communication.

  - Events are first stored in an **Outbox Table** within the database as part of the same transaction as the data change.
  - A dedicated scheduler processes these outbox entries and dispatches events to the message broker.

- **Advantages**:

  - Guarantees at-least-once delivery by decoupling event generation from event dispatch.
  - Enables resilience in case of transient failures in the message broker.

- **Implementation**:
  - Scheduler and producer components are abstracted in the **Messaging Module**.
  - Modules annotate methods with `@MessageConsumer` to start receiving events.

---

#### **Dependency Injection and Spring Boot Annotations**

- **Overview**:  
  The application heavily relies on **Spring Boot** for its dependency injection and modularity.

- **Core Annotations**:

  - `@Component`, `@Service`, `@Repository`: For defining beans with specific roles.
  - `Constructor Injection`: For injecting dependencies automatically.
  - `@Configuration`: For defining custom configurations.

- **Advantages**:

  - Reduces boilerplate code by managing object lifecycle and dependency resolution.
  - Improves testability by supporting mock dependencies.

- **Best Practices**:
  - Prefer constructor injection for mandatory dependencies.
  - Use `@Qualifier` for injecting specific beans when multiple implementations exist.

---

#### **Error Handling and Logging Standards**

- **Overview**:  
  Centralized error handling and consistent logging improve maintainability and debugging.

- **Error Handling**:

  - `GlobalExceptionHandler` in the **user-application module** centralizes error responses.
  - Exceptions are normalized for HTTP responses using `@ControllerAdvice`.

- **Logging Standards**:

  - Logs are categorized by levels: `INFO`, `WARN`, `ERROR`, `DEBUG`.
  - Use structured logging for easier search and analysis in log aggregation tools (e.g., ELK stack).

- **Best Practices**:
  - Log all unexpected exceptions with sufficient context (e.g., user ID, request details).
  - Avoid logging sensitive information (e.g., passwords, tokens).

---

These concepts form the foundation of the application's architecture and ensure it is robust, secure, and scalable. Developers should understand and adhere to these principles when contributing to the project.
