---
sidebar_position: 5
---

# Authentication

**Authentication** provides secure mechanisms for user login, registration, and password recovery. It supports multiple authentication flows, including multi-factor authentication (MFA) and passwordless login, ensuring a robust and flexible experience for users.

### **Purpose**

**Authentication** enables:

1. Secure user login with and without multi-factor authentication (MFA).
2. Passwordless login for enhanced convenience.
3. Public user registration with validation.
4. Password reset workflows using OTP-based verification.

---

## **Structure Authentication**

Please view the structure accessible via [Swagger UI](http://localhost:8080/swagger-ui.html).

---

## Authentication Flows

### **1. Login Without MFA**

Standard username and password authentication.

#### **Flow**

```plantuml
@startuml

actor User #purple


User -[#green]> RestController: Username & password payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: loginUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by username]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

UserApplicationService -[#green]> JwtHelper: Trigger JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate JWT persistence to cache repository
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Store logged-in event
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: Event storage successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return the JWT access token

RestController -[#green]> User: Send the JWT accesss token

@enduml
```

### **2. Login with MFA**

Two-step verification using an additional OTP sent via email or SMS. User can only toggle this from their profile.

1. **Username & Password**: Username and password must be valid before an OTP is sent to the user's email or phone.
2. **OTP Verification**: Verify the OTP sent to the user.

#### **Flow**

```plantuml
@startuml

actor User #purple

== Username & Password Validation & Verification ==

User -[#green]> RestController: Username & password payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: loginUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by username]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

UserApplicationService -[#green]> JwtHelper: Trigger short-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate short-lived JWT persistence to cache repository with expiry
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Dispatch generated OTP
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: OTP dispatch successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return short-lived JWT access token

RestController -[#green]> User: Return short-lived JWT access token

== OTP Verification ==

User -[#green]> RestController: short-lived JWT & OTP from email or phone

RestController -[#green]> UserApplicationService: verifyMfaOtp

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by short-lived JWT]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> CacheRepository: Get the short-lived JWT token
activate CacheRepository #00BFFF

group Repository [Cache repository]
    UserApplicationService <[#green]-- CacheRepository : JWT token with OTP found

    UserApplicationService <[#red]- CacheRepository : JWT token with OTP not found
    deactivate CacheRepository

    RestController <[#red]- UserApplicationService : Invalid OTP

    User <[#red]- RestController : Show invalid OTP message
end

UserApplicationService -[#green]> JwtHelper: Trigger long-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate long-lived JWT persistence to cache repository
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Store logged-in event
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: Event storage successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return the JWT access token

RestController -[#green]> User: Send the JWT accesss token

@enduml
```

### **3. Passwordless Login**

Username-based authentication where an OTP is sent to the registered email or phone. User must have enabled this from their profile

1. **Username**: Username must be valid before an OTP is sent to the user's email or phone.
2. **OTP Verification**: Verify the OTP sent to the user.

#### **Flow**

```plantuml
@startuml

actor User #purple

== Username Validation & Verification ==

User -[#green]> RestController: Username payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: initPasswordLessLogin()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by username]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

UserApplicationService -[#green]> JwtHelper: Trigger short-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate short-lived JWT persistence to cache repository with expiry
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Dispatch generated OTP
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: OTP dispatch successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return success

RestController -[#green]> User: Return success without payload

== OTP Verification ==

User -[#green]> RestController: Username & OTP from email or phone

RestController -[#green]> UserApplicationService: verifyPasswordLessOtp

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by username]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> CacheRepository: Get the short-lived JWT token
activate CacheRepository #00BFFF

group Repository [Cache repository]
    UserApplicationService <[#green]-- CacheRepository : JWT token with OTP found

    UserApplicationService <[#red]- CacheRepository : JWT token with OTP not found
    deactivate CacheRepository

    RestController <[#red]- UserApplicationService : Invalid OTP

    User <[#red]- RestController : Show invalid OTP message
end

UserApplicationService -[#green]> JwtHelper: Trigger long-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate long-lived JWT persistence to cache repository
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Store logged-in event
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: Event storage successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return the JWT access token

RestController -[#green]> User: Send the JWT access token

@enduml
```

### **4. Password Reset**

Enables users to reset forgotten passwords securely using an OTP.

#### **Flow**

```plantuml
@startuml

actor User #purple

== Username Validation & Verification ==

User -[#green]> RestController: Username payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: passwordResetInit()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by username]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

UserApplicationService -[#green]> JwtHelper: Trigger short-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate short-lived JWT persistence to cache repository with expiry
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Dispatch generated OTP
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: OTP dispatch successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return short-lived JWT access token

RestController -[#green]> User: Return success with short-lived JWT access token payload

== OTP & Password Validation & Verification ==

User -[#green]> RestController: New password & OTP from email or phone

RestController -[#green]> UserApplicationService: verifyPasswordReset()

UserApplicationService -[#green]> UserCommandRepository: Fetch user from repository
activate UserCommandRepository #00BFFF

group Repository [Repository get user by JWT access token]
    UserApplicationService <[#green]-- UserCommandRepository : User found

    UserApplicationService <[#red]- UserCommandRepository : User not found
    deactivate UserCommandRepository

    RestController <[#red]- UserApplicationService : Not found

    User <[#red]- RestController : Show not found message
end

UserApplicationService -[#green]> CacheRepository: Get the short-lived JWT token
activate CacheRepository #00BFFF

group Repository [Cache repository]
    UserApplicationService <[#green]-- CacheRepository : JWT token with OTP found

    UserApplicationService <[#red]- CacheRepository : JWT token with OTP not found
    deactivate CacheRepository

    RestController <[#red]- UserApplicationService : Invalid OTP

    User <[#red]- RestController : Show invalid OTP message
end

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

group Transaction [Database transaction]
    UserApplicationService -[#green]> UserCommandRepository: save the new password to persistent storage
    activate UserCommandRepository #00BFFF

    UserCommandRepository -[#green]> UserApplicationService: successfully saved
    deactivate UserCommandRepository

    UserApplicationService -[#green]> EventRepository: Store password changed event
    activate EventRepository #00BFFF

    EventRepository -[#green]> UserApplicationService: Successfully stored event
    deactivate EventRepository
end

UserApplicationService -[#green]> JwtHelper: Trigger long-lived JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate long-lived JWT persistence to cache repository
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Store logged-in event
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: Event storage successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return the JWT access token

RestController -[#green]> User: Send the JWT access token

@enduml
```

### **5. Public Registration**

Allows new users to register and verify their accounts. Right groups marked as public are used to automatically assign a user

#### **Flow**

```plantuml
@startuml

actor User #purple

User -[#green]> RestController: public user creation payload
activate RestController #00BFFF

RestController -[#green]> UserApplicationService: createPublicUser()
activate UserApplicationService #00BFFF

UserApplicationService -[#green]> User_DomainEntity: compute domain entity business rules
activate User_DomainEntity #00BFFF

group Alternative [Business rules]
    UserApplicationService <[#green]-- User_DomainEntity : Business rules passed

    UserApplicationService <[#red]- User_DomainEntity : Business rules failed
    deactivate User_DomainEntity

    RestController <[#red]- UserApplicationService : Business rules error

    User <[#red]- RestController : Show error message
end

group Transaction [Database transaction]
    UserApplicationService -[#green]> UserCommandRepository: save the new user to persistent storage
    activate UserCommandRepository #00BFFF

    UserCommandRepository -[#green]> UserApplicationService: successfully saved
    deactivate UserCommandRepository

    UserApplicationService -[#green]> EventRepository: Store user created event
    activate EventRepository #00BFFF

    EventRepository -[#green]> UserApplicationService: Successfully stored event
    deactivate EventRepository
end

UserApplicationService -[#green]> JwtHelper: Trigger JWT access token generation
activate JwtHelper #00BFFF

JwtHelper -[#green]> UserApplicationService : Returns generated JTW access token
deactivate JwtHelper

UserApplicationService -[#green]> CacheRepository: Initiate JWT persistence to cache repository
activate CacheRepository #00BFFF

CacheRepository -[#green]> UserApplicationService: Persistence successful
deactivate CacheRepository

UserApplicationService -[#green]> EventRepository: Store logged-in event
activate EventRepository #00BFFF

EventRepository -[#green]> UserApplicationService: Event storage successful
deactivate EventRepository

UserApplicationService -[#green]> RestController: return the JWT access token

RestController -[#green]> User: Send the JWT accesss token

@enduml
```
