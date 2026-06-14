# Mission Detection Route Audit

## Files Inspected
* `src/domains/mission_detection/controller.py`
* `src/domains/mission_detection/service.py`
* `src/domains/mission_detection/schemas.py`
* `src/local_app.py`
* `src/app.py`

## Findings
**Implementation Type:** Mixed Implementation

1. **Controller Layer:** The `MissionDetectionController` uses a strictly AWS Lambda-oriented interface. The method `detect_mission(self, event: dict)` reads from `event.get('body')` and manually parses the JSON.
2. **FastAPI Layer (`local_app.py`):** The endpoint is registered as `@app.post("/detect-mission")` but it **does not** define a Pydantic `payload` parameter in the function signature. Instead, it only accepts `request: Request` and `response: Response`, reads the raw bytes, and packages them into a Lambda-style `event` dictionary.
3. **Lambda Layer (`app.py`):** The route is properly registered to dispatch `POST /detect-mission` directly to the controller, passing the raw AWS `event`.

## Problem Root Cause
Because `local_app.py` lacks a Pydantic `payload` parameter for this route, FastAPI's OpenAPI generator cannot infer the request schema. This results in Swagger showing "No parameters" and omitting the Request Body UI completely.

## Recommended Fix
Refactor `local_app.py` to include `payload: MissionDetectionRequest` in the route definition.
