# edu-core-registries
Edu Core Registries

## Running
1. Clone the repository  
2. Start docker compose, schema configuration from the repository are mounted on registry with this.
    ```
        docker-compose up
    ```
3. Verify the api 
    ```
    curl -v localhost:8081/health

    ....
    < HTTP/1.1 200
    ...
    {"id":"open-saber.registry.health","ver":"1.0","ets":1628838471525,"params":{"resmsgid":"","msgid":"fe01f054-5c6e-4f16-887c-9f1b15cee937","err":"","status":"SUCCESSFUL","errmsg":""},"responseCode":"OK","result":{"name":"opensaber-registry-api","healthy":true,"checks":[{"name":"opensaber.database","healthy":true,"err":"","errmsg":""}]}}
    ```
