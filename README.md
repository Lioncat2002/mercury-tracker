# mercury-tracker
An email tracker written in typescript

## Installation:
Install the dependencies with `npm install`<br>
Create a `.env` in the root of the project with the followinf entries
```env
PORT=3000
REDIS_HOST="REDIS HOST NAME"
REDIS_PASS="REDIS PASSWORD"
```
Run the server with `npm run dev`<br>
However to using with an email you will need to host it somewhere like `fly.io`<br>
You can also run suing the provided Dockerfile

## Usage:
To use it,
add an img tag to your email as an html element
Eg:
```html
<img src='https://mercury-email-tracker.fly.dev/event?userEmail=receiveremail@example.com' alt='Pixel'>
```
When then user opens the email, it will be logged at the /metrics endpoint

## Endpoints:
`GET /events?userEmail=receiveremail@example.com`<br>
Fetches the image to be rendered by the img tag and adds the EmailOpenEvent with the receiver email and their data into the job queue<br>
<br>
`GET /metrics`<br>
Fetches the metrics of last 10 minutes along with number of Opens per OS and device

## Public Endpoint:
https://mercury-email-tracker.fly.dev/
