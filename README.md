# ReverseProxyDemo

The purpose of this repo is to demonstrate a problem with a NestJS middlware combined with the npm package `http-proxy-middlware`. There's a corresponding StackOverflow post referring to this repo.

## Get apps up and running

1. Clone the repo
2. Run `npm install`
3. Fire up the Todos API via `ng serve todos-api`. Run `curl http://localhost:8090/api` and you should receive a 200 OK response with an array of todos.
4. Fire up the API Gateway via `ng serve api-gateway`. Run `curl http://localhost:8080/api` and you should receive a 200 OK response with a JSON response `{"ok":true}`.

## Re-produce the issue

The following requests are sent to the API Gateway on port `8080` which serves as kind of a reverse proxy for the Todos API which runs on port `8090`.

- Requests made to `http://localhost:8080/api/v1/...` are reverse-proxied through a global functional middleware which is setup in `main.ts`.
- Requests made to `http://localhost:8080/api/v2/...` are reverse-proxied through a NestJS Middlware which is setup in `reverse-proxy.middleware.ts` and registered in `app.module.ts`.

In the following requests you'll see that the GET requests are proxied successfully through both kinds of middlwares. The PUT request, though, is only proxied successfully throug the global functional middlware. Proxying through the Nest JS Middeware fails, the client never receives a response (it's kinda "hanging").

1. Run `curl http://localhost:8080/api/v1/todos-api` and you should receive the array of todos.
2. Run `curl http://localhost:8080/api/v2/todos-api` and you should also receive the array of todos.
3. Run `curl -X PUT -H "Content-Type: application/json" -d "{\"id\": 1, \"userId\": 1, \"title\": \"delectus aut autem - v1\", \"completed\": true}" http://localhost:8080/api/v1/todos-api/1` and you should receive a 200 OK and the todo should have been updated successfully.
4. Run `curl -X PUT -H "Content-Type: application/json" -d "{\"id\": 1, \"userId\": 1, \"title\": \"delectus aut autem - v2\", \"completed\": true}" http://localhost:8080/api/v2/todos-api/1` and you will never receive a response, the request just keeps "hanging".
