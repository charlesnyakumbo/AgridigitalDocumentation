---
sidebar_position: 4
---

# Messaging

The **Messaging Module** encapsulates the application's messaging architecture and abstracts the choice of the message bus, providing a simple yet powerful interface for producing and consuming events. This module promotes a decoupled, event-driven design, ensuring scalability and maintainability across the system.

## Purpose

The primary goal of the Messaging Module is to handle inter-module communication via event-driven mechanisms. This allows modules to emit and consume events without tight coupling, enabling flexibility in evolving the system and integrating with different message brokers.

## Features

1. **Event Abstraction**:

   - Abstracts the complexity of the message bus implementation.
   - Supports multiple message brokers (e.g., Apache Pulsar, Kafka).

2. **Annotations for Event Consumption**:

   - Simplifies event consumption with custom annotations.
   - Developers can annotate their classes and methods to handle events without manual wiring.

3. **Outbox Pattern**:

   - Ensures reliable event delivery by maintaining a transactional outbox table.
   - Events are stored in the outbox during database transactions and later published to the message bus.

4. **Producer and Consumer Flexibility**:
   - Producers can emit events to specific topics with minimal configuration.
   - Consumers can subscribe to events by defining a topic and event class.

## Consuming Events

To consume an event in a specific module, annotate the relevant class with `@ProcessMessageContainer`. Use the `@ProcessMessageConsumer` annotation on the method that handles the event.

### Module import

```xml
<dependency>
   <groupId>com.farm</groupId>
   <artifactId>messaging</artifactId>
</dependency>
```

### Consume event

```java
// highlight-start
@ProcessMessageContainer
// highlight-end
@Component
public class UserEventConsumer {

    // highlight-start
    @ProcessMessageConsumer(topic = EventTopic.USER, clazz = UserCreatedEvent.class)
    void consumeMessage(UserCreatedEvent userCreatedEvent) {
    // highlight-end
        // Process the UserCreatedEvent
        System.out.println("New user created: " + userCreatedEvent.getUsername());
    }
}
```
