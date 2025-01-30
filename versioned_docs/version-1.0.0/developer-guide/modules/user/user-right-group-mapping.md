---
sidebar_position: 3
---

# Right Group Mapping

## **Overview**

The **right group mapping** is a crucial entity for implementing fine-grained control over which right groups can create users and assign them to specific right groups. It ensures that the creation of users adheres to strict mapping rules, promoting security and enforcing organizational policies.

## Key Concepts

### **Purpose**

The **right group mapping** determines:

- Which **right groups** are authorized to create users.
- Which **right groups** can be assigned to newly created users by a specific right group.

### **Default Behavior**

By default:

- Right groups with the `USER_CREATE_USER` right cannot create users unless explicitly mapped.
- Any create operation violating the mappings will fail.

### **Mapping Example**

An example of mapping:

- The **Admin Right Group** can create users and add them to:
  - **Farmer Right Group**
  - **Customer Care Right Group**
- The **Admin Right Group** cannot:
  - Add users to the **Donor Right Group**.
  - Add users to the **Admin Right Group** itself.

### **Enforcement**

During user creation, the system validates:

1. The creator's right group.
2. The target right group(s) specified in the request.
3. The mappings in **right group mapping**.

## **Structure of Right Groups Mapping**

Please view the structure accessible via [Swagger UI](http://localhost:8080/swagger-ui.html).

---

## CRUD Operations

### **1. Create Mapping**

Define which right group can assign users to specific right groups.

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group mapping post payload
activate RestController #00BFFF

RestController -[#green]> RightGroupMappingApplicationService: createRightGroupMapping()
activate RightGroupMappingApplicationService #00BFFF

RightGroupMappingApplicationService -[#green]> UserManagementRightGroupMap_DomainEntity: compute domain entity business rules
activate UserManagementRightGroupMap_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupMappingApplicationService <[#green]-- UserManagementRightGroupMap_DomainEntity : Business rules passed

    RightGroupMappingApplicationService <[#red]- UserManagementRightGroupMap_DomainEntity : Business rules failed
    deactivate UserManagementRightGroupMap_DomainEntity

    RestController <[#red]- RightGroupMappingApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    RightGroupMappingApplicationService -[#green]> RightGroupMappingCommandRepository: save to persistent storage
    activate RightGroupMappingCommandRepository #00BFFF

    RightGroupMappingCommandRepository -[#green]> RightGroupMappingApplicationService: successfully saved
    deactivate RightGroupMappingCommandRepository

    RightGroupMappingApplicationService -[#green]> EventRepository: Store created event
    activate EventRepository #00BFFF

    EventRepository -[#green]> RightGroupMappingApplicationService: Successfully stored event
    deactivate EventRepository
end

RightGroupMappingApplicationService -[#green]> RestController: return the mapping

RestController -[#green]> User: Show the mapping

@enduml
```

### **2. Update Mapping**

Similar to create mapping above.

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group post payload
activate RestController #00BFFF

RestController -[#green]> RightGroupMappingApplicationService: updateRightGroupMapping()
activate RightGroupMappingApplicationService #00BFFF

RightGroupMappingApplicationService -[#green]> RightGroupMappingCommandRepository: Get the right group mapping from repository
activate RightGroupMappingCommandRepository #00BFFF

group Alternative [Right group mapping record]
    RightGroupMappingApplicationService <[#green]-- RightGroupMappingCommandRepository : Right group mapping exists

    RightGroupMappingApplicationService <[#red]- RightGroupMappingCommandRepository : Right group mapping not found

    RestController <[#red]- RightGroupMappingApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

RightGroupMappingApplicationService -[#green]> UserManagementRightGroupMap_DomainEntity: perform domain entity business rules
activate UserManagementRightGroupMap_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupMappingApplicationService <[#green]-- UserManagementRightGroupMap_DomainEntity : Business rules passed

    RightGroupMappingApplicationService <[#red]- UserManagementRightGroupMap_DomainEntity : Business rules failed
    deactivate UserManagementRightGroupMap_DomainEntity

    RestController <[#red]- RightGroupMappingApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    RightGroupMappingApplicationService -[#green]> RightGroupMappingCommandRepository: update record in persistent storage

   RightGroupMappingCommandRepository -[#green]> RightGroupMappingApplicationService: successfully updated
   deactivate RightGroupMappingCommandRepository

   RightGroupMappingApplicationService -[#green]> EventRepository: Store updated event
   activate EventRepository #00BFFF

   EventRepository -[#green]> RightGroupMappingApplicationService: Successfully stored event
   deactivate EventRepository
end

RightGroupMappingApplicationService -[#green]> RestController: return the updated right group mapping

RestController -[#green]> User: Show the updated right group

@enduml
```

### **3. Delete Mapping**

Delete mapping to prevent a user with certain right group from creating other users

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group mapping id
activate RestController #00BFFF

RestController -[#green]> RightGroupMappingApplicationService: deleteRightGroupMapping()
activate RightGroupMappingApplicationService #00BFFF

RightGroupMappingApplicationService -[#green]> RightGroupMappingCommandRepository: Get the right group mapping from repository
activate RightGroupMappingCommandRepository #00BFFF

group Alternative [Right group mapping record]
    RightGroupMappingApplicationService <[#green]-- RightGroupMappingCommandRepository : Right group mapping exists

    RightGroupMappingApplicationService <[#red]- RightGroupMappingCommandRepository : Right group mapping not found

    RestController <[#red]- RightGroupMappingApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

RightGroupMappingApplicationService -[#green]> UserManagementRightGroupMap_DomainEntity: perform domain entity business rules
activate UserManagementRightGroupMap_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupMappingApplicationService <[#green]-- UserManagementRightGroupMap_DomainEntity : Business rules passed

    RightGroupMappingApplicationService <[#red]- UserManagementRightGroupMap_DomainEntity : Business rules failed
    deactivate UserManagementRightGroupMap_DomainEntity

    RestController <[#red]- RightGroupMappingApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

group Transaction [Database transaction]
    RightGroupMappingApplicationService -[#green]> RightGroupMappingCommandRepository: Delete record from persistent storage

   RightGroupMappingCommandRepository -[#green]> RightGroupMappingApplicationService: successfully deleted
   deactivate RightGroupMappingCommandRepository

   RightGroupMappingApplicationService -[#green]> EventRepository: Store deleted event
   activate EventRepository #00BFFF

   EventRepository -[#green]> RightGroupMappingApplicationService: Successfully stored event
   deactivate EventRepository
end

RightGroupMappingApplicationService -[#green]> RestController: return success message

RestController -[#green]> User: Show success message

@enduml
```
