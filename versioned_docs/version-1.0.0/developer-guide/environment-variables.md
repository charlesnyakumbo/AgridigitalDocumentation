---
sidebar_position: 2
---

# Environment Variables

Customizable environment variables

<div className="custom-table-container">
  <table className="custom-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Default Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>`FARM_APP_PORT`</td>
        <td>Application port</td>
        <td>`6178`</td>
      </tr> 
      <tr>
        <td>`FARM_REDIS_HOST`</td>
        <td>Redis hostname</td>
        <td>`localhost`</td>
      </tr>
      <tr>
        <td>`FARM_REDIS_PORT`</td>
        <td>Redis host port</td>
        <td>`6380`</td>
      </tr>
      <tr>
        <td>`FARM_REDIS_PASSWORD`</td>
        <td>Password for the redis host</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_REDIS_TIMEOUT`</td>
        <td>Redis connection timeout</td>
        <td>`5000`</td>
      </tr>
      <tr>
        <td>`FARM_POSTGRES_USER`</td>
        <td>Postgres host username</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_POSTGRES_PASSWORD`</td>
        <td>Postgres host password</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_JDBC_POSTGRES_URL`</td>
        <td>Postgres jdbc url</td>
        <td>`jdbc:postgresql://localhost:5832/farm`</td>
      </tr>
      <tr>
        <td>`FARM_BASIC_AUTH_USERNAME`</td>
        <td>Basic auth username used to read api docs</td>
        <td>`nil`</td>
      </tr> 
      <tr>
        <td>`FARM_BASIC_AUTH_PASSWORD`</td>
        <td>Basic auth password used to read api docs</td>
        <td>`nil`</td>
      </tr> 
      <tr>
        <td>`FARM_SU_USER_DEFAULT_USERNAME`</td>
        <td>Super user default username</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_SU_USER_DEFAULT_PASSWORD`</td>
        <td>Super user default password</td>
        <td>`nil`</td>
      </tr> 
      <tr>
        <td>`FARM_SU_USER_DEFAULT_PHONE`</td>
        <td>Super user default phone number</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_SU_USER_DEFAULT_EMAIL`</td>
        <td>Super user default email</td>
        <td>`nil`</td>
      </tr>   
      <tr>
        <td>`FARM_SU_USER_DEFAULT_FIRST_NAME`</td>
        <td>Super user first name</td>
        <td>`nil`</td>
      </tr>    
      <tr>
        <td>`FARM_SU_USER_DEFAULT_OTHER_NAMES`</td>
        <td>Super user other names</td>
        <td>`nil`</td>
      </tr> 
      <tr>
        <td>`FARM_OTP_LENGTH`</td>
        <td>Character length of OTP</td>
        <td>`12`</td>
      </tr>    
      <tr>
        <td>`FARM_OTP_EXPIRY_IN_SECONDS`</td>
        <td>OTP expiry in seconds</td>
        <td>`300`</td>
      </tr> 
      <tr>
        <td>`FARM_OTP_COOL_DOWN_PERIOD_SECONDS`</td>
        <td>Wait time before requesting another OTP in seconds</td>
        <td>`60`</td>
      </tr> 
      <tr>
        <td>`FARM_PULSAR_URL`</td>
        <td>Pulsar host name</td>
        <td>`pulsar://localhost:6650`</td>
      </tr>
      <tr>
        <td>`FARM_MESSAGING_SCHEDULER_EVENT_PRODUCER_RATE`</td>
        <td>How frequently are messages read from the outbox table and dispatched to the message bus</td>
        <td>`1000` = Every 1 second</td>
      </tr>
      <tr>
        <td>`FARM_MESSAGING_SCHEDULER_CLEANER_RATE`</td>
        <td>How frequently should the outbox table be cleared of sent events, in milliseconds</td>
        <td>`3600000` = Every 1 hour</td>
      </tr>
      <tr>
        <td>`FARM_DEFAULT_TIME_ZONE`</td>
        <td>Default system timezone</td>
        <td>`Africa/Nairobi`</td>
      </tr>
      <tr>
        <td>`FARM_SENDGRID_API_KEY`</td>
        <td>Sendgrid Api Key</td>
        <td>`nil`</td>
      </tr>
      <tr>
        <td>`FARM_SENDGRID_FROM_EMAIL`</td>
        <td>Sendgrid from email</td>
        <td>`nil`</td>
      </tr>
       <tr>
        <td>`FARM_SENDGRID_FROM_NAME`</td>
        <td>Sendgrid from name</td>
        <td>`nil`</td>
      </tr>
    </tbody>
  </table>
</div>
