---
sidebar_position: 2
---

# Right Group

## **Overview**

A **Right Group** is a logical grouping of rights that defines specific permissions for users in the system. These rights are centrally managed in the **Rights Central Registry** to ensure consistency and reusability across the application. Right Groups enable streamlined permission management by associating predefined sets of rights with users or roles.

---

## **Integration with Rights Central Registry**

The **Rights Central Registry** serves as the single source of truth for all rights in the system. Right Groups interact with this registry to:

- Retrieve available rights.
- Dynamically update or create groups as new rights are added.
- Ensure consistent rights definitions across all modules.

---

## **Structure of Right Groups**

Please view the structure accessible via [Swagger UI](http://localhost:8080/swagger-ui.html).

---

## **CRUD Operations**

### **1. Create Right Group**

To create a right group, select the required rights from the registry and associate them with the group.

#### Workflow

1. Fetch available rights from the Rights Central Registry.
2. Define the group structure and selected rights.
3. Use the service layer to save the group.

#### Create right group sequence diagram

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group post payload
activate RestController #00BFFF

RestController -[#green]> RightGroupApplicationService: createRightGroup()
activate RightGroupApplicationService #00BFFF

RightGroupApplicationService -[#green]> RightGroup_DomainEntity: compute domain entity business rules
activate RightGroup_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupApplicationService <[#green]-- RightGroup_DomainEntity : Business rules passed

    RightGroupApplicationService <[#red]- RightGroup_DomainEntity : Business rules failed
    deactivate RightGroup_DomainEntity

    RestController <[#red]- RightGroupApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    RightGroupApplicationService -[#green]> RightGroupCommandRepository: save to persistent storage
    activate RightGroupCommandRepository #00BFFF

    RightGroupCommandRepository -[#green]> RightGroupApplicationService: successfully saved
    deactivate RightGroupCommandRepository

    RightGroupApplicationService -[#green]> EventRepository: Store created event
    activate EventRepository #00BFFF

    EventRepository -[#green]> RightGroupApplicationService: Successfully stored event
    deactivate EventRepository
end

RightGroupApplicationService -[#green]> RestController: return the created right group

RestController -[#green]> User: Show the created right group

@enduml
```

### **2. Update Right Group**

To update a right group, select the required rights from the registry and associate them with the group.

#### Workflow

1. Fetch available rights from the Rights Central Registry.
2. Define the group structure and selected rights.
3. Use the service layer to save the group.

#### Update right group sequence diagram

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group post payload
activate RestController #00BFFF

RestController -[#green]> RightGroupApplicationService: updateRightGroup()
activate RightGroupApplicationService #00BFFF

RightGroupApplicationService -[#green]> RightGroupCommandRepository: Get the right group from repository
activate RightGroupCommandRepository #00BFFF

group Alternative [Right group record]
    RightGroupApplicationService <[#green]-- RightGroupCommandRepository : Right group exists

    RightGroupApplicationService <[#red]- RightGroupCommandRepository : Right group not found

    RestController <[#red]- RightGroupApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

RightGroupApplicationService -[#green]> RightGroup_DomainEntity: perform domain entity business rules
activate RightGroup_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupApplicationService <[#green]-- RightGroup_DomainEntity : Business rules passed

    RightGroupApplicationService <[#red]- RightGroup_DomainEntity : Business rules failed
    deactivate RightGroup_DomainEntity

    RestController <[#red]- RightGroupApplicationService : Business rules error

    User <[#red]- RestController : Show Error
end

group Transaction [Database transaction]
    RightGroupApplicationService -[#green]> RightGroupCommandRepository: update record in persistent storage

   RightGroupCommandRepository -[#green]> RightGroupApplicationService: successfully updated
   deactivate RightGroupCommandRepository

   RightGroupApplicationService -[#green]> EventRepository: Store updated event
   activate EventRepository #00BFFF

   EventRepository -[#green]> RightGroupApplicationService: Successfully stored event
   deactivate EventRepository
end

RightGroupApplicationService -[#green]> RestController: return the updated right group

RestController -[#green]> User: Show the updated right group

@enduml
```

### **3. Delete Right Group**

To delete a right group, provide the right group id to the service layer for processing

#### Delete right group sequence diagram

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Right group id
activate RestController #00BFFF

RestController -[#green]> RightGroupApplicationService: deleteRightGroup()
activate RightGroupApplicationService #00BFFF

RightGroupApplicationService -[#green]> RightGroupCommandRepository: Get the right group from repository
activate RightGroupCommandRepository #00BFFF

group Alternative [Right group record]
    RightGroupApplicationService <[#green]-- RightGroupCommandRepository : Right group exists

    RightGroupApplicationService <[#red]- RightGroupCommandRepository : Right group not found

    RestController <[#red]- RightGroupApplicationService : Not found exception

    User <[#red]- RestController : Show not found message
end

RightGroupApplicationService -[#green]> RightGroup_DomainEntity: perform domain entity business rules
activate RightGroup_DomainEntity #00BFFF

group Alternative [Business rules]
    RightGroupApplicationService <[#green]-- RightGroup_DomainEntity : Business rules passed

    RightGroupApplicationService <[#red]- RightGroup_DomainEntity : Business rules failed
    deactivate RightGroup_DomainEntity

    RestController <[#red]- RightGroupApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

group Transaction [Database transaction]
    RightGroupApplicationService -[#green]> RightGroupCommandRepository: Delete record from persistent storage

   RightGroupCommandRepository -[#green]> RightGroupApplicationService: successfully deleted
   deactivate RightGroupCommandRepository

   RightGroupApplicationService -[#green]> EventRepository: Store deleted event
   activate EventRepository #00BFFF

   EventRepository -[#green]> RightGroupApplicationService: Successfully stored event
   deactivate EventRepository
end

RightGroupApplicationService -[#green]> RestController: return success message

RestController -[#green]> User: Show success message

@enduml
```
