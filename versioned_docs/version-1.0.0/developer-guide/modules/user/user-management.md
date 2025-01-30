---
sidebar_position: 4
---

# Management

The **User Management** module is responsible for handling user lifecycle operations such as creation, retrieval, updating, and deletion. It integrates seamlessly with the **Rights Central Registry** and **right group mapping** to enforce security, rights-based access, and mapping policies.

---

## Key Concepts

### **Purpose**

The **User Management** module enables:

- Creation of users with predefined right groups.
- Retrieval of user details for administration and auditing.
- Updates to user information, including rights and group associations.
- Secure deletion or deactivation of users.

### **Rights-Based Access**

The service enforces access control through:

1. **Rights Central Registry**: Defines the available rights such as `USER_CREATE_USER`, `USER_VIEW`, `USER_UPDATE`, and `USER_DELETE`.
2. **Right Group Mapping**: Determines which **right groups** can create users and assign specific right groups.

### **Validation**

- All user-related operations must pass validation rules defined by the system.
- Mapping rules are enforced to ensure users are only added to allowed right groups.

---

## **Structure of User**

Please view the structure accessible via [Swagger UI](http://localhost:8080/swagger-ui.html).

---

## CRUD Operations

### **1. Create user**

Add a new user to the system and associate them with specific right groups.

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: User post payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: createUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    UserApplicationService -[#green]> UserCommandRepository: save to persistent storage
    activate UserCommandRepository #00BFFF

    UserCommandRepository -[#green]> UserApplicationService: successfully saved
    deactivate UserCommandRepository

    UserApplicationService -[#green]> EventRepository: Store created event
    activate EventRepository #00BFFF

    EventRepository -[#green]> UserApplicationService: Successfully stored event
    deactivate EventRepository
end

UserApplicationService -[#green]> RestController: return the created user

RestController -[#green]> User: Show the created user

@enduml
```

### **2. Update user**

Update an existing user on the system and associate them with specific right groups.

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: User post payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: updateUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Get the user from repository
activate UserCommandRepository #00BFFF

group Alternative [User record]
    UserApplicationService <[#green]-- UserCommandRepository : User exists

    UserApplicationService <[#red]- UserCommandRepository : User not found

    RestController <[#red]- UserApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: perform domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    UserApplicationService -[#green]> UserCommandRepository: update record in persistent storage

   UserCommandRepository -[#green]> UserApplicationService: successfully updated
   deactivate UserCommandRepository

   UserApplicationService -[#green]> EventRepository: Store updated event
   activate EventRepository #00BFFF

   EventRepository -[#green]> UserApplicationService: Successfully stored event
   deactivate EventRepository
end

UserApplicationService -[#green]> RestController: return the updated user

RestController -[#green]> User: Show the updated user

@enduml
```

### **3. Delete user**

Delete an existing user from the system.

```plantuml
@startuml

actor User #purple

User -[#green]> RestController: User id
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: deleteUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Get the user from repository
activate UserCommandRepository #00BFFF

group Alternative [User record]
    UserApplicationService <[#green]-- UserCommandRepository : User exists

    UserApplicationService <[#red]- UserCommandRepository : User not found

    RestController <[#red]- UserApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: perform domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

group Transaction [Database transaction]
    UserApplicationService -[#green]> UserCommandRepository: Delete record from persistent storage

   UserCommandRepository -[#green]> UserApplicationService: successfully deleted
   deactivate UserCommandRepository

   UserApplicationService -[#green]> EventRepository: Store deleted event
   activate EventRepository #00BFFF

   EventRepository -[#green]> UserApplicationService: Successfully stored event
   deactivate EventRepository
end

UserApplicationService -[#green]> RestController: return success message

RestController -[#green]> User: Show success message

@enduml
```
