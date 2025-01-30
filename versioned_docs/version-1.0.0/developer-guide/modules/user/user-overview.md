---
sidebar_position: 1
---

# Overview

The User Module is responsible for managing user-related functionalities, including user creation, authentication, and rights-based access control. It serves as the foundation for all user interactions in the application.

---

## **Core Business Logic**

1. **User Management**:

   - Create, update, delete, and fetch user details.
   - Rights and roles assignment for fine-grained access control.

2. **Authentication**:

   - Handles login, token generation, and validation using JWT.
   - Ensures protected endpoints are accessible only to authorized users.

3. **Rights Management**:
   - Registers rights (e.g., `USER_CREATE_USER`, `USER_DELETE_USER`) in the **Rights Central Registry**.
   - Dynamically checks user permissions for specific actions.

---

## **Customization and Extension**

To modify or extend the User Module:

1. **Adding New Rights**:

   - Define rights in the **Rights Central Registry** under `user-application-services` or equivalent module.
   - Implement logic for the new right in the appropriate layer.

2. **Extending Business Logic**:

   - Add or update methods in the `user-domain-core` for domain-specific changes.
   - Implement new input adapters in `user-application-services` for processing and validation.

3. **API Changes**:
   - Extend or modify REST controllers in the `user-application` module.
   - Use `@Operation` annotations for documenting changes automatically in Swagger UI.

---

## **Integration Points**

- **Security**:

  - JWT token generation and validation are managed in the `user-application-services` module.
  - Global exception handling (`GlobalExceptionHandler`) normalizes authentication errors.

- **Database Interaction**:

  - The `user-dataaccess` module contains adapters to persist and query user data.

- **Rights-Based Access Control**:
  - Collaborates with the Rights Central Registry to enforce permissions dynamically.

---

## **API Documentation**

API endpoints for the User Module are automatically documented and accessible via [Swagger UI](http://localhost:8080/swagger-ui.html).

- **Usage**:  
  Open the Swagger UI to explore available endpoints, request parameters, response structures, and example payloads.

---

## **Screens**

These are screens suggestions that the **user interface** team will implement.

1. **Right Group Management**: Manage rights by adding, modifying and removing from groups.
2. **Right Group Mapping Management**: Allow certain right groups to create user's add them to a batch of right groups
3. **User Management**: CRUD operations on a user
4. **Login**: Login interface
5. **Registration**: Public registration interface
